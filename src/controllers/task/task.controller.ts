import { Request, Response } from "express";
import { createTaskService, getMyTasksService, getAllTasksService, getTaskByIdService, deleteTaskService } from "../../services/task/task.service";
import { TASK_MESSAGES } from "../../constants/task.constants";

export const createTask = async (req: any, res: Response) => {
  try {
    const result = await createTaskService(req.body, req.user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getMyTasks = async (req: any, res: Response) => {
  try {
    const employeeId = req.user?.Emp_id;
    const tasks = await getMyTasksService(employeeId);
    return res.status(200).json({
      message: TASK_MESSAGES.FETCHED,
      data: tasks
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await getAllTasksService();
    return res.status(200).json({
      message: TASK_MESSAGES.FETCHED,
      data: tasks
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getTaskById = async (req: any, res: Response) => {
  try {
    const { taskId } = req.params;
    const employeeId = req.user?.Emp_id;
    const task = await getTaskByIdService(taskId, employeeId);
    return res.status(200).json({
      message: TASK_MESSAGES.FETCHED_ONE,
      data: task
    });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const deleteTask = async (req: any, res: Response) => {
  try {
    const { taskId } = req.params;
    const result = await deleteTaskService(taskId, req.user);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
