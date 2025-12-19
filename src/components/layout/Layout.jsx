import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Get collapsed state from localStorage or default to false
  const getInitialCollapsed = () => {
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  };
  const [sidebarCollapsed, setSidebarCollapsed] = useState(getInitialCollapsed);

  useEffect(() => {
    // Apply theme to document
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  useEffect(() => {
    // Save collapsed state to localStorage
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  const bgColor = mode === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = mode === 'dark' ? 'text-gray-100' : 'text-gray-900';
  const sidebarWidth = sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64';

  return (
    <div className={`flex h-screen ${bgColor} ${textColor}`}>
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarWidth} transition-all duration-300`}>
        <Topbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

