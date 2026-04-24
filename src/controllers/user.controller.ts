import { Request, Response } from "express";
import db from "../services/config/db";
import bcrypt from "bcrypt";

export const register = (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const checkQuery = "SELECT * FROM users WHERE email = ?";

    db.query(checkQuery, [email], async (err: any, results: any[]) => {
      if (err) {
        console.error("DB ERROR (REGISTER - CHECK):", err); // 🔥 shows exact error
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (results && results.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery =
          "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";

        db.query(
          insertQuery,
          [name, email, hashedPassword],
          (err: any, result: any) => {
            if (err) {
              console.error("❌ DB ERROR (REGISTER - INSERT):", err);
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
      } catch (hashError) {
        console.error("❌ HASH ERROR:", hashError);
        return res.status(500).json({
          success: false,
          message: "Password hashing failed",
        });
      }
    });

  } catch (error) {
    console.error("❌ SERVER ERROR (REGISTER):", error);
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

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    const query = "SELECT * FROM users WHERE email = ?";

    db.query(query, [email], async (err: any, results: any[]) => {
      if (err) {
        console.error("❌ DB ERROR (LOGIN):", err); // 🔥 exact error
        return res.status(500).json({
          success: false,
          message: "Database error",
        });
      }

      if (!results || results.length === 0) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      try {
        const user = results[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: "Invalid credentials",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Login successful ✅",
        });

      } catch (compareError) {
        console.error("❌ BCRYPT ERROR:", compareError);
        return res.status(500).json({
          success: false,
          message: "Password comparison failed",
        });
      }
    });

  } catch (error) {
    console.error("❌ SERVER ERROR (LOGIN):", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};