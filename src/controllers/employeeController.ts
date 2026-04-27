import { Request, Response } from "express";
import { db } from "../config/db";

/* =====================================================
   🔹 HELPER: SAFE ID PARSER (FIXED TS ERROR)
===================================================== */
const getId = (req: Request, res: Response): number | null => {
  const idParam = req.params.id;

  if (!idParam || Array.isArray(idParam)) {
    res.status(400).json({ message: "Invalid employee ID" });
    return null;
  }

  const id = parseInt(idParam);

  if (isNaN(id)) {
    res.status(400).json({ message: "Invalid employee ID" });
    return null;
  }

  return id;
};

/* =====================================================
   🔹 GET ALL EMPLOYEES (WITH FILTERS)
===================================================== */
export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const { department, role, status, search } = req.query;

    let query = "SELECT * FROM Employee WHERE 1=1";
    let params: any[] = [];

    if (department) {
      query += " AND Department = ?";
      params.push(department);
    }

    if (role) {
      query += " AND Role = ?";
      params.push(role);
    }

    if (status) {
      query += " AND IsActive = ?";
      params.push(status === "active" ? 1 : 0);
    }

    if (search) {
      query += " AND (LOWER(Name) LIKE ? OR LOWER(Email) LIKE ?)";
      const value = `%${search.toString().toLowerCase()}%`;
      params.push(value, value);
    }

    query += " ORDER BY Id DESC";

    const [rows] = await db.query(query, params);
    res.status(200).json(rows);
  } catch (error) {
    console.error("GET ERROR:", error);
    res.status(500).json({ message: "Error fetching employees" });
  }
};

/* =====================================================
   🔹 GET EMPLOYEE BY ID
===================================================== */
export const getEmployeeById = async (req: Request, res: Response) => {
  const id = getId(req, res);
  if (!id) return;

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
    console.error("GET BY ID ERROR:", error);
    res.status(500).json({ message: "Error fetching employee" });
  }
};

/* =====================================================
   🔹 CREATE EMPLOYEE (TRANSACTION SAFE)
===================================================== */
export const createEmployee = async (req: Request, res: Response) => {
  const { Name, Email, Phone, Role, Department } = req.body;

  if (!Name || !Email || !Phone) {
    return res.status(400).json({
      message: "Name, Email, and Phone are required",
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Check duplicates
    const [existing]: any = await connection.query(
      "SELECT Email, Phone FROM Employee WHERE Email = ? OR Phone = ?",
      [Email, Phone]
    );

    if (existing.length > 0) {
      await connection.rollback();

      const isEmail = existing.some((e: any) => e.Email === Email);
      const isPhone = existing.some((e: any) => e.Phone === Phone);

      return res.status(409).json({
        message: isEmail
          ? "Email already exists"
          : "Phone already exists",
      });
    }

    // Insert employee
    const [result]: any = await connection.query(
      "INSERT INTO Employee (Name, Email, Phone, Role, Department) VALUES (?, ?, ?, ?, ?)",
      [Name, Email, Phone, Role, Department]
    );

    // Generate Emp_id
    const empId = "E" + result.insertId.toString().padStart(3, "0");

    await connection.query(
      "UPDATE Employee SET Emp_id = ? WHERE Id = ?",
      [empId, result.insertId]
    );

    await connection.commit();

    res.status(201).json({
      message: "Employee created successfully",
      Emp_id: empId,
    });

  } catch (error) {
    await connection.rollback();
    console.error("CREATE ERROR:", error);
    res.status(500).json({ message: "Error creating employee" });
  } finally {
    connection.release();
  }
};

/* =====================================================
   🔹 UPDATE EMPLOYEE
===================================================== */
export const updateEmployee = async (req: Request, res: Response) => {
  const id = getId(req, res);
  if (!id) return;

  const { Name, Email, Phone, Role, Department, IsActive } = req.body;

  try {
    const [rows]: any = await db.query(
      "SELECT * FROM Employee WHERE Id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const existing = rows[0];

    const updatedName = Name ?? existing.Name;
    const updatedEmail = Email ?? existing.Email;
    const updatedPhone = Phone ?? existing.Phone;
    const updatedRole = Role ?? existing.Role;
    const updatedDept = Department ?? existing.Department;
    const updatedStatus = IsActive ?? existing.IsActive;

    await db.query(
      `UPDATE Employee 
       SET Name=?, Email=?, Phone=?, Role=?, Department=?, IsActive=? 
       WHERE Id=?`,
      [
        updatedName,
        updatedEmail,
        updatedPhone,
        updatedRole,
        updatedDept,
        updatedStatus,
        id,
      ]
    );

    res.status(200).json({
      message: "Employee updated successfully",
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    res.status(500).json({ message: "Error updating employee" });
  }
};

/* =====================================================
   🔹 DELETE EMPLOYEE
===================================================== */
export const deleteEmployee = async (req: Request, res: Response) => {
  const id = getId(req, res);
  if (!id) return;

  try {
    const [result]: any = await db.query(
      "DELETE FROM Employee WHERE Id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    res.status(500).json({ message: "Error deleting employee" });
  }
};