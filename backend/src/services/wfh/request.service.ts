import { createWFHRequest } from '../../repositories/wfh/request.repository';

export const createWFHRequestService = async (empId: string, body: {
  from_date: string;
  to_date: string;
  reason: string;
}) => {
  const from_date = new Date(body.from_date);
  const to_date = new Date(body.to_date);

  if (from_date > to_date) {
    throw new Error('from_date cannot be greater than to_date');
  }

  const wfhRequest = await createWFHRequest({
    empId,
    from_date,
    to_date,
    reason: body.reason,
  });

  if (!wfhRequest) {
    throw new Error('Failed to create WFH request');
  }

  return wfhRequest;
};