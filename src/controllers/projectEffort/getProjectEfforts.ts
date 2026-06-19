import { Request, Response } from "express";
import { getProjectEfforts } from "../../services/projectEffort/getProjectEfforts";

export const getProjectEffortsController = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await getProjectEfforts();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error("Get Project Efforts Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch project efforts",
    });
  }
};