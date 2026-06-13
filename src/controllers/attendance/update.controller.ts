import { Request, Response } from 'express';
import { updateAttendanceService } from '../../services/attendance/update.service';

export const updateAttendance = async (req: Request, res: Response) => {
  try {
    const empId = req.params.empId;
    const date = req.params.date;

    if (!empId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Emp_id and date are required',
      });
    }

    const updatedData = await updateAttendanceService.updateAttendance(empId, date, req.body);

    return res.status(200).json({
      success: true,
      message: 'Attendance updated successfully',
      data: updatedData,
    });
  } catch (error: any) {
    console.error('UPDATE ATTENDANCE ERROR:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};