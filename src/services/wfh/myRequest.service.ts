import { getMyWFHRequests } from '../../repositories/wfh/myRequest.repository';

export const getMyWFHRequestsService = async (empId: string) => {
  return await getMyWFHRequests(empId);
};