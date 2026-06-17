import {
  Search,
  Plus,
  X,
  FileText,
  ShieldCheck,
  Trash2
} from 'lucide-react';

import { SparkCard, type Policy } from './hrShared.tsx';

interface PoliciesModuleProps {
  policies: Policy[];

  setPolicies: React.Dispatch<
    React.SetStateAction<Policy[]>
  >;

  searchQuery: string;

  setSearchQuery: React.Dispatch<
    React.SetStateAction<string>
  >;

  isAddingPolicy: boolean;

  setIsAddingPolicy: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  policyForm: {
    title: string;
    content: string;
    file: File | null;
    type: 'text' | 'pdf';
  };

  setPolicyForm: React.Dispatch<any>;

  handleAddPolicy: (
    e: React.FormEvent
  ) => void;

  selectedPolicy: Policy | null;

  setSelectedPolicy: React.Dispatch<
    React.SetStateAction<Policy | null>
  >;
}

const PoliciesModule: React.FC<
  PoliciesModuleProps
> = ({
  policies,
  setPolicies,
  searchQuery,
  setSearchQuery,
  isAddingPolicy,
  setIsAddingPolicy,
  policyForm,
  setPolicyForm,
  handleAddPolicy,
  selectedPolicy,
  setSelectedPolicy,
}) => (

  <div className="space-y-6 animate-in slide-in-from-bottom-4">

    {/* HEADER */}
    <div className="flex justify-between items-center flex-wrap gap-4">

      {/* SEARCH */}
      <div className="relative flex-1 max-w-md">

        <Search
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-500
          "
          size={18}
        />

        <input
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          placeholder="Search policies..."
          className="
            w-full
            pl-12
            pr-6
            py-4
            bg-[#F8FAFC]
            border
            border-slate-200
            rounded-3xl
            outline-none
            focus:border-violet-300
            text-slate-800
          "
        />

      </div>

      {/* BUTTON */}
      <button
        onClick={() =>
          setIsAddingPolicy(!isAddingPolicy)
        }
        className="
          bg-[#F3E8FF]
          hover:bg-[#E9D5FF]
          text-violet-700
          px-6
          py-3
          rounded-2xl
          font-black
          text-xs
          uppercase
          flex
          items-center
          gap-2
          transition-all
          ml-4
          border
          border-violet-200
          shadow-md
          hover:scale-105
        "
      >

        {isAddingPolicy ? (
          <X size={16} />
        ) : (
          <Plus size={16} />
        )}

        {isAddingPolicy
          ? 'Cancel'
          : 'New Policy'}

      </button>

    </div>

    {/* ADD POLICY FORM */}
    {isAddingPolicy && (

      <SparkCard
        className="
          p-8
          bg-white/90
          border
          border-slate-200
          rounded-3xl
          shadow-xl
        "
      >

        <h3 className="text-2xl font-black text-violet-700 mb-6">
          Add New Policy
        </h3>

        <form
          onSubmit={handleAddPolicy}
          className="space-y-5"
        >

          {/* TITLE + TYPE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* TITLE */}
            <input
              required
              placeholder="Policy Title"
              className="
                p-4
                bg-[#F8FAFC]
                border
                border-slate-200
                rounded-2xl
                outline-none
                focus:border-violet-300
                text-slate-800
              "
              value={policyForm.title}
              onChange={e =>
                setPolicyForm({
                  ...policyForm,
                  title: e.target.value
                })
              }
            />

            {/* TYPE */}
            <select
              className="
                p-4
                bg-[#F8FAFC]
                border
                border-slate-200
                rounded-2xl
                outline-none
                focus:border-violet-300
                text-slate-800
              "
              value={policyForm.type}
              onChange={e =>
                setPolicyForm({
                  ...policyForm,
                  type:
                    e.target.value as
                      | 'text'
                      | 'pdf'
                })
              }
            >

              <option value="text">
                Text Policy
              </option>

              <option value="pdf">
                PDF Policy
              </option>

            </select>

          </div>

          {/* TEXT CONTENT */}
          {policyForm.type === 'text' ? (

            <textarea
              required
              placeholder="Enter policy content..."
              className="
                w-full
                p-4
                bg-[#F8FAFC]
                border
                border-slate-200
                rounded-2xl
                outline-none
                focus:border-violet-300
                text-slate-800
                h-32
                resize-none
              "
              value={policyForm.content}
              onChange={e =>
                setPolicyForm({
                  ...policyForm,
                  content: e.target.value
                })
              }
            />

          ) : (

            <div className="space-y-4">

              {/* FILE INPUT */}
              <input
                type="file"
                accept=".pdf"
                className="
                  w-full
                  p-4
                  bg-[#F8FAFC]
                  border
                  border-slate-200
                  rounded-2xl
                  text-slate-700
                "
                onChange={(e) =>
                  setPolicyForm({
                    ...policyForm,
                    file:
                      e.target.files?.[0] || null
                  })
                }
              />

            </div>

          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="
              bg-[#EDE9FE]
              hover:bg-[#DDD6FE]
              text-violet-700
              px-8
              py-3
              rounded-2xl
              font-black
              uppercase
              text-xs
              border
              border-violet-200
              transition-all
            "
          >
            Add Policy
          </button>

        </form>

      </SparkCard>

    )}

    {/* POLICIES GRID */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {policies
        .filter(p =>
          p.title
            .toLowerCase()
            .includes(
              searchQuery.toLowerCase()
            )
        )
        .map((policy, index) => (

          <SparkCard
            key={policy.id}
            className={`
              p-6
              transition-all
              hover:scale-[1.02]
              rounded-3xl
              border
              shadow-sm
              ${
                index % 2 === 0
                  ? 'bg-[#EEF4FF] border-blue-100'
                  : 'bg-[#F8F5FF] border-violet-100'
              }
            `}
          >

            {/* TOP */}
            <div className="flex justify-between items-start mb-4">

              <div
                onClick={() =>
                  setSelectedPolicy(policy)
                }
                className={`
                  w-10
                  h-10
                  rounded-xl
                  flex
                  items-center
                  justify-center
                  transition-colors
                  cursor-pointer
                  ${
                    index % 2 === 0
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-violet-100 text-violet-600'
                  }
                `}
              >

                {policy.type === 'pdf'
                  ? (
                    <FileText size={20} />
                  ) : (
                    <ShieldCheck size={20} />
                  )
                }

              </div>

              {/* DELETE */}
              <button
                onClick={() =>
                  setPolicies(
                    policies.filter(
                      p => p.id !== policy.id
                    )
                  )
                }
                className="
                  p-2
                  bg-rose-100
                  text-rose-600
                  rounded-lg
                  transition-all
                  hover:scale-110
                "
              >
                <Trash2 size={14} />
              </button>

            </div>

            {/* TITLE */}
            <h5
              className="
                font-black
                text-slate-800
                mb-3
                text-lg
                cursor-pointer
              "
              onClick={() =>
                setSelectedPolicy(policy)
              }
            >
              {policy.title}
            </h5>

            {/* BOTTOM */}
            <div className="flex justify-between items-center">

              <span
                className={`
                  px-3
                  py-1
                  text-[10px]
                  font-black
                  rounded-full
                  uppercase
                  ${
                    policy.type === 'pdf'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }
                `}
              >
                {policy.type}
              </span>

              <p
                className="
                  text-[10px]
                  text-slate-500
                  uppercase
                  font-black
                  tracking-widest
                "
              >
                Updated:
                {' '}
                {policy.lastUpdated}
              </p>

            </div>

          </SparkCard>

      ))}

    </div>

    {/* POLICY MODAL */}
    {selectedPolicy && (

      <div
        className="
          fixed
          inset-0
          bg-black/40
          backdrop-blur-sm
          flex
          items-center
          justify-center
          z-50
          p-4
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            p-8
            max-w-3xl
            w-full
            max-h-[90vh]
            overflow-y-auto
            shadow-2xl
          "
        >

          {/* TOP */}
          <div className="flex justify-between items-center mb-6">

            <h3 className="text-2xl font-black text-violet-700">
              {selectedPolicy.title}
            </h3>

            <button
              onClick={() =>
                setSelectedPolicy(null)
              }
              className="
                p-2
                bg-rose-100
                text-rose-600
                rounded-xl
              "
            >
              <X size={18} />
            </button>

          </div>

          {/* CONTENT */}
          {selectedPolicy.type === 'pdf' ? (

            <iframe
              src={selectedPolicy.content}
              title={selectedPolicy.title}
              className="
                w-full
                h-[70vh]
                rounded-2xl
                border
                border-slate-200
              "
            />

          ) : (

            <div
              className="
                bg-[#F8FAFC]
                border
                border-slate-200
                rounded-2xl
                p-6
                text-slate-700
                whitespace-pre-wrap
              "
            >
              {selectedPolicy.content}
            </div>

          )}

        </div>

      </div>

    )}

  </div>

);

export default PoliciesModule;