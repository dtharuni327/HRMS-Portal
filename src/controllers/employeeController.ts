import { Request, Response } from "express";
import { db } from "../config/db";

// 🔹 GET ALL EMPLOYEES (returns array only)
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT * FROM Employee");

    // ✅ returning only data (no wrapper)
    res.status(200).json(rows);

  } catch (error) {
    res.status(500).json({ message: "Error fetching employees" });
  }
};

// 🔹 GET EMPLOYEE BY ID (returns single object)
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

    // ✅ returning single object
    res.status(200).json(rows[0]);

  } catch (error) {
    res.status(500).json({ message: "Error fetching employee" });
  }
};

// 🔹 CREATE EMPLOYEE (auto Emp_id)
export const createEmployee = async (req: Request, res: Response) => {
  const { Name, Email, Phone, Role } = req.body;

  if (!Name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    // get last Emp_id
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

// 🔹 UPDATE EMPLOYEE
export const updateEmployee = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id as string);
  const { Name, Email, Phone, Role } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: "Invalid employee ID" });
  }

  try {
    const [result]: any = await db.query(
      "UPDATE Employee SET Name = ?, Email = ?, Phone = ?, Role = ? WHERE Id = ?",
      [Name, Email, Phone, Role, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee updated successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating employee" });
  }
};