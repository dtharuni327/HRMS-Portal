import Joi from "joi";
export const teamLeaveCalendarValidation = Joi.object({
  month: Joi.number().optional(),
  year: Joi.number().optional()
});