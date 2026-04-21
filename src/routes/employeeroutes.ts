import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee
} from "../controllers/employeeController";

const router = express.Router();

router.get("/employees", getAllEmployees);
router.get("/employee/:id", getEmployeeById);
router.post("/employee", createEmployee);
router.put("/employee/:id", updateEmployee);

export default router;