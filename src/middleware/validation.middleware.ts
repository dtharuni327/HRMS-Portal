import { Request, Response, NextFunction } from "express";
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