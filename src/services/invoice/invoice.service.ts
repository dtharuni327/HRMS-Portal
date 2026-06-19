import { invoiceRepository } from "../../repositories/invoice/invoice.repository";
import { INVOICE_MESSAGES, INVOICE_STATUS } from "../../constants/invoice.constants";

export const createInvoiceService = async (data: any, user: any) => {
  const invoice = await invoiceRepository.createInvoice(data, user);
  return invoice;
};

export const getAllInvoicesService = async () => {
  return await invoiceRepository.getAllInvoices();
};

export const getClientInvoicesService = async (user: any) => {
  const invoices = await invoiceRepository.getAllInvoices();
  if (user?.role?.toUpperCase() === "CLIENT") {
    return invoices.filter(
      (invoice: any) =>
        invoice?.ClientId === user.Emp_id ||
        invoice?.clientId === user.Emp_id ||
        invoice?.client_id === user.Emp_id
    );
  }
  return invoices;
};

export const getInvoiceByIdService = async (invoiceId: string, user: any) => {
  const invoice = await invoiceRepository.getInvoiceById(invoiceId);
  if (!invoice) {
    throw new Error(INVOICE_MESSAGES.NOT_FOUND);
  }

  if (user?.role?.toUpperCase() === "CLIENT") {
    const clientId = invoice?.ClientId ?? invoice?.clientId ?? invoice?.client_id;
    if (!clientId || clientId !== user.Emp_id) {
      throw new Error("Access denied");
    }
  }

  return invoice;
};

export const updateInvoiceService = async (invoiceId: string, data: any, user: any) => {
  const invoice = await invoiceRepository.getInvoiceById(invoiceId);
  if (!invoice) {
    throw new Error(INVOICE_MESSAGES.NOT_FOUND);
  }
  return await invoiceRepository.updateInvoice(invoiceId, data, user);
};

export const updateInvoiceStatusService = async (invoiceId: string, status: string, user: any) => {
  if (!INVOICE_STATUS.includes(status.toUpperCase())) {
    throw new Error(INVOICE_MESSAGES.INVALID_STATUS);
  }

  const invoice = await invoiceRepository.getInvoiceById(invoiceId);
  if (!invoice) {
    throw new Error(INVOICE_MESSAGES.NOT_FOUND);
  }

  return await invoiceRepository.updateInvoiceStatus(invoiceId, status.toUpperCase(), user);
};
