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

//for empty showing documents
//const initialDocuments: EmployeeDocument[] = [];



const glassCard =
  "rounded-[24px] border border-white/15 bg-transparent p-6 text-white shadow-none backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:border-cyan-300/40";

const inputClass =
  "h-12 w-full rounded-2xl border border-white/15 bg-white/10 px-4 text-[14px] text-white outline-none backdrop-blur placeholder:text-white/45 transition focus:border-cyan-300/70 focus:ring-2 focus:ring-cyan-300/20";

const statusClass: Record<DocumentStatus, string> = {
  Pending: "border border-amber-300/20 bg-amber-400/15 text-amber-300",
  Approved: "border border-emerald-300/20 bg-emerald-400/15 text-emerald-300",
  Rejected: "border border-red-300/20 bg-red-400/15 text-red-300",
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
    if (!documentName.trim()) {
      setMessage("Please enter document name.");
      return;
    }

    if (!selectedFile) {
      setMessage("Please choose a file.");
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
    <div className="w-full space-y-6 text-white">
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-[28px] border border-cyan-500/10 bg-[#030712] p-6 text-white shadow-[0_18px_70px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
  >
    {/* background image */}
    {/* dark overlay */}
    <div className="absolute inset-0 bg-black/25" />

    {/* glow effects */}
    <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/15 blur-3xl" />

    <div className="absolute -bottom-16 left-20 h-44 w-44 rounded-full bg-violet-500/15 blur-3xl" />

    {/* grid overlay */}
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>

    {/* content */}
    <div className="relative z-10">
      <p className="mb-2 text-[13px] font-medium text-cyan-200">
        Employee Document Center
      </p>

      <h2 className="text-[30px] font-semibold tracking-tight">
        Documents
      </h2>

      <p className="mt-2 text-[14px] text-white/70">
        Upload, track, and manage employee documents for HR and manager review.
      </p>
    </div>
  </motion.div>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Documents", value: totalDocs, icon: Files },
          { label: "Pending Review", value: pendingDocs, icon: Clock3 },
          { label: "Approved", value: approvedDocs, icon: CheckCircle2 },
          { label: "Rejected", value: rejectedDocs, icon: FileWarning },
        ].map((card) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className={glassCard}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[14px] text-white/60">{card.label}</p>
                  <p className="mt-2 text-[30px] font-semibold text-white">
                    {card.value}
                  </p>
                </div>

                <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 shadow-[0_0_25px_rgba(34,211,238,0.18)]">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
  <motion.div
    initial={{ opacity: 0, y: 18 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-[30px] border border-cyan-500/10 bg-[#030712] p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl xl:col-span-5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_24px_90px_rgba(34,211,238,0.16)]"
  >
    {/* background image */}

    <div className="absolute inset-0 bg-black/25" />

    {/* glow effects */}
    <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-cyan-500/10 blur-3xl" />

    <div className="absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

    {/* grid overlay */}
    <div className="absolute inset-0 opacity-[0.03]">
      <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>

    {/* content */}
    <div className="relative z-10">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3 shadow-[0_0_25px_rgba(34,211,238,0.18)] backdrop-blur-md">
          <UploadCloud className="h-5 w-5 text-cyan-300" />
        </div>

        <div>
          <h3 className="text-[22px] font-semibold text-white">
            Upload Document
          </h3>

          <p className="text-[14px] text-white/60">
            Uploaded files go to HR and manager for verification.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* document name */}
        <div>
          <label className="mb-2 block text-[14px] font-medium text-white/80">
            Document Name
          </label>

          <input
            value={documentName}
            onChange={(e) => {
              setDocumentName(e.target.value);
              setMessage("");
            }}
            placeholder="Example: PAN Card, Offer Letter"
            className={inputClass}
          />
        </div>

        {/* document type */}
        <div>
          <label className="mb-2 block text-[14px] font-medium text-white/80">
            Document Type
          </label>

          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className={inputClass}
          >
            <option className="bg-[#0f172a] text-white">Identity</option>

            <option className="bg-[#0f172a] text-white">
              HR(Offer letter, Appointment letter, Experience letter)
            </option>

            <option className="bg-[#0f172a] text-white">
              Payroll(Salary slips, Form 16)
            </option>

            <option className="bg-[#0f172a] text-white">
              Tax(IT proofs)
            </option>

            <option className="bg-[#0f172a] text-white">
              Education
            </option>

            <option className="bg-[#0f172a] text-white">
              Experience
            </option>
          </select>
        </div>

        {/* upload area */}
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/10 px-4 py-8 text-center backdrop-blur-md transition hover:border-cyan-300/60 hover:bg-white/15">
          <UploadCloud className="h-8 w-8 text-cyan-300" />

          <p className="mt-3 text-[14px] font-semibold text-white">
            {selectedFile ? selectedFile.name : "Choose file to upload"}
          </p>

          <p className="mt-1 text-[12px] text-white/50">
            PDF, JPG, PNG allowed
          </p>

          <input
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => {
              setSelectedFile(e.target.files?.[0] || null);
              setMessage("");
            }}
          />
        </label>

        {/* button */}
        <button
          type="button"
          onClick={handleUpload}
          className="w-full rounded-2xl bg-emerald-500 px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-emerald-400"
        >
          Upload Document
        </button>

        {/* message */}
        {message && (
          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-[14px] text-cyan-200 backdrop-blur-md">
            {message}
          </div>
        )}
      </div>
    </div>
  </motion.div>

        <motion.div
  initial={{ opacity: 0, y: 18 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative overflow-hidden rounded-[30px] border border-cyan-500/10 bg-[#030712] p-6 text-white shadow-[0_20px_80px_rgba(0,0,0,0.55)] backdrop-blur-2xl xl:col-span-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-[0_24px_90px_rgba(34,211,238,0.16)]"
>
  {/* background image removed */}
  <div className="absolute inset-0 bg-black/30" />

  <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-cyan-400/15 blur-3xl" />

  <div className="absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

  <div className="absolute inset-0 opacity-[0.03]">
    <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[size:40px_40px]" />
  </div>

  <div className="relative z-10">
    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h3 className="text-[22px] font-semibold text-white">
          My Documents
        </h3>

        <p className="text-[14px] text-white/60">
          Track document status after upload.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search documents..."
            className="h-11 w-full rounded-2xl border border-white/15 bg-white/10 py-2 pl-10 pr-4 text-[14px] text-white outline-none backdrop-blur placeholder:text-white/45 transition focus:border-cyan-300/70 sm:w-[240px]"
          />
        </div>

        <div className="relative">
          <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "All" | DocumentStatus)
            }
            className="h-11 w-full rounded-2xl border border-white/15 bg-white/10 py-2 pl-10 pr-4 text-[14px] text-white outline-none backdrop-blur transition focus:border-cyan-300/70 sm:w-[170px]"
          >
            <option className="bg-[#0f172a] text-white" value="All">
              All Status
            </option>

            <option className="bg-[#0f172a] text-white" value="Pending">
              Pending
            </option>

            <option className="bg-[#0f172a] text-white" value="Approved">
              Approved
            </option>

            <option className="bg-[#0f172a] text-white" value="Rejected">
              Rejected
            </option>
          </select>
        </div>
      </div>
    </div>

    <div className="space-y-4">
      {filteredDocuments.map((doc) => (
        <div
          key={doc.id}
          className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10">
                <FileText className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <h4 className="text-[16px] font-semibold text-white">
                  {doc.name}
                </h4>

                <p className="mt-1 text-[13px] text-white/60">
                  {doc.fileName} · {doc.type}
                </p>

                <p className="mt-1 text-[12px] text-white/50">
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
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-[13px] font-semibold text-white"
              >
                <Eye className="h-4 w-4" />
                View
              </button>

              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-emerald-400"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>
        </div>
      ))}

      {filteredDocuments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-white/20 bg-white/10 p-8 text-center backdrop-blur-md">
          <p className="text-[16px] font-semibold text-white">
            No documents found
          </p>

          <p className="mt-1 text-[14px] text-white/60">
            Try changing search or filter.
          </p>
        </div>
      )}
    </div>
  </div>
</motion.div>
      </section>
    </div>
  );
};

export default DocumentsPage;