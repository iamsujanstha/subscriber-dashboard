import React from 'react';
import styles from './StatsCard.module.scss';

interface StatsCardProps {
  title: string;
  value: string | number;
  trend: 'up' | 'down';
  trendValue: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, trend, trendValue }) => {
  return (
    <div className={styles.statsCard}>
      <h3 className={styles.statsCardTitle}>{title}</h3>
      <div className={styles.statsCardValue}>{value}</div>
      <div className={`${styles.statsCardTrend} ${styles[trend]}`}>
        {trend === 'up' ? '↑' : '↓'} {trendValue}
      </div>
    </div>
  );
};

export default StatsCard;