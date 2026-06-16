import Joi from "joi";

export const addLeaveTypeValidation = Joi.object({
  leave_type_name: Joi.string().required(),
  max_days: Joi.number().required(),
  carry_forward: Joi.boolean().optional(),
  description: Joi.string().optional()
});