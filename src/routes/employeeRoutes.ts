import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/employeeController";

const router = express.Router();

// Base: /api/employees
router.get("/", getAllEmployees);       // GET all
router.get("/:id", getEmployeeById);    // GET by ID
router.post("/", createEmployee);       // CREATE
router.put("/:id", updateEmployee);     // UPDATE
router.delete("/:id", deleteEmployee);  // DELETE

export default router;