import { Request, Response } from "express";
import {
  createInvoiceService,
  getAllInvoicesService,
  getClientInvoicesService,
  getInvoiceByIdService,
  updateInvoiceService,
  updateInvoiceStatusService
} from "../../services/invoice/invoice.service";
import { INVOICE_MESSAGES } from "../../constants/invoice.constants";

export const createInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await createInvoiceService(req.body, req.user);
    return res.status(201).json({ message: INVOICE_MESSAGES.CREATED, data: invoice });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllInvoices = async (req: Request, res: Response) => {
  try {
    const invoices = await getAllInvoicesService();
    return res.status(200).json({ message: INVOICE_MESSAGES.FETCHED, data: invoices });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getMyInvoices = async (req: any, res: Response) => {
  try {
    const invoices = await getClientInvoicesService(req.user);
    return res.status(200).json({ message: INVOICE_MESSAGES.FETCHED, data: invoices });
  } catch (error: any) {
    return res.status(500).json({ message: error.message });
  }
};

export const getInvoiceById = async (req: any, res: Response) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await getInvoiceByIdService(invoiceId, req.user);
    return res.status(200).json({ message: INVOICE_MESSAGES.FETCHED_ONE, data: invoice });
  } catch (error: any) {
    return res.status(404).json({ message: error.message });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;
    const invoice = await updateInvoiceService(invoiceId, req.body, req.user);
    return res.status(200).json({ message: INVOICE_MESSAGES.UPDATED, data: invoice });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateInvoiceStatus = async (req: Request, res: Response) => {
  try {
    const { invoiceId } = req.params;
    const { status } = req.body;
    const invoice = await updateInvoiceStatusService(invoiceId, status, req.user);
    return res.status(200).json({ message: INVOICE_MESSAGES.STATUS_UPDATED, data: invoice });
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};
