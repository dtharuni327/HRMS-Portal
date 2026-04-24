import { Request, Response } from "express";
import db from "../services/config/db";
import bcrypt from "bcrypt";


// ================= REGISTER =================
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 2. Check if user already exists
    const checkQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkQuery, [email], async (err: any, results: any) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (results.length > 0) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      // 3. Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // 4. Insert user
      const insertQuery =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

      db.query(
        insertQuery,
        [name, email, hashedPassword],
        (err: any, result: any) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: "Error creating user",
            });
          }

          return res.status(201).json({
            success: true,
            message: "User registered successfully ✅",
          });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ================= LOGIN =================
export const login = (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // 2. Check user
    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (err: any, results: any) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      const user = results[0];

      // 3. Compare password
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // 4. Success
      return res.status(200).json({
        success: true,
        message: "Login successful ✅",
      });
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};