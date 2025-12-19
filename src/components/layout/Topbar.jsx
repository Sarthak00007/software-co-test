import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../store/slices/themeSlice';
import { FiMenu, FiSearch, FiBell, FiSun, FiMoon } from 'react-icons/fi';

const Topbar = ({ onMenuClick }) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const bgColor = mode === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = mode === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const borderColor = mode === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = mode === 'dark' ? 'bg-gray-700' : 'bg-gray-50';
  const inputText = mode === 'dark' ? 'text-gray-300' : 'text-gray-900';

  return (
    <header className={`${bgColor} ${borderColor} border-b sticky top-0 z-30`}>
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left side - Menu and Search */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onMenuClick}
            className={`${textColor} hover:opacity-70 transition-opacity lg:hidden`}
          >
            <FiMenu className="text-2xl" />
          </button>
          <div className="relative flex-1 max-w-md">
            <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${textColor}`} />
            <input
              type="text"
              placeholder="Search"
              className={`w-full pl-10 pr-4 py-2 ${inputBg} ${inputText} border ${borderColor} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Right side - Icons and User */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className={`${textColor} hover:opacity-70 transition-opacity relative`}>
            <FiBell className="text-xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              1
            </span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center space-x-2">
            <span className="text-2xl">🇬🇧</span>
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className={`${inputBg} ${inputText} border ${borderColor} rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden sm:block">
              <p className={`text-sm font-medium ${textColor}`}>{user?.name || 'User'}</p>
              <p className={`text-xs ${mode === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Admin
              </p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={handleThemeToggle}
            className={`${textColor} hover:opacity-70 transition-opacity`}
            title={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {mode === 'dark' ? <FiSun className="text-xl" /> : <FiMoon className="text-xl" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;

