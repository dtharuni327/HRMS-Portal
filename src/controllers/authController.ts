import { Request, Response } from "express";
import db from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, Emp_id } = req.body;

    // check required fields
    if (!name || !email || !password || !Emp_id) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check emp_id already exists
    db.query(
      "SELECT * FROM users WHERE Emp_id = ?",
      [Emp_id],
      async (err, result: any) => {
        if (err) return res.status(500).json(err);

        if (result.length > 0) {
          return res.json({ message: "Emp already exist" }); // ✅ your requirement
        }

        // hash password
        const hashed = await bcrypt.hash(password, 10);

        // insert user
        db.query(
          "INSERT INTO users (name, email, password, Emp_id) VALUES (?, ?, ?, ?)",
          [name, email, hashed, Emp_id],
          (err) => {
            if (err) return res.status(500).json(err);

            res.json({ message: "User registered successfully" });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result: any) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.json({ message: "User not found" });
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.json({ message: "Wrong password" });
      }

      // ✅ JWT using .env
      const token = jwt.sign(
        { id: user.id, Emp_id: user.Emp_id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  );
};