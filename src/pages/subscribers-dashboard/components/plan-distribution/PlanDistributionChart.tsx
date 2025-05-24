import React from 'react';
import styles from './PlanDistribution.module.scss';
import type { Subscriber, SubscriptionPlan } from '@/types/subscriber';


interface PlanDistributionChartProps {
  subscribers: Subscriber[];
}

const PlanDistributionChart: React.FC<PlanDistributionChartProps> = ({ subscribers }) => {
  const planCounts = subscribers.reduce((acc, subscriber) => {
    acc[subscriber.plan] = (acc[subscriber.plan] || 0) + 1;
    return acc;
  }, {} as Record<SubscriptionPlan, number>);

  const total = subscribers.length;
  const plans: SubscriptionPlan[] = ['Plan 1', 'Plan 2', 'Plan 6', 'Plan Unlimited'];

  return (
    <div className={styles.planDistribution}>
      {plans.map((plan) => {
        const count = planCounts[plan] || 0;
        const percentage = total > 0 ? (count / total) * 100 : 0;

        return (
          <div key={plan} className={styles.planRow}>
            <div className={styles.planLabel}>
              <span className={styles.planName}>{plan}</span>
              <span className={styles.planCount}>({count})</span>
            </div>
            <div className={styles.progressBarContainer}>
              <div
                className={styles.progressBar}
                style={{ width: `${percentage}%`, backgroundColor: getPlanColor(plan) }}
              />
            </div>
            <div className={styles.percentage}>{Math.round(percentage)}%</div>
          </div>
        );
      })}
    </div>
  );
};

// Helper function to get color for each plan
const getPlanColor = (plan: SubscriptionPlan): string => {
  switch (plan) {
    case 'Plan 1': return '#3498db';
    case 'Plan 2': return '#9b59b6';
    case 'Plan 6': return '#2ecc71';
    case 'Plan Unlimited': return '#f1c40f';
    default: return '#95a5a6';
  }
};

export default PlanDistributionChart;