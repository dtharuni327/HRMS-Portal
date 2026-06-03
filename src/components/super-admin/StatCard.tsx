type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
};

const StatCard = ({
  title,
  value,
  description,
}: StatCardProps) => {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-500">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-black text-slate-900">
        {value}
      </h2>

      {description && (
        <p className="mt-2 text-sm text-slate-600">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;