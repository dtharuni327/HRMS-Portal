import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { createWFHRequestService } from '../../services/wfh/request.service';

export const createWFHRequest = async (req: AuthRequest, res: Response) => {
  try {
    const empId = req.user?.Emp_id;

    if (!empId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token - Emp_id missing',
      });
    }

    const { from_date, to_date, reason } = req.body;

    if (!from_date || !to_date || !reason) {
      return res.status(400).json({
        success: false,
        message: 'from_date, to_date, and reason are required',
      });
    }

    const data = await createWFHRequestService(empId.trim(), {
      from_date,
      to_date,
      reason,
    });

    return res.status(201).json({
      success: true,
      message: 'WFH request created successfully',
      data,
    });
  } catch (error: any) {
    console.error('createWFHRequest error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error',
    });
  }
};