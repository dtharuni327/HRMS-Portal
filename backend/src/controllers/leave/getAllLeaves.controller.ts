import {Request,Response,NextFunction} from "express";
import {getAllLeavesService} from "../../services/leave/getAllLeaves.service";
export const getAllLeaves = async (req: Request,res: Response,
  next: NextFunction) => {
  try {
    const result =await getAllLeavesService(
        (req as any).user
      );
    return res
      .status(200)
      .json(result);
  } catch (error) {
    next(error);
  }
};