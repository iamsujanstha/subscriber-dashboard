import React, { useState } from 'react';
import styles from './Layout.module.scss';
import {
  FaUsers,
  FaCog,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const menuItems = [
    { icon: <FaUsers />, label: 'Subscribers Dashboard' },
    { icon: <FaCog />, label: 'Settings' },
  ];

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${isSidebarCollapsed ? styles.collapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          {!isSidebarCollapsed && <h2>Genius System Pvt. Ltd.</h2>}
          <button onClick={toggleSidebar} className={styles.toggleButton}>
            {isSidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </button>
        </div>

        <nav className={styles.nav}>
          <ul>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={index === 0 ? styles.active : ''}
                title={isSidebarCollapsed ? item.label : ''}
              >
                <span className={styles.icon}>{item.icon}</span>
                {!isSidebarCollapsed && <span className={styles.label}>{item.label}</span>}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <main className={styles.mainContent} style={{ marginLeft: isSidebarCollapsed ? '70px' : '300px' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;