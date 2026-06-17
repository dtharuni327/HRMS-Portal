import { Request, Response } from "express";
import { deleteProjectEffort } from "../../services/projectEffort/deleteProjectEffort";

export const deleteProjectEffortController = async (
  req: Request,
  res: Response
) => {
  try {
    const { effortId } = req.params;

    await deleteProjectEffort(Number(effortId));

    return res.status(200).json({
      success: true,
      message: "Project effort deleted successfully",
    });
  } catch (error: any) {
    console.error("Delete Project Effort Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete project effort",
    });
  }
};