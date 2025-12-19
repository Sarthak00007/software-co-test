import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setProjects } from '../../store/slices/projectSlice';
import { setEstimations } from '../../store/slices/estimationSlice';
import { projectsApi, estimationsApi } from '../../helpers/mockApi';
import { formatCurrency } from '../../utils/format';
import { calculateEstimationTotal } from '../../utils/calculations';
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { projects } = useSelector((state) => state.projects);
  const { estimations } = useSelector((state) => state.estimations);
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    const loadData = async () => {
      const projectsData = await projectsApi.getAll();
      const estimationsData = await estimationsApi.getAll();
      dispatch(setProjects(projectsData));
      dispatch(setEstimations(estimationsData));
    };
    loadData();
  }, [dispatch]);

  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const totalEstimations = estimations.length;
  const totalRevenue = estimations.reduce((sum, est) => {
    return sum + calculateEstimationTotal(est.sections || []);
  }, 0);

  // Sales/Revenue spike chart data matching the Figma design
  const salesData = [
    { period: '5k', sales: 20 },
    { period: '7.5k', sales: 30 },
    { period: '10k', sales: 50 },
    { period: '12.5k', sales: 30 },
    { period: '15k', sales: 50 },
    { period: '17.5k', sales: 35 },
    { period: '19k', sales: 50 },
    { period: '20k', sales: 50 },
    { period: '20.5k', sales: 88 }, // Sharp peak
    { period: '22k', sales: 35 },
    { period: '24k', sales: 50 },
    { period: '26k', sales: 40 },
    { period: '28k', sales: 55 },
    { period: '30k', sales: 30 },
    { period: '32k', sales: 40 },
    { period: '33.5k', sales: 60 },
    { period: '35k', sales: 25 },
    { period: '37k', sales: 30 },
    { period: '39k', sales: 50 },
    { period: '41k', sales: 40 },
    { period: '42.5k', sales: 75 },
    { period: '44k', sales: 60 },
    { period: '46k', sales: 40 },
    { period: '48k', sales: 65 },
    { period: '50k', sales: 50 },
    { period: '52k', sales: 45 },
    { period: '54k', sales: 60 },
    { period: '55k', sales: 55 },
    { period: '57k', sales: 50 },
    { period: '60k', sales: 55 },
  ];

  const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{value}</p>
        </div>
        {Icon && (
          <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3">
            <Icon className="text-blue-600 dark:text-blue-400 text-2xl" />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">{t('dashboard.title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title={t('dashboard.totalProjects')}
          value={totalProjects}
          icon={({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          )}
        />
        <StatCard
          title={t('dashboard.activeProjects')}
          value={activeProjects}
          icon={({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        />
        <StatCard
          title={t('dashboard.totalEstimations')}
          value={totalEstimations}
          icon={({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          )}
        />
        <StatCard
          title={t('dashboard.totalRevenue')}
          value={formatCurrency(totalRevenue)}
          icon={({ className }) => (
            <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        />
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sales Details</h2>
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={mode === 'dark' ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="period" 
              stroke={mode === 'dark' ? '#9ca3af' : '#6b7280'}
              tick={{ fill: mode === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              tickFormatter={(value) => {
                // Only show main ticks (5k, 10k, 15k, etc.)
                const mainTicks = ['5k', '10k', '15k', '20k', '25k', '30k', '35k', '40k', '45k', '50k', '55k', '60k'];
                return mainTicks.includes(value) ? value : '';
              }}
            />
            <YAxis 
              stroke={mode === 'dark' ? '#9ca3af' : '#6b7280'}
              domain={[0, 100]}
              tick={{ fill: mode === 'dark' ? '#9ca3af' : '#6b7280' }}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: mode === 'dark' ? '#1f2937' : '#ffffff',
                border: `1px solid ${mode === 'dark' ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: mode === 'dark' ? '#ffffff' : '#000000',
              }}
              formatter={(value) => {
                // Format as currency-like value (e.g., 64,366.77)
                const formatted = (value * 1000).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
                return formatted;
              }}
            />
            <Area 
              type="monotone" 
              dataKey="sales" 
              stroke="#3B82F6" 
              strokeWidth={3}
              fill="url(#colorSales)"
              dot={{ fill: '#3B82F6', r: 5, strokeWidth: 2, stroke: '#ffffff' }}
              activeDot={{ r: 8, strokeWidth: 2, stroke: '#ffffff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;

