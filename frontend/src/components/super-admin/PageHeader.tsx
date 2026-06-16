type PageHeaderProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const PageHeader = ({ title, description, actionLabel, onAction }: PageHeaderProps) => {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center text-white">
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-300">{description}</p>}
      </div>

      {actionLabel && (
        <button
          onClick={onAction}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default PageHeader;