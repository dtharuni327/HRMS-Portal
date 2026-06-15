type Column<T> = {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
};

type AdminTableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

const AdminTable = <T extends { id: string }>({ columns, data }: AdminTableProps<T>) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full border-collapse text-left">
        <thead className="bg-slate-800 text-white">
          <tr>
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-3 text-sm font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-6 text-center text-gray-500">
                No data found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="border-t border-gray-200 hover:bg-gray-50">
                {columns.map((column, index) => (
                  <td key={index} className="px-4 py-3 text-sm text-gray-700">
                    {typeof column.accessor === "function"
                      ? column.accessor(row)
                      : String(row[column.accessor])}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;