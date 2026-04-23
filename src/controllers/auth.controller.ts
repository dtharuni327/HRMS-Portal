import { Request, Response } from "express";
import { db } from "../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role } from "../config/roles";

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    // Password validation (min 6 chars)
    if (!password || password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    // Role validation
    if (!Object.values(Role).includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    // role_id
    const [roleRows]: any = await db.execute(
      "SELECT id FROM roles WHERE role_name = ?",
      [role]
    );

    if (roleRows.length === 0) {
      return res.status(400).json({ msg: "Role not found in DB" });
    }

    const role_id = roleRows[0].id;

    //Duplicate email check
    const [existing]: any = await db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.execute(
      "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role_id]
    );

    res.json({ message: "User Registered Successfully" });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};


// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: "Invalid email format" });
    }

    const [rows]: any = await db.execute(
      `SELECT users.*, roles.role_name 
       FROM users 
       JOIN roles ON users.role_id = roles.id 
       WHERE email = ?`,
      [email]
    );

    const user = rows[0];

    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    //Password check
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role_name },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login Success",
      token
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};