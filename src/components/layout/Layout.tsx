import React, { useState, useEffect } from 'react';
import styles from './Layout.module.scss';
import Sidebar from '@/components/core/sidebar/Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [, setIsMobileView] = useState(false);

  // Watch for screen resize
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileView(isMobile);

      // Auto-collapse on small screens
      if (isMobile) {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize(); // run on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    // On mobile, just toggle; on desktop, allow expand/collapse
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
