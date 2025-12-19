import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { ROUTES } from '../../constants/routes';
import { FiLogOut, FiLayout, FiDollarSign, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  if (!isAuthenticated) return null;

  const isActive = (path) => location.pathname === path;

  const sidebarBg = mode === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textColor = mode === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const activeBg = mode === 'dark' ? 'bg-blue-900' : 'bg-blue-50';
  const activeText = 'text-blue-600';
  const hoverBg = mode === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const borderColor = mode === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const navItems = [
    {
      path: ROUTES.DASHBOARD,
      label: t('navigation.dashboard'),
      icon: FiClock,
    },
    {
      path: ROUTES.PROJECTS,
      label: t('navigation.projects'),
      icon: FiLayout,
    },
    {
      path: ROUTES.ESTIMATIONS,
      label: t('navigation.estimations'),
      icon: FiDollarSign,
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full ${sidebarBg} ${borderColor} border-r z-50 transform transition-all duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isCollapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Collapse Button */}
          <div className={`p-6 border-b ${borderColor} flex items-center justify-between`}>
            {!isCollapsed && (
              <h1 className={`text-xl font-bold ${mode === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                LOGO
              </h1>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`${textColor} hover:opacity-70 transition-opacity p-1 rounded-lg ${hoverBg} hidden lg:flex`}
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <FiChevronRight className="text-xl" /> : <FiChevronLeft className="text-xl" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? `${activeBg} ${activeText} font-medium`
                      : `${textColor} ${hoverBg}`
                  }`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="text-xl" />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Logout */}
          <div className={`p-4 border-t ${borderColor}`}>
            <button
              onClick={handleLogout}
              className={`flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} px-4 py-3 rounded-lg w-full transition-colors ${textColor} ${hoverBg}`}
              title={isCollapsed ? t('common.logout') : ''}
            >
              <FiLogOut className="text-xl" />
              {!isCollapsed && <span>{t('common.logout')}</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

