import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createInvoiceValidation,
  invoiceIdValidation,
  updateInvoiceValidation,
  updateInvoiceStatusValidation
} from "../validations/invoice/invoice.validation";
import {
  createInvoice,
  getAllInvoices,
  getMyInvoices,
  getInvoiceById,
  updateInvoice,
  updateInvoiceStatus
} from "../controllers/invoice/invoice.controller";

const router = Router();

router.post(
  "/create",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  createInvoiceValidation,
  validate,
  createInvoice
);

router.get(
  "/all",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  getAllInvoices
);

router.get(
  "/my",
  authenticate,
  authorize(["Client", "Finance", "Super Admin"]),
  getMyInvoices
);

router.get(
  "/:invoiceId",
  authenticate,
  authorize(["Client", "Finance", "Super Admin"]),
  invoiceIdValidation,
  validate,
  getInvoiceById
);

router.put(
  "/update/:invoiceId",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  updateInvoiceValidation,
  validate,
  updateInvoice
);

router.put(
  "/status/:invoiceId",
  authenticate,
  authorize(["Finance", "Super Admin"]),
  updateInvoiceStatusValidation,
  validate,
  updateInvoiceStatus
);

export default router;
