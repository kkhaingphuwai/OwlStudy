import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";

type Props<T> = {
  data: T[];
  columns: any;
};

export function DataTable<T>({ data, columns }: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-separate border-spacing-0">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="bg-slate-50/80 backdrop-blur-sm border-y border-slate-200 p-4 text-left text-[11px] font-black text-slate-500 uppercase tracking-widest first:rounded-tl-2xl last:rounded-tr-2xl"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody className="bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="group transition-all duration-200 hover:bg-orange-50/50"
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="p-4 text-sm font-medium text-slate-600 border-b border-slate-100 group-last:border-none transition-colors"
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}