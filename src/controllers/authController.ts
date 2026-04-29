import { Request, Response } from "express";
import db from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// REGISTER
export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err) => {
      if (err) return res.status(500).json(err);

      res.json({ message: "User registered" });
    }
  );
};

// LOGIN
export const login = (req: Request, res: Response) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err: any, result: any) => {
      if (err) return res.status(500).json(err);

      if (result.length === 0) {
        return res.json({ message: "User not found" });
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.json({ message: "Wrong password" });
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  );
};