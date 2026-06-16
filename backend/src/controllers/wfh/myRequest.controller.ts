import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { getMyWFHRequestsService } from '../../services/wfh/myRequest.service';

export const getMyWFHRequests = async (req: AuthRequest, res: Response) => {
  try {
    const empId = req.user?.Emp_id;

    if (!empId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const data = await getMyWFHRequestsService(empId.trim());

    return res.status(200).json({
      success: true,
      message: 'WFH requests fetched successfully',
      data,
    });
  } catch (error: any) {
    console.error('getMyWFHRequests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};