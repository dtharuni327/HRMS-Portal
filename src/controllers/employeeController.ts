import { Request, Response } from "express";
import { db } from "../config/db";

// 🔹 GET ALL EMPLOYEES
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM Employee");
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};

// 🔹 GET EMPLOYEE BY ID
export const getEmployeeById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM Employee WHERE Id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Error fetching employee" });
  }
};

// 🔹 CREATE EMPLOYEE (MULTI VALIDATION + AUTO Emp_id)
export const createEmployee = async (req: Request, res: Response) => {
  const { Name, Email, Phone, Role } = req.body;

  const errors: string[] = [];

  // Name required
  if (!Name) {
    errors.push("Name is required");
  }

  // Email validation
  if (Email && !Email.includes("@")) {
    errors.push("Invalid email format");
  }

  // Phone validation
  if (Phone && !/^\d{10}$/.test(Phone)) {
    errors.push("Phone number must be 10 digits");
  }

  // Return all errors together
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const [rows]: any = await db.query(
      "SELECT Emp_id FROM Employee ORDER BY Id DESC LIMIT 1"
    );

    let newEmpId = "E101";

    if (rows.length > 0) {
      const lastEmpId = rows[0].Emp_id;
      const num = parseInt(lastEmpId.substring(1)) + 1;
      newEmpId = "E" + num;
    }

    await db.query(
      "INSERT INTO Employee (Emp_id, Name, Email, Phone, Role) VALUES (?, ?, ?, ?, ?)",
      [newEmpId, Name, Email, Phone, Role]
    );

    res.status(201).json({
      message: "Employee created successfully",
      Emp_id: newEmpId
    });

  } catch (error) {
    res.status(500).json({ message: "Error creating employee" });
  }
};

// 🔹 UPDATE EMPLOYEE (PARTIAL + MULTI VALIDATION)
export const updateEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }

  // Block Id & Emp_id
  if (req.body.Id || req.body.Emp_id) {
    return res.status(400).json({
      message: "Id and Emp_id cannot be updated"
    });
  }

  const { Name, Email, Phone, Role } = req.body;

  const errors: string[] = [];

  // At least one field required
  if (!Name && !Email && !Phone && !Role) {
    errors.push("At least one field is required to update");
  }

  // Email validation
  if (Email && !Email.includes("@")) {
    errors.push("Invalid email format");
  }

  // Phone validation
  if (Phone && !/^\d{10}$/.test(Phone)) {
    errors.push("Phone number must be 10 digits");
  }

  // Return all errors together
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM Employee WHERE Id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const existing = rows[0];

    const updatedName = Name || existing.Name;
    const updatedEmail = Email || existing.Email;
    const updatedPhone = Phone || existing.Phone;
    const updatedRole = Role || existing.Role;

    await db.query(
      "UPDATE Employee SET Name = ?, Email = ?, Phone = ?, Role = ? WHERE Id = ?",
      [updatedName, updatedEmail, updatedPhone, updatedRole, id]
    );

    res.status(200).json({
      message: "Employee updated successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating employee" });
  }
};