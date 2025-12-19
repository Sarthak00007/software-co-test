import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useSelector } from 'react-redux';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Table = ({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  pagination = null,
  onPageChange = null,
  className = '',
}) => {
  const { mode } = useSelector((state) => state.theme);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: !!pagination,
  });

  const bgColor = mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const headerBg = mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const textColor = mode === 'dark' ? 'text-white' : 'text-gray-900';
  const textSecondary = mode === 'dark' ? 'text-gray-300' : 'text-gray-500';
  const borderColor = mode === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const hoverBg = mode === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50';

  if (loading) {
    return (
      <div className={`${bgColor} rounded-lg shadow-md p-6`}>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`${bgColor} rounded-lg shadow-md p-6`}>
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} rounded-lg shadow-md overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={headerBg}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header, index) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={`px-6 py-3 text-left text-xs font-medium ${textSecondary} uppercase tracking-wider ${
                      header.column.columnDef.className || ''
                    } ${
                      index < headerGroup.headers.length - 1 && !header.column.columnDef.noBorderRight
                        ? `border-r ${borderColor}`
                        : ''
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={`${bgColor} divide-y ${borderColor}`}>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={`${hoverBg} transition-colors`}>
                {row.getVisibleCells().map((cell) => {
                  const headerIndex = row.getVisibleCells().findIndex(c => c.column.id === cell.column.id);
                  const shouldShowBorder = headerIndex < row.getVisibleCells().length - 1 && !cell.column.columnDef.noBorderRight;
                  
                  return (
                    <td
                      key={cell.id}
                      className={`px-6 py-4 whitespace-nowrap text-sm ${textColor} ${
                        cell.column.columnDef.cellClassName || ''
                      } ${
                        shouldShowBorder ? `border-r ${borderColor}` : ''
                      }`}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className={`${bgColor} px-6 py-4 border-t ${borderColor} flex items-center justify-between`}>
          <div className={`text-sm ${textSecondary}`}>
            Showing {pagination.startIndex + 1}-{Math.min(pagination.endIndex, pagination.total)} of{' '}
            {pagination.total}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange && onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiChevronLeft className="text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => onPageChange && onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiChevronRight className="text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;

