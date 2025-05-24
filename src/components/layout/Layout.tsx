import React, { useState, useEffect } from 'react';
import styles from './Layout.module.scss';
import Sidebar from '@/components/core/sidebar/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileView(isMobile);

      if (isMobile) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => !prev);
  };

  return (
    <div className={styles.layout}>
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        onToggle={toggleSidebar}
        activeItem={0}
      />

      <main
        className={styles.mainContent}
        style={{
          marginLeft: isSidebarCollapsed ? '70px' : '300px',
          transition: 'margin-left 0.3s ease',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
