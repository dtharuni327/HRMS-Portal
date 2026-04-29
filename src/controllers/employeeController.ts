import { Request, Response } from "express";
import { db } from "../config/db";

/* ================= VALIDATION HELPERS ================= */

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone: string) =>
  /^[0-9]{10}$/.test(phone);

/* =====================================================
   CREATE EMPLOYEE 
===================================================== */
export const createEmployee = async (req: Request, res: Response) => {
  try {
    let { name, email, phone, department, role } = req.body;

    if (!name || !email || !phone || !department || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    name = name.trim();
    email = email.trim().toLowerCase();
    phone = phone.trim();

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!isValidPhone(phone)) {
      return res.status(400).json({ message: "Phone number must be 10 digits" });
    }

    const [existingEmail]: any = await db.query(
      "SELECT Id FROM Employee WHERE Email = ?",
      [email]
    );
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const [existingPhone]: any = await db.query(
      "SELECT Id FROM Employee WHERE Phone = ?",
      [phone]
    );
    if (existingPhone.length > 0) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    const [result]: any = await db.query(
      "INSERT INTO Employee (Name, Email, Phone, Department, Role, IsActive) VALUES (?, ?, ?, ?, ?, ?)",
      [name, email, phone, department, role, 1]
    );

    const insertId = result.insertId;
    const empId = "E" + String(insertId).padStart(3, "0");

    await db.query(
      "UPDATE Employee SET Emp_id = ? WHERE Id = ?",
      [empId, insertId]
    );

    return res.status(201).json({
      message: "Employee created successfully",
      id: insertId,
      emp_id: empId,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* =====================================================
   UPDATE EMPLOYEE 
===================================================== */
export const updateEmployee = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  let { name, email, phone, department, role, status } = req.body;

  try {
    const [rows]: any = await db.query("SELECT * FROM Employee WHERE Id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const currentEmployee = rows[0];

    const updates: string[] = [];
    const params: any[] = [];

    if (email !== undefined) {
      email = email.trim().toLowerCase();
      if (email !== currentEmployee.Email) {
        if (!isValidEmail(email)) return res.status(400).json({ message: "Invalid email format" });
        const [emailConflict]: any = await db.query("SELECT Id FROM Employee WHERE Email = ? AND Id != ?", [email, id]);
        if (emailConflict.length > 0) return res.status(400).json({ message: "Email already taken" });
      }
      updates.push("Email = ?"); params.push(email);
    }

    if (phone !== undefined) {
      phone = phone.trim();
      if (phone !== currentEmployee.Phone) {
        if (!isValidPhone(phone)) return res.status(400).json({ message: "Phone must be 10 digits" });
        const [phoneConflict]: any = await db.query("SELECT Id FROM Employee WHERE Phone = ? AND Id != ?", [phone, id]);
        if (phoneConflict.length > 0) return res.status(400).json({ message: "Phone number already taken" });
      }
      updates.push("Phone = ?"); params.push(phone);
    }

    if (name !== undefined) { updates.push("Name = ?"); params.push(name.trim()); }
    if (department !== undefined) { updates.push("Department = ?"); params.push(department); }
    if (role !== undefined) { updates.push("Role = ?"); params.push(role); }
    if (status !== undefined) { updates.push("IsActive = ?"); params.push(status); }

    if (updates.length === 0) {
      return res.status(400).json({ message: "No fields provided for update" });
    }

    params.push(id);
    const query = `UPDATE Employee SET ${updates.join(", ")} WHERE Id = ?`;
    await db.query(query, params);

    return res.status(200).json({ message: "Employee updated successfully" });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* =====================================================
   GET ALL EMPLOYEES 
===================================================== */
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { department, role, status, search } = req.query;
    let query = "SELECT * FROM Employee WHERE 1=1";
    const params: any[] = [];

    if (department) { query += " AND Department = ?"; params.push(department); }
    if (role) { query += " AND Role = ?"; params.push(role); }
    if (status) { query += " AND IsActive = ?"; params.push(status); }
    if (search) {
      query += " AND (Name LIKE ? OR Email LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    const [rows]: any = await db.query(query, params);
    return res.status(200).json(rows);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

/* =====================================================
   GET EMPLOYEE BY ID 
===================================================== */
export const getEmployeeById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    const [rows]: any = await db.query("SELECT * FROM Employee WHERE Id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Employee not found" });
    return res.status(200).json(rows[0]);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};
