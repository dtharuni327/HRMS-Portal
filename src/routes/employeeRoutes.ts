import express from "express";
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
} from "../controllers/employeeController";

// import RBAC middleware
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = express.Router();

// Base: /api/employees

//Only Admin / Manager / Super Admin
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "MANAGER", "SUPER_ADMIN"),
  getAllEmployees
);

// Any logged-in user
router.get("/:id", authenticate, getEmployeeById);

// Only Admin / Super Admin
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  createEmployee
);

//Only Admin / Super Admin
router.put(
  "/:id",
  authenticate,
  authorize("ADMIN", "SUPER_ADMIN"),
  updateEmployee
);

export default router;