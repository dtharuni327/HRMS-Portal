import { Request, Response, NextFunction } from 'express';

export const updateWFHStatusValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];

  if (!req.params.Emp_id) {
    errors.push('Emp_id is required');
  } else if (!/^E\d{3}$/.test(req.params.Emp_id)) {
    errors.push('Invalid Emp_id format (expected E001, E002, etc.)');
  }

  if (!req.body.status) {
    errors.push('status is required');
  } else {
    const normalizedStatus = req.body.status.toUpperCase();
    if (normalizedStatus !== 'APPROVED' && normalizedStatus !== 'REJECTED') {
      errors.push('Status must be APPROVED or REJECTED');
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