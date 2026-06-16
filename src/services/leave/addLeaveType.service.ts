import {addLeaveTypeRepository}
from "../../repositories/leave/addLeaveType.repository";
export const addLeaveTypeService = async(data:any)=>{
    await addLeaveTypeRepository(data);
    return {
        success:true,
        message:"Leave Type Added Successfully"
    };
};