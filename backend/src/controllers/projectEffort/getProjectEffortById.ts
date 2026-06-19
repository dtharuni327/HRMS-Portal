import { Request, Response } from "express";
import { getProjectEffortById } from "../../services/projectEffort/getProjectEffortById";

export const getProjectEffortByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const { effortId } = req.params;

    const result = await getProjectEffortById(Number(effortId));

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Project effort not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Get Project Effort By Id Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch project effort",
    });
  }
};