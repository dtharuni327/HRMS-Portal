import { Request, Response } from "express";
import { updateProjectEffort } from "../../services/projectEffort/updateProjectEffort";

import {updateProjectEffortSchema} from "../../validations/projectEffort/updateProjectEffort"
export const updateProjectEffortController = async (
  req: Request,
  res: Response
) => {
    const validation = updateProjectEffortSchema.safeParse(req.body);

if (!validation.success) {
  return res.status(400).json({
    success: false,
    message: validation.error.issues[0].message,
  });
}
  try {
    const { effortId } = req.params;

    const result = await updateProjectEffort(
      Number(effortId),
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Project effort updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.error("Update Project Effort Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update project effort",
    });
  }
};