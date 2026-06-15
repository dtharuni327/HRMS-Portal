import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { updateWFHStatusService } from '../../services/wfh/update.service';

export const updateWFHStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { Emp_id } = req.params as any;
    const { status } = req.body;

    if (!req.user?.Emp_id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (req.user.role !== 'HR_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      });
    }

    if (!Emp_id || !status) {
      return res.status(400).json({
        success: false,
        message: 'Emp_id and status are required',
      });
    }

    const data = await updateWFHStatusService(
      Emp_id.trim(),
      status,
      req.user.Emp_id.trim()
    );

    return res.status(200).json({
      success: true,
      message: `WFH request ${status.toUpperCase()}`,
      data,
    });
  } catch (error: any) {
    console.error('updateWFHStatus error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};