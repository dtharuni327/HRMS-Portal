import { Request, Response, NextFunction } from 'express';

export const updateAttendanceValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];

  if (!req.params.empId) {
    errors.push('Emp_id is required');
  } else if (!/^E\d{3}$/.test(req.params.empId)) {
    errors.push('Invalid Emp_id format (expected E001, E002, etc.)');
  }

  if (!req.params.date) {
    errors.push('Date is required');
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(req.params.date)) {
    errors.push('Invalid date format (expected YYYY-MM-DD)');
  } else {
    const dateObj = new Date(req.params.date);
    if (dateObj.toString() === 'Invalid Date') {
      errors.push('Invalid date value');
    }
  }

  if (req.body.punch_in_time) {
    const punchInPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d{1,3})?$/;
    if (!punchInPattern.test(req.body.punch_in_time)) {
      errors.push('Invalid punch_in_time format (expected YYYY-MM-DD HH:mm:ss or YYYY-MM-DD HH:mm:ss.000)');
    }
  }

  if (req.body.punch_out_time) {
    const punchOutPattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d{1,3})?$/;
    if (!punchOutPattern.test(req.body.punch_out_time)) {
      errors.push('Invalid punch_out_time format (expected YYYY-MM-DD HH:mm:ss or YYYY-MM-DD HH:mm:ss.000)');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors,
    });
  }

  next();
};