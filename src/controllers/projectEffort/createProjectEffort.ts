import { Request, Response } from "express";
import { createProjectEffort } from "../../services/projectEffort/createProjectEffort";
import { createProjectEffortSchema } from "../../validations/projectEffort/createProjectEffort";

export const createProjectEffortController = async (req: Request, res: Response) => {
    const validation = createProjectEffortSchema.safeParse(req.body);

if (!validation.success) {
  return res.status(400).json({
    success: false,
    message: validation.error.issues[0].message,
  });
}
  try {
    const result = await createProjectEffort(req.body);

    return res.status(201).json({
      success: true,
      message: "Project effort created successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Create Project Effort Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create project effort",
    });
  }
};