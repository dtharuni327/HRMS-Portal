import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { z, ZodTypeAny } from "zod";

type ValidationTarget = "body" | "query" | "params";

export function validate(req: Request, res: Response, next: NextFunction): void | Response;
export function validate(schema: ZodTypeAny, target?: ValidationTarget): (req: Request, res: Response, next: NextFunction) => void | Response;
export function validate(
  arg1: Request | ZodTypeAny,
  arg2?: Response | ValidationTarget,
  arg3?: NextFunction
) {
  if (arg1 instanceof z.ZodType || typeof (arg1 as ZodTypeAny)?.safeParse === "function") {
    const schema = arg1 as ZodTypeAny;
    const target = (arg2 as ValidationTarget) ?? "body";

    return (req: Request, res: Response, next: NextFunction) => {
      const parsed = schema.safeParse(req[target]);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          errors: parsed.error.flatten(),
        });
      }

      (req as any)[target] = parsed.data;
      next();
    };
  }

  const req = arg1 as Request;
  const res = arg2 as Response;
  const next = arg3 as NextFunction;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }

  next();
}
