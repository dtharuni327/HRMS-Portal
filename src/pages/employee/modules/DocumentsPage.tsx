import React, { useMemo, useState } from "react";
import {
  Download,
  Eye,
  FileText,
  Filter,
  Search,
  UploadCloud,
  CheckCircle2,
  Clock3,
  FileWarning,
  Files,
} from "lucide-react";
import { motion } from "framer-motion";

type DocumentStatus = "Pending" | "Approved" | "Rejected";

type EmployeeDocument = {
  id: number;
  name: string;
  type: string;
  fileName: string;
  uploadedBy: string;
  employeeId: string;
  uploadedDate: string;
  status: DocumentStatus;
};

const initialDocuments: EmployeeDocument[] = [
  {
    id: 1,
    name: "Aadhar Card",
    type: "Identity",
    fileName: "aadhar-card.pdf",
    uploadedBy: "Ramakrishna",
    employeeId: "EMP-2048",
    uploadedDate: "12 Apr 2026",
    status: "Approved",
  },
];

const cardHover =
  "transition-all duration-300 hover:-translate-y-1 hover:border-[#4b3f72] hover:shadow-[0_12px_30px_rgba(75,63,114,0.18)]";

const statusClass: Record<DocumentStatus, string> = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

const DocumentsPage: React.FC = () => {
  const [documents, setDocuments] =
    useState<EmployeeDocument[]>(initialDocuments);

  const [documentName, setDocumentName] = useState("");
  const [documentType, setDocumentType] = useState("Identity");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | DocumentStatus>(
    "All"
  );
  const [message, setMessage] = useState("");

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(search.toLowerCase()) ||
        doc.type.toLowerCase().includes(search.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ? true : doc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [documents, search, statusFilter]);

  const totalDocs = documents.length;
  const pendingDocs = documents.filter((d) => d.status === "Pending").length;
  const approvedDocs = documents.filter((d) => d.status === "Approved").length;
  const rejectedDocs = documents.filter((d) => d.status === "Rejected").length;

  const handleUpload = () => {
    if (!documentName.trim() || !selectedFile) {
      setMessage("Please enter document name and choose a file.");
      return;
    }

    const newDocument: EmployeeDocument = {
      id: Date.now(),
      name: documentName,
      type: documentType,
      fileName: selectedFile.name,
      uploadedBy: "Ramakrishna",
      employeeId: "EMP-2048",
      uploadedDate: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: "Pending",
    };

    setDocuments((prev) => [newDocument, ...prev]);
    setDocumentName("");
    setDocumentType("Identity");
    setSelectedFile(null);
    setMessage(
      "Document uploaded successfully. It is now pending HR/Manager verification."
    );
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[24px] bg-gradient-to-r from-[#352d52] via-[#4b3f72] to-[#5e4c8d] p-6 text-white"
      >
        <h2 className="text-[30px] font-semibold tracking-tight">Documents</h2>
        <p className="mt-2 text-[14px] text-white/80">
          Upload, track, and manage employee documents for HR and manager review.
        </p>
      </motion.div>

      {/* Summary Cards */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Total Documents</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">
                {totalDocs}
              </p>
            </div>
            <div className="rounded-2xl bg-[#f3f0ff] p-3">
              <Files className="h-5 w-5 text-[#4b3f72]" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Pending Review</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">
                {pendingDocs}
              </p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-3">
              <Clock3 className="h-5 w-5 text-amber-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Approved</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">
                {approvedDocs}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[20px] border border-[#dcd3ff] bg-white p-5 shadow-sm ${cardHover}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[14px] text-[#64748b]">Rejected</p>
              <p className="mt-2 text-[30px] font-semibold text-[#1e293b]">
                {rejectedDocs}
              </p>
            </div>
            <div className="rounded-2xl bg-red-50 p-3">
              <FileWarning className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Upload Document */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-5 ${cardHover}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-[#f3f0ff] p-3">
              <UploadCloud className="h-5 w-5 text-[#4b3f72]" />
            </div>
            <div>
              <h3 className="text-[22px] font-semibold text-[#1e293b]">
                Upload Document
              </h3>
              <p className="text-[14px] text-[#64748b]">
                Uploaded files go to HR and manager for verification.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                Document Name
              </label>
              <input
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
                placeholder="Example: PAN Card, Offer Letter"
                className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 text-[14px] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-medium text-[#1e293b]">
                Document Type
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="h-12 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] px-4 text-[14px] outline-none transition focus:border-[#4b3f72] focus:ring-2 focus:ring-[#ebe4ff]"
              >
                <option>Identity</option>
                <option>HR(Offer letter, Appointment letter, Experience letter)</option>
                <option>Payroll(Salary slips, Form 16)</option>
                <option>Tax(IT proofs)</option>
                <option>Education</option>
                <option>Experience</option>
              </select>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#cdbdf9] bg-[#faf8ff] px-4 py-8 text-center transition hover:border-[#4b3f72]">
              <UploadCloud className="h-8 w-8 text-[#4b3f72]" />
              <p className="mt-3 text-[14px] font-semibold text-[#1e293b]">
                {selectedFile ? selectedFile.name : "Choose file to upload"}
              </p>
              <p className="mt-1 text-[12px] text-[#64748b]">
                PDF, JPG, PNG allowed
              </p>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </label>

            <button
              type="button"
              onClick={handleUpload}
              className="w-full rounded-2xl bg-[#4b3f72] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#352d52]"
            >
              Upload Document
            </button>

            {message && (
              <div className="rounded-2xl bg-[#f8fafc] px-4 py-3 text-[14px] text-[#4b3f72]">
                {message}
              </div>
            )}
          </div>
        </motion.div>

        {/* Documents List */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-[22px] border border-[#dcd3ff] bg-white p-6 shadow-sm xl:col-span-7 ${cardHover}`}
        >
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-[22px] font-semibold text-[#1e293b]">
                My Documents
              </h3>
              <p className="text-[14px] text-[#64748b]">
                Track document status after upload.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search documents..."
                  className="h-11 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] py-2 pl-10 pr-4 text-[14px] outline-none transition focus:border-[#4b3f72] sm:w-[240px]"
                />
              </div>

              <div className="relative">
                <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748b]" />
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as "All" | DocumentStatus)
                  }
                  className="h-11 w-full rounded-2xl border border-[#dcd3ff] bg-[#faf8ff] py-2 pl-10 pr-4 text-[14px] outline-none transition focus:border-[#4b3f72] sm:w-[170px]"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl border border-[#ece7ff] bg-[#faf8ff] p-4 transition-all duration-300 hover:border-[#4b3f72]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white">
                      <FileText className="h-5 w-5 text-[#4b3f72]" />
                    </div>

                    <div>
                      <h4 className="text-[16px] font-semibold text-[#1e293b]">
                        {doc.name}
                      </h4>
                      <p className="mt-1 text-[13px] text-[#64748b]">
                        {doc.fileName} · {doc.type}
                      </p>
                      <p className="mt-1 text-[12px] text-[#64748b]">
                        Uploaded by {doc.uploadedBy} ({doc.employeeId}) on{" "}
                        {doc.uploadedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                        statusClass[doc.status]
                      }`}
                    >
                      {doc.status}
                    </span>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#dcd3ff] bg-white px-3 py-2 text-[13px] font-semibold text-[#4b3f72] transition hover:bg-[#f3f0ff]"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#4b3f72] px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-[#352d52]"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#dcd3ff] bg-[#faf8ff] p-8 text-center">
                <p className="text-[16px] font-semibold text-[#1e293b]">
                  No documents found
                </p>
                <p className="mt-1 text-[14px] text-[#64748b]">
                  Try changing search or filter.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default DocumentsPage;