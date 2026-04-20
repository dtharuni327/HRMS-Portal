import express from 'express';
import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee
} from '../controllers/employeeController';

const router = express.Router();

// GET all
router.get('/employees', getEmployees);

// GET by ID
router.get('/employee/:id', getEmployeeById);

// POST
router.post('/employee', createEmployee);

// PUT
router.put('/employee/:id', updateEmployee);

export default router;