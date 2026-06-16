import { internalJobRepository } from "../../repositories/internalJob/internalJob.repository";
import { INTERNAL_JOB_MESSAGES } from "../../constants/internalJob.constants";

export const createInternalJobService = async (data: any, user: any) => {
  if (data.applicationDeadline && new Date(data.applicationDeadline) <= new Date()) {
    throw new Error(INTERNAL_JOB_MESSAGES.INVALID_DEADLINE);
  }

  const duplicate = await internalJobRepository.checkDuplicate(data.title, data.location);
  if (duplicate) {
    throw new Error(INTERNAL_JOB_MESSAGES.DUPLICATE);
  }

  const job = await internalJobRepository.createInternalJob(data, user);
  return {
    success: true,
    message: INTERNAL_JOB_MESSAGES.CREATED,
    data: job
  };
};

export const updateInternalJobService = async (jobId: string, data: any, user: any) => {
  if (data.applicationDeadline && new Date(data.applicationDeadline) <= new Date()) {
    throw new Error(INTERNAL_JOB_MESSAGES.INVALID_DEADLINE);
  }

  if (data.title || data.location) {
    const duplicate = await internalJobRepository.checkDuplicate(data.title, data.location);
    if (duplicate) {
      throw new Error(INTERNAL_JOB_MESSAGES.DUPLICATE);
    }
  }

  const job = await internalJobRepository.updateInternalJob(jobId, data, user);
  return {
    success: true,
    message: INTERNAL_JOB_MESSAGES.UPDATED,
    data: job
  };
};

export const deleteInternalJobService = async (jobId: string, user: any) => {
  const job = await internalJobRepository.deleteInternalJob(jobId, user);
  return {
    success: true,
    message: INTERNAL_JOB_MESSAGES.DELETED,
    data: job
  };
};

export const getAllInternalJobsService = async () => {
  return await internalJobRepository.getAllInternalJobs();
};

export const getActiveInternalJobsService = async () => {
  return await internalJobRepository.getActiveInternalJobs();
};

export const getInternalJobByIdService = async (jobId: string) => {
  const job = await internalJobRepository.getInternalJobById(jobId);
  if (!job) {
    throw new Error(INTERNAL_JOB_MESSAGES.NOT_FOUND);
  }

  return job;
};
