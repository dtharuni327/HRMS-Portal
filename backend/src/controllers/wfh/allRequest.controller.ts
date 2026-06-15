import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { getAllWFHRequestsService } from '../../services/wfh/allRequest.service';

export const getAllWFHRequests = async (req: AuthRequest, res: Response) => {
  try {
    const empId = req.user?.Emp_id;
    const role = req.user?.role;

    if (!empId || !role) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (role !== 'SUPER_ADMIN' && role !== 'HR_ADMIN' && role !== 'MANAGER') {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Only SUPER_ADMIN, HR_ADMIN, or MANAGER can view all requests',
      });
    }

    const data = await getAllWFHRequestsService(empId.trim(), role);

    return res.status(200).json({
      success: true,
      message: 'All WFH requests fetched successfully',
      data,
    });
  } 
  catch (error: any) 
  {
    console.error('getAllWFHRequests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};