import Joi from "joi";
export const auditLogsValidation =
Joi.object({
  user_id: Joi.number().optional(),
  action: Joi.string().optional(),
  module_name: Joi.string().optional()
});