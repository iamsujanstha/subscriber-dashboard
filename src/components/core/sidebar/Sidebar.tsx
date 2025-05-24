import React from 'react';
import styles from './Sidebar.module.scss';
import { FaUsers, FaCog, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  activeItem?: number;
}
const menuItems = [
  { icon: <FaUsers />, label: 'Subscribers Dashboard' },
  { icon: <FaCog />, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle, activeItem = 0 }) => {
  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
      <div className={styles.sidebarHeader}>
        {!isCollapsed && <h2>Genius System Pvt. Ltd.</h2>}
        <button onClick={onToggle} className={styles.toggleButton}>
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      <nav className={styles.nav}>
        <ul>
          {menuItems.map((item, index) => (
            <li
              key={index}
              className={index === activeItem ? styles.active : ''}
              title={isCollapsed ? item.label : ''}
            >
              <span className={styles.icon}>{item.icon}</span>
              {!isCollapsed && <span className={styles.label}>{item.label}</span>}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;