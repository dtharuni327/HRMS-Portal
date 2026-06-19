import { Request, Response, NextFunction } from 'express';
import { getISTDate } from '../../utils/datetime';

export const createWFHRequestValidation = (req: Request, res: Response, next: NextFunction) => {
  const errors: string[] = [];

  if (!req.body.from_date) {
    errors.push('from_date is required');
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.from_date)) {
    errors.push('Invalid from_date format (expected YYYY-MM-DD)');
  }

  if (!req.body.to_date) {
    errors.push('to_date is required');
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(req.body.to_date)) {
    errors.push('Invalid to_date format (expected YYYY-MM-DD)');
  }

  if (!req.body.reason) {
    errors.push('reason is required');
  } else if (req.body.reason.trim().length < 5) {
    errors.push('Reason must be at least 5 characters');
  }

  // Check past dates
  if (req.body.from_date) {
    const today = getISTDate();
    if (req.body.from_date < today) {
      errors.push(`from_date cannot be a past date (today: ${today})`);
    }
  }

  if (req.body.to_date) {
    const today = getISTDate();
    if (req.body.to_date < today) {
      errors.push(`to_date cannot be a past date (today: ${today})`);
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