import React, {
  type Dispatch,
  type SetStateAction,
  type FC,
  type FormEvent,
  useState
} from 'react';

import {
  FileText,
  CheckCircle2,
  Trash2,
  ExternalLink
} from 'lucide-react';

import {
  SparkCard,
  type Employee,
  type HRDocument,
  type OnboardingEntry
} from '../hrShared';

interface DocumentsModuleProps {
  employees: Employee[];
  onboardingEntries: OnboardingEntry[];
  setOnboardingEntries: Dispatch<SetStateAction<OnboardingEntry[]>>;
  documents: HRDocument[];
  setDocuments: Dispatch<SetStateAction<HRDocument[]>>;
  isAddingOnboard: boolean;
  setIsAddingOnboard: Dispatch<SetStateAction<boolean>>;
  onboardingForm: {
    name: string;
    role: string;
    dept: string;
    startDate: string;
    manager: string;
  };
  setOnboardingForm: Dispatch<SetStateAction<{
    name: string;
    role: string;
    dept: string;
    startDate: string;
    manager: string;
  }>>;
  handleAddOnboarding: (e: FormEvent) => void;
  handleUploadDocument: (
    employeeId: number,
    file: File,
    documentType: string
  ) => void;
  handleMarkOnboarded: (id: number) => void;
  handleMarkOffboarded: (id: number) => void;
}

const REQUIRED_DOCUMENTS = [
  'Aadhaar Card',
  'PAN Card',
  'Resume',
  'Offer Letter',
  'Passport Photo'
];

const TARGET_EMPLOYEE_IDS = Array.from({ length: 15 }, (_, i) => i + 1);

const DocumentsModule: FC<DocumentsModuleProps> = ({
  employees,
  documents,
  setDocuments,
  handleUploadDocument
}) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number>(1);

  // Safe handler to preview/view file in a new browser tab
  const handleViewFile = (doc: HRDocument) => {
    // Check if real file object reference exists from input state flow
    if (doc.file instanceof File || doc.file instanceof Blob) {
      const fileUrl = URL.createObjectURL(doc.file);
      window.open(fileUrl, '_blank');
      
      // Clear allocated memory allocation string after brief delay
      setTimeout(() => URL.revokeObjectURL(fileUrl), 1000);
    } else if (typeof doc.file === 'string') {
      // Fallback for mock strings or remote hosted URLs
      window.open(doc.file, '_blank');
    } else {
      alert("File reference data format unavailable for standard browser rendering.");
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4">

      {/* GRID */}
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT CARD: CONTROL & SLOTS */}
        <SparkCard
          className="
            p-8
            bg-white
            border
            border-slate-200
            rounded-[32px]
          "
        >
          <h3 className="text-2xl font-black text-slate-900 mb-6">
            Select Employee ID
          </h3>

          {/* EMPLOYEE SELECT */}
          <select
            value={selectedEmployeeId}
            onChange={(e) => setSelectedEmployeeId(Number(e.target.value))}
            className="
              w-full
              rounded-3xl
              border
              border-violet-200
              bg-white
              px-5
              py-4
              text-sm
              font-semibold
              text-slate-900
              outline-none
              focus:border-violet-500
            "
          >
            {TARGET_EMPLOYEE_IDS.map((id) => (
              <option key={id} value={id} className="bg-white text-slate-900">
                Employee ID: {id}
              </option>
            ))}
          </select>

          {/* DOCUMENTS CHECKLIST */}
          <div className="mt-8 space-y-4">
            {REQUIRED_DOCUMENTS.map((doc) => {
              const uploadedDocument = documents.find(
                (d) => d.employeeId === selectedEmployeeId && d.type === doc
              );

              return (
                <div
                  key={doc}
                  className="
                    flex
                    items-center
                    justify-between
                    rounded-3xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-5
                    py-4
                  "
                >
                  {/* LEFT INFO */}
                  <div>
                    <div className="flex items-center gap-3">
                      {uploadedDocument ? (
                        <button
                          type="button"
                          onClick={() => handleViewFile(uploadedDocument)}
                          className="font-bold text-violet-600 hover:text-violet-800 hover:underline flex items-center gap-1.5 transition text-left"
                          title="Click to view file"
                        >
                          {doc}
                          <ExternalLink size={13} />
                        </button>
                      ) : (
                        <p className="font-bold text-slate-900">{doc}</p>
                      )}

                      {uploadedDocument && (
                        <div
                          className="
                            flex
                            items-center
                            gap-1
                            rounded-full
                            bg-emerald-100
                            px-3
                            py-1
                            text-[10px]
                            font-black
                            uppercase
                            text-emerald-700
                          "
                        >
                          <CheckCircle2 size={12} />
                          Uploaded
                        </div>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {uploadedDocument
                        ? `${doc} limit reached (1/1)`
                        : `Upload ${doc}`}
                    </p>
                  </div>

                  {/* RIGHT ACTION CONTROLS */}
                  <div className="flex items-center gap-3">
                    {uploadedDocument ? (
                      <button
                        onClick={() => {
                          setDocuments((prev) =>
                            prev.filter(
                              (d) =>
                                !(
                                  d.employeeId === selectedEmployeeId &&
                                  d.type === doc
                                )
                            )
                          );
                        }}
                        type="button"
                        className="
                          flex
                          items-center
                          gap-2
                          rounded-2xl
                          bg-rose-100
                          px-4
                          py-2.5
                          text-xs
                          font-bold
                          text-rose-700
                          transition
                          hover:bg-rose-200
                        "
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    ) : (
                      <label
                        className="
                          cursor-pointer
                          rounded-2xl
                          bg-violet-600
                          px-4
                          py-2.5
                          text-xs
                          font-bold
                          text-white
                          transition
                          hover:bg-violet-700
                        "
                      >
                        Upload
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            const alreadyExists = documents.some(
                              (d) => d.employeeId === selectedEmployeeId && d.type === doc
                            );

                            if (!alreadyExists) {
                              handleUploadDocument(selectedEmployeeId, file, doc);
                            } else {
                              alert(`A file for ${doc} is already uploaded. Please delete it first.`);
                            }
                            
                            e.target.value = '';
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </SparkCard>

        {/* RIGHT CARD: CURRENT FILE VIEWER */}
        <SparkCard
          className="
            p-8
            bg-white
            border
            border-slate-200
            rounded-[32px]
          "
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-black text-slate-900">
                Uploaded Documents
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Files uploaded for Employee ID: {selectedEmployeeId}
              </p>
            </div>

            <div
              className="
                rounded-2xl
                bg-violet-100
                px-4
                py-2
                text-xs
                font-bold
                text-violet-700
              "
            >
              {
                documents.filter((doc) => doc.employeeId === selectedEmployeeId)
                  .length
              }{' '}
              Files
            </div>
          </div>

          {/* FILES SYSTEM OUTPUT */}
          <div className="space-y-4">
            {documents.filter((doc) => doc.employeeId === selectedEmployeeId)
              .length === 0 ? (
              <div
                className="
                  rounded-3xl
                  border
                  border-dashed
                  border-slate-300
                  py-20
                  text-center
                "
              >
                <p className="text-lg font-bold text-slate-700">
                  No Documents Uploaded
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Upload files for this employee ID.
                </p>
              </div>
            ) : (
              documents
                .filter((doc) => doc.employeeId === selectedEmployeeId)
                .map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleViewFile(doc)}
                    className="
                      flex
                      items-center
                      justify-between
                      rounded-3xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-5
                      py-4
                      cursor-pointer
                      hover:bg-slate-100
                      hover:border-violet-300
                      transition-all
                      group
                    "
                    title="Click card to open document"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-slate-900 group-hover:text-violet-700 transition-colors">
                          {doc.type}
                        </p>
                        <span
                          className="
                            rounded-full
                            bg-emerald-100
                            px-2
                            py-1
                            text-[10px]
                            font-black
                            uppercase
                            text-emerald-700
                          "
                        >
                          Uploaded
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                        Uploaded on {doc.uploadedAt} • <span className="text-violet-600 font-semibold inline-flex items-center gap-0.5">View file <ExternalLink size={10}/></span>
                      </p>
                    </div>

                    <div
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-2xl
                        bg-violet-100
                        text-violet-700
                        group-hover:bg-violet-600
                        group-hover:text-white
                        transition-colors
                      "
                    >
                      <FileText size={20} />
                    </div>
                  </div>
                ))
            )}
          </div>
        </SparkCard>

      </div>
    </div>
  );
};

export default DocumentsModule;