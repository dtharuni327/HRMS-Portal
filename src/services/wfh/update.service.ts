import { updateWFHStatus } from '../../repositories/wfh/update.repository';

export const updateWFHStatusService = async (empId: string, status: string, approvedBy: string) => {
  const normalizedStatus = status.toUpperCase();

  if (normalizedStatus !== 'APPROVED' && normalizedStatus !== 'REJECTED') 
  {
    throw new Error('Status must be APPROVED or REJECTED');
  }

  const request = await updateWFHStatus({
    empId,
    status: normalizedStatus,
    approvedBy,
  });

  if (!request) {
    throw new Error('WFH request not found');
  }

  return request;
};