import { Request, Response } from "express";
import { db } from "../config/db";


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
    GET ALL EMPLOYEES (WITH FILTERS)
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
   CREATE EMPLOYEE
===================================================== */
/* =====================================================
   CREATE EMPLOYEE
===================================================== */
export const createEmployee = async (req: Request, res: Response) => {
  const { Name, Email, Phone, Role, Department } = req.body;

  // Required fields
  if (!Name || !Email || !Phone || !Department) {
    return res.status(400).json({
      message: "Name, Email, Phone, and Department are required",
    });
  }

  const errors: string[] = [];

  // Email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(Email)) {
    errors.push("Invalid email format");
  }

  // Phone validation
  if (!/^\d{10}$/.test(Phone)) {
    errors.push("Phone number must be 10 digits");
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: errors.join(" and ") });
  }

  try {
    // Check duplicate Email / Phone
    const [existing]: any = await db.query(
      "SELECT Email, Phone FROM Employee WHERE Email = ? OR Phone = ?",
      [Email, Phone]
    );

    if (existing.length > 0) {
      const isEmail = existing.some((e: any) => e.Email === Email);
      const isPhone = existing.some((e: any) => e.Phone === Phone);

      if (isEmail && isPhone) {
        return res.status(409).json({
          message: "Email and Phone already exist",
        });
      } else if (isEmail) {
        return res.status(409).json({ message: "Email already exists" });
      } else {
        return res.status(409).json({ message: "Phone already exists" });
      }
    }

    // Insert employee (with Department)
    const [result]: any = await db.query(
      `INSERT INTO Employee 
       (Name, Email, Phone, Role, Department) 
       VALUES (?, ?, ?, ?, ?)`,
      [Name, Email, Phone, Role, Department]
    );

    // Generate Emp_id (E001, E002...)
    const empId = "E" + String(result.insertId).padStart(3, "0");

    // Update Emp_id
    await db.query(
      "UPDATE Employee SET Emp_id = ? WHERE Id = ?",
      [empId, result.insertId]
    );

    // Response
    res.status(201).json({
      message: "Employee created successfully",
      Id: result.insertId,
      Emp_id: empId,
    });

  } catch (error) {
    console.error("DB ERROR:", error);
    res.status(500).json({
      message: "Error creating employee",
    });
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

