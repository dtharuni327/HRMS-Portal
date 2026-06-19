import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { getTasksValidation } from "../validations/task/getTasks.validation";
import { getTaskByIdValidation } from "../validations/task/getTaskById.validation";
import { addTaskValidation } from "../validations/task/addTask.validation";
import { deleteTaskValidation } from "../validations/task/deleteTask.validation";
import { createTask, getMyTasks, getAllTasks, getTaskById, deleteTask } from "../controllers/task/task.controller";

const router = Router();

router.post(
  "/assign",
  authenticate,
  authorize(["HR Admin", "Manager"]),
  addTaskValidation,
  validate,
  createTask
);

router.get(
  "/all",
  authenticate,
  authorize(["HR Admin", "Manager"]),
  getTasksValidation,
  validate,
  getAllTasks
);

router.get(
  "/my",
  authenticate,
  getMyTasks
);

router.get(
  "/:taskId",
  authenticate,
  getTaskByIdValidation,
  validate,
  getTaskById
);

router.delete(
  "/delete/:taskId",
  authenticate,
  authorize(["HR Admin", "Manager"]),
  deleteTaskValidation,
  validate,
  deleteTask
);

export default router;
