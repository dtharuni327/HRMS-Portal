import { Request, Response } from "express";
import { registerUser } from "../services/user.service";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    await registerUser({ name, email, password });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    console.error("❌ Register Error:", error.message);

    if (error.message === "EMAIL_EXISTS") {
      return res.status(409).json({ message: "Email already exists" });
    }

    res.status(500).json({ message: "Internal server error" });
  }
};