import { Request, Response } from 'express';
import pool from '../config/db';

// GET all employees
export const getEmployees = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query('SELECT * FROM employees');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
};

// GET employee by ID
export const getEmployeeById = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  try {
    const [rows]: any = await pool.query(
      'SELECT * FROM employees WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching employee' });
  }
};

// POST
export const createEmployee = async (req: Request, res: Response) => {
  const { name, role, salary } = req.body;

  if (!name || !role || !salary) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const [result]: any = await pool.query(
      'INSERT INTO employees (name, role, salary) VALUES (?, ?, ?)',
      [name, role, salary]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      role,
      salary
    });
  } catch (err) {
    res.status(500).json({ message: 'Error creating employee' });
  }
};

// PUT
export const updateEmployee = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, role, salary } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ message: 'Invalid ID' });
  }

  try {
    // get existing employee first
    const [rows]: any = await pool.query(
      'SELECT * FROM employees WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    const existing = rows[0];

    const updatedName = name ?? existing.name;
    const updatedRole = role ?? existing.role;
    const updatedSalary = salary ?? existing.salary;

    await pool.query(
      'UPDATE employees SET name = ?, role = ?, salary = ? WHERE id = ?',
      [updatedName, updatedRole, updatedSalary, id]
    );

    res.json({ message: 'Employee updated' });
  } catch (err) {
    console.error(err);   // 👈 keep this for debugging
    res.status(500).json({ message: 'Error updating employee' });
  }
};