import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import {
  setEstimations,
  setLoading,
  setFilters,
  deleteEstimation,
} from '../../store/slices/estimationSlice';
import { estimationsApi } from '../../helpers/mockApi';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/common/Button';
import Table from '../../components/common/Table';
import { FiPlus, FiEdit, FiSearch } from 'react-icons/fi';

const Estimations = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { estimations, loading, filters } = useSelector((state) => state.estimations);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9);

  useEffect(() => {
    loadEstimations();
  }, [filters]);

  const loadEstimations = async () => {
    dispatch(setLoading(true));
    try {
      const data = await estimationsApi.getAll(filters);
      dispatch(setEstimations(data));
    } catch (error) {
      console.error('Error loading estimations:', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilters({ [key]: value }));
  };

  const handleEdit = useCallback((estimation) => {
    navigate(`/estimations/edit/${estimation.id}`);
  }, [navigate]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm(t('estimations.deleteConfirm'))) {
      try {
        await estimationsApi.delete(id);
        dispatch(deleteEstimation(id));
      } catch (error) {
        console.error('Error deleting estimation:', error);
      }
    }
  }, [dispatch, t]);

  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatDateModified = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Created':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Processing':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'On Hold':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'In Transit':
        return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  // Pagination
  const totalPages = Math.ceil(estimations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEstimations = estimations.slice(startIndex, endIndex);

  // TanStack Table columns
  const columns = useMemo(() => [
    {
      accessorKey: 'version',
      header: 'VERSION',
      cell: ({ row }) => (
        <span className="text-gray-900 dark:text-white font-medium">
          {row.original.version || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'project',
      header: 'PROJECT',
      cell: ({ row }) => (
        <span className="text-gray-900 dark:text-white">
          {row.original.project || row.original.title || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'client',
      header: 'CLIENT',
      cell: ({ row }) => (
        <span className="text-gray-500 dark:text-gray-400">
          {row.original.client || 'N/A'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'CREATED DATE',
      cell: ({ row }) => (
        <span className="text-gray-500 dark:text-gray-400">
          {formatDateDisplay(row.original.createdAt)}
        </span>
      ),
    },
    {
      accessorKey: 'lastModified',
      header: 'LAST MODIFIED',
      cell: ({ row }) => (
        <span className="text-gray-500 dark:text-gray-400">
          {formatDateModified(row.original.lastModified)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'STATUS',
      cell: ({ row }) => (
        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row.original.status)}`}>
          {row.original.status || 'N/A'}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'ACTION',
      cell: ({ row }) => (
        <button
          onClick={() => handleEdit(row.original)}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <FiEdit className="text-xl" />
        </button>
      ),
    },
  ], [handleEdit]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('estimations.title')}</h1>
        <Button
          onClick={() => navigate(ROUTES.ESTIMATIONS_ADD)}
          variant="primary"
        >
          <FiPlus className="inline mr-2" />
          Add Estimate
        </Button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search')}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <Table
        data={currentEstimations}
        columns={columns}
        loading={loading}
        emptyMessage={t('common.noData')}
        pagination={{
          currentPage,
          totalPages,
          startIndex,
          endIndex,
          total: estimations.length,
        }}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default Estimations;
