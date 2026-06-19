<<<<<<< HEAD
import { Request, Response, NextFunction } from "express";
<<<<<<< HEAD
import { ZodSchema, ZodError } from "zod";
import { HTTP_STATUS } from "../constants/employee.constants";

export const validate =
  (schema: ZodSchema, part: "body" | "query" | "params" = "body") => // defaults to body
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req[part] = schema.parse(req[part]); // parse mutates req[part] with coerced/defaulted values
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false,
          message: "Validation failed",
          errors: err.issues.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }
      next(err);
    }
  };
=======
import { validationResult } from "express-validator";

export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  next();
};
>>>>>>> origin/feature/department-roles
=======
import {
  validationResult
} from "express-validator";

import {
  Request,
  Response,
  NextFunction
} from "express";

export const validate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const errors =
    validationResult(req);

  if (!errors.isEmpty()) {

    res.status(400).json({
      success: false,
      errors: errors.array()
    });

    return;
  }

  next();
};
>>>>>>> origin/leave_management-API-kiruthika
