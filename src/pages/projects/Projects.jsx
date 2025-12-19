import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  setProjects,
  setLoading,
  setFilters,
  deleteProject,
} from '../../store/slices/projectSlice';
import { projectsApi } from '../../helpers/mockApi';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import DatePicker from '../../components/common/DatePicker';
import SelectColumnsModal from '../../components/common/SelectColumnsModal';
import SelectStatusModal from '../../components/common/SelectStatusModal';
import { FiPlus, FiEdit, FiTrash2, FiFilter, FiRotateCw } from 'react-icons/fi';

const Projects = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading, filters } = useSelector((state) => state.projects);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);
  const [hiddenColumns, setHiddenColumns] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const allColumns = [
    { key: 'customer', label: 'CUSTOMER' },
    { key: 'refNumber', label: 'REF NUMBER' },
    { key: 'projectName', label: 'PROJECT NAME' },
    { key: 'projectNumber', label: 'PROJECT NUMBER' },
    { key: 'areaLocation', label: 'AREA LOCATION' },
    { key: 'address', label: 'ADDRESS' },
    { key: 'status', label: 'STATUS' },
    { key: 'dueDate', label: 'DUE DATE' },
    { key: 'contact', label: 'CONTACT' },
    { key: 'comments', label: 'COMMENTS' },
  ];

  const visibleColumns = allColumns.filter(col => !hiddenColumns.includes(col.key));

  const loadProjects = useCallback(async () => {
    dispatch(setLoading(true));
    try {
      const data = await projectsApi.getAll(filters);
      dispatch(setProjects(data));
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleDateApply = (dates) => {
    if (dates.length > 0) {
      setSelectedDate(dates[0]);
      handleFilterChange('date', dates[0]);
    }
  };

  const handleColumnsApply = (columns) => {
    setHiddenColumns(columns);
  };

  const handleStatusApply = (statuses) => {
    setSelectedStatuses(statuses);
    handleFilterChange('status', statuses.join(','));
  };

  const handleResetFilters = () => {
    setSelectedDate(null);
    setSelectedStatuses([]);
    setHiddenColumns([]);
    dispatch(setFilters({ search: '', status: '', date: '', sortBy: '' }));
  };

  const handleEdit = useCallback((project) => {
    navigate(`/projects/edit/${project.id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm(t('projects.deleteConfirm'))) {
      try {
        await projectsApi.delete(id);
        dispatch(deleteProject(id));
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  }, [dispatch, t]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'In Transit':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Pagination
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProjects = projects.slice(startIndex, endIndex);

  // TanStack Table columns
  const columns = useMemo(() => {
    const cols = [];

    // Customer
    if (visibleColumns.some(c => c.key === 'customer')) {
      cols.push({
        accessorKey: 'customer',
        header: 'CUSTOMER',
        cell: ({ row }) => (
          <span className="text-gray-900 dark:text-white">{row.original.customer}</span>
        ),
      });
    }

    // Ref Number
    if (visibleColumns.some(c => c.key === 'refNumber')) {
      cols.push({
        accessorKey: 'refNumber',
        header: 'REF NUMBER',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">{row.original.refNumber}</span>
        ),
      });
    }

    // Project Reference (nested)
    if (visibleColumns.some(c => c.key === 'projectName') || visibleColumns.some(c => c.key === 'projectNumber')) {
      cols.push({
        id: 'projectReference',
        header: () => (
          <div>
            <div className="text-xs font-normal p-5 text-center">PROJECT REFERENCE</div>
            <div className="grid grid-cols-2 mt-1">
              {visibleColumns.some(c => c.key === 'projectName') && (
                <div className="text-xs font-normal text-right border-r border-gray-200 dark:border-gray-600 pr-2">PROJECT NAME</div>
              )}
              {visibleColumns.some(c => c.key === 'projectNumber') && (
                <div className="text-xs font-normal pl-2">PROJECT NUMBER</div>
              )}
            </div>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <div className="grid grid-cols-2">
              {visibleColumns.some(c => c.key === 'projectName') && (
                <div className="text-sm text-gray-900 dark:text-white text-right border-r border-gray-200 dark:border-gray-600 pr-2">{row.original.projectName}</div>
              )}
              {visibleColumns.some(c => c.key === 'projectNumber') && (
                <div className="text-sm text-gray-500 dark:text-gray-400 pl-2">{row.original.projectNumber}</div>
              )}
            </div>
          </div>
        ),
      });
    }

    // Project Location (nested)
    if (visibleColumns.some(c => c.key === 'areaLocation') || visibleColumns.some(c => c.key === 'address')) {
      cols.push({
        id: 'projectLocation',
        header: () => (
          <div>
            <div className="text-xs font-normal p-5 text-center">PROJECT LOCATION</div>
            <div className="grid grid-cols-2 mt-1">
              {visibleColumns.some(c => c.key === 'areaLocation') && (
                <div className="text-xs font-normal text-right border-r border-gray-200 dark:border-gray-600 pr-2">AREA LOCATION</div>
              )}
              {visibleColumns.some(c => c.key === 'address') && (
                <div className="text-xs font-normal pl-2">ADDRESS</div>
              )}
            </div>
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <div className="grid grid-cols-2">
              {visibleColumns.some(c => c.key === 'areaLocation') && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right border-r border-gray-200 dark:border-gray-600 pr-2">{row.original.areaLocation}</div>
              )}
              {visibleColumns.some(c => c.key === 'address') && (
                <div className="text-sm text-gray-500 dark:text-gray-400 pl-2">{row.original.address}</div>
              )}
            </div>
          </div>
        ),
      });
    }

    // Status
    if (visibleColumns.some(c => c.key === 'status')) {
      cols.push({
        accessorKey: 'status',
        header: 'STATUS',
        cell: ({ row }) => (
          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.original.status)}`}>
            {row.original.status}
          </span>
        ),
      });
    }

    // Due Date
    if (visibleColumns.some(c => c.key === 'dueDate')) {
      cols.push({
        accessorKey: 'dueDate',
        header: 'DUE DATE',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">{formatDateDisplay(row.original.dueDate)}</span>
        ),
      });
    }

    // Contact
    if (visibleColumns.some(c => c.key === 'contact')) {
      cols.push({
        accessorKey: 'contact',
        header: 'CONTACT',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">{row.original.contact}</span>
        ),
      });
    }

    // Comments
    if (visibleColumns.some(c => c.key === 'comments')) {
      cols.push({
        accessorKey: 'comments',
        header: 'COMMENTS',
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">{row.original.comments}</span>
        ),
      });
    }

    // Actions
    cols.push({
      id: 'actions',
      header: 'ACTIONS',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleEdit(row.original)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
          >
            <FiEdit className="inline" />
          </button>
          <button
            onClick={() => handleDelete(row.original.id)}
            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
          >
            <FiTrash2 className="inline" />
          </button>
        </div>
      ),
    });

    return cols;
  }, [visibleColumns, handleEdit, handleDelete]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('projects.title')}</h1>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <button
          onClick={() => {}}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <FiFilter />
          <span>Filter By</span>
        </button>

        <button
          onClick={() => setIsDatePickerOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <span>{selectedDate ? formatDateDisplay(selectedDate) : 'Date'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          onClick={() => setIsColumnsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <span>Hide Columns</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          onClick={() => setIsStatusModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <span>Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          onClick={handleResetFilters}
          className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <FiRotateCw />
          <span>Reset Filter</span>
        </button>

        <div className="flex-1"></div>

        <Button
          onClick={() => navigate(ROUTES.PROJECTS_ADD)}
          variant="primary"
        >
          <FiPlus className="inline mr-2" />
          Add Project
        </Button>
      </div>

      {/* Table */}
      <Table
        data={currentProjects}
        columns={columns}
        loading={loading}
        emptyMessage={t('common.noData')}
        pagination={{
          currentPage,
          totalPages,
          startIndex,
          endIndex,
          total: projects.length,
        }}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Date Picker Modal */}
      <DatePicker
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onApply={handleDateApply}
        selectedDate={selectedDate}
      />

      {/* Select Columns Modal */}
      <SelectColumnsModal
        isOpen={isColumnsModalOpen}
        onClose={() => setIsColumnsModalOpen(false)}
        onApply={handleColumnsApply}
        columns={allColumns}
        selectedColumns={hiddenColumns}
      />

      {/* Select Status Modal */}
      <SelectStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onApply={handleStatusApply}
        selectedStatuses={selectedStatuses}
      />
    </div>
  );
};

export default Projects;
