import { Request, Response } from "express";
import {
  createInternalJobService,
  updateInternalJobService,
  deleteInternalJobService,
  getAllInternalJobsService,
  getActiveInternalJobsService,
  getInternalJobByIdService
} from "../../services/internalJob/internalJob.service";
import { INTERNAL_JOB_MESSAGES } from "../../constants/internalJob.constants";

export const createInternalJob = async (req: Request, res: Response) => {
  try {
    const result = await createInternalJobService(req.body, req.user);
    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateInternalJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const result = await updateInternalJobService(jobId, req.body, req.user);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteInternalJob = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const result = await deleteInternalJobService(jobId, req.user);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllInternalJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await getAllInternalJobsService();
    return res.status(200).json({
      message: INTERNAL_JOB_MESSAGES.FETCHED,
      data: jobs
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getActiveInternalJobs = async (_req: Request, res: Response) => {
  try {
    const jobs = await getActiveInternalJobsService();
    return res.status(200).json({
      message: INTERNAL_JOB_MESSAGES.FETCHED,
      data: jobs
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getInternalJobById = async (req: Request, res: Response) => {
  try {
    const { jobId } = req.params;
    const job = await getInternalJobByIdService(jobId);

    const userRole = req.user?.role?.toUpperCase();
    const jobStatus = String(job?.status ?? job?.Status ?? "").toUpperCase();
    const canViewInactiveJob = userRole === "HR ADMIN" || userRole === "SUPER ADMIN";

    if (!canViewInactiveJob && jobStatus !== "ACTIVE") {
      return res.status(404).json({ message: INTERNAL_JOB_MESSAGES.NOT_FOUND });
    }

    return res.status(200).json({
      message: INTERNAL_JOB_MESSAGES.FETCHED_ONE,
      data: job
    });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};
