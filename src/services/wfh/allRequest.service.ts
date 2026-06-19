import { getAllWFHRequests } from '../../repositories/wfh/allRequest.repository';

export const getAllWFHRequestsService = async (empId: string, role: string) => {
  if (!['SUPER_ADMIN', 'HR_ADMIN', 'MANAGER'].includes(role)) 
  {
    throw new Error('Access denied: Only SUPER_ADMIN, HR_ADMIN, or MANAGER can view all requests');
  }

  return await getAllWFHRequests(empId, role);
};