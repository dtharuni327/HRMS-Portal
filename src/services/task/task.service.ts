import { taskRepository } from "../../repositories/task/task.repository";
import { TASK_MESSAGES } from "../../constants/task.constants";

export const createTaskService = async (data: any, user: any) => {
  const duplicate = await taskRepository.checkDuplicate(data.title, data.assignedEmployeeId);
  if (duplicate) {
    throw new Error(TASK_MESSAGES.DUPLICATE);
  }

  const task = await taskRepository.createAndAssignTask(data, user);
  return {
    success: true,
    message: TASK_MESSAGES.CREATED,
    data: task
  };
};

export const getMyTasksService = async (employeeId: string) => {
  return await taskRepository.getTasksByEmployeeId(employeeId);
};

export const getAllTasksService = async () => {
  return await taskRepository.getAllTasks();
};

export const getTaskByIdService = async (taskId: string, employeeId?: string) => {
  const task = await taskRepository.getTaskById(taskId, employeeId);
  if (!task) {
    throw new Error(TASK_MESSAGES.NOT_FOUND);
  }

  return task;
};

export const deleteTaskService = async (taskId: string, user: any) => {
  const task = await taskRepository.getTaskById(taskId);
  if (!task) {
    throw new Error(TASK_MESSAGES.NOT_FOUND);
  }

  const result = await taskRepository.deleteTask(taskId, user);
  return {
    success: true,
    message: TASK_MESSAGES.DELETED,
    data: result
  };
};
