import React from 'react';
import styles from './StatsCard.module.scss';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down';
  trendValue: string;
  icon: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendValue, icon }) => {
  return (
    <div className={styles.statsCard}>
      <span>
        <img src={icon} width={55} height={55} />
        <div>
          <h3 className={styles.statsCardTitle}>{title}</h3>
          <div className={styles.statsCardValue}>{value}</div>
        </div>
      </span>
      <div className={`${styles.statsCardTrend} ${styles[trend]}`}>
        {trend === 'up' ? '↑' : '↓'} {trendValue}
      </div>
    </div>
  );
};

export default StatsCard;