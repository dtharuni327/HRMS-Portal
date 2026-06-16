import {Request,Response,NextFunction} from "express";
import {addLeaveTypeService}
from "../../services/leave/addLeaveType.service";
export const addLeaveType = async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    try{
        const result =
        await addLeaveTypeService(req.body);
        res.status(201).json(result);
    }
    catch(error){
        next(error);
    }
};