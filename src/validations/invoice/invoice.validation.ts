import { body, param } from "express-validator";
import { INVOICE_STATUS } from "../../constants/invoice.constants";

export const createInvoiceValidation = [
  body("clientId")
    .notEmpty()
    .withMessage("Client Id is required")
    .isString()
    .withMessage("Client Id must be a string"),
  body("invoiceDate")
    .optional()
    .isISO8601()
    .withMessage("Invoice date must be a valid ISO date"),
  body("dueDate")
    .notEmpty()
    .withMessage("Due date is required")
    .isISO8601()
    .withMessage("Due date must be a valid ISO date"),
  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
  body("currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string"),
  body("status")
    .optional()
    .isIn(INVOICE_STATUS)
    .withMessage(`Status must be one of: ${INVOICE_STATUS.join(", ")}`),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
];

export const invoiceIdValidation = [
  param("invoiceId")
    .notEmpty()
    .withMessage("Invoice Id is required")
    .isString()
    .withMessage("Invoice Id must be a string")
];

export const updateInvoiceValidation = [
  invoiceIdValidation[0],
  body("clientId")
    .optional()
    .isString()
    .withMessage("Client Id must be a string"),
  body("invoiceDate")
    .optional()
    .isISO8601()
    .withMessage("Invoice date must be a valid ISO date"),
  body("dueDate")
    .optional()
    .isISO8601()
    .withMessage("Due date must be a valid ISO date"),
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Amount must be a positive number"),
  body("currency")
    .optional()
    .isString()
    .withMessage("Currency must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
];

export const updateInvoiceStatusValidation = [
  invoiceIdValidation[0],
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(INVOICE_STATUS)
    .withMessage(`Status must be one of: ${INVOICE_STATUS.join(", ")}`)
];
