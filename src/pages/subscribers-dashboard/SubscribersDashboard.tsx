import React, { useState, useEffect } from 'react';
import styles from './SubscribersDashboard.module.scss';
import PlanDistributionChart from './components/plan-distribution/PlanDistributionChart';
import Select from '../../components/ui/select/Select';
import type { Subscriber, SubscriptionPlan } from '../../types/subscriber';
import { getCombinedSubscribers } from '../../services/dataService';
import { useDebounce } from '../../hooks/useDebounce';
import StatsCard from '@/pages/subscribers-dashboard/components/stats-card/StatsCard';
import SubscriberList from '@/pages/subscribers-dashboard/components/subscriber-list/SubscriberList';

const SubscribersDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Expired'>('All');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the debounce hook for search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = getCombinedSubscribers();
        setSubscribers(data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const planOptions = [
    { value: 'All', label: 'All Plans' },
    { value: 'Plan 1', label: 'Plan 1' },
    { value: 'Plan 2', label: 'Plan 2' },
    { value: 'Plan3', label: 'Plan3' },
    { value: 'Plan 6', label: 'Plan 6' },
    { value: 'Plan 12', label: 'Plan 12' },
    { value: 'Plan Unlimited', label: 'Plan Unlimited' },
  ];

  const statusOptions = [
    { value: 'All', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Expired', label: 'Expired' },
  ];

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
    const matchesPlan = selectedPlan === 'All' || subscriber.plan === selectedPlan;
    const matchesStatus = selectedStatus === 'All' || subscriber.status === selectedStatus;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const totalSubscribers = subscribers.length;
  const activeSubscribers = subscribers.filter(s => s.status === 'Active').length;
  const totalRevenue = subscribers.reduce((sum, sub) => sum + sub.revenue, 0);

  if (isLoading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Subscribers Dashboard</h1>

      <div className={styles.statsRow}>
        <StatsCard
          title="Total Subscribers"
          value={totalSubscribers}
          trend="up"
          trendValue="12%"
        />

        <StatsCard
          title="Active Subscribers"
          value={activeSubscribers}
          trend="up"
          trendValue="5%"
        />

        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          trend="up"
          trendValue="8%"
        />
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartContainer}>
          <h2>Plan Distribution</h2>
          <PlanDistributionChart subscribers={subscribers} />
        </div>

        <div className={styles.chartContainer}>
          <h2>Subscribers Over Time</h2>
          <div className={styles.placeholderChart}>Chart placeholder</div>
        </div>
      </div>

      <div className={styles.subscribersSection}>
        <h2>Subscribers List</h2>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />

          <Select
            options={planOptions}
            value={selectedPlan}
            onChange={(value: string) => setSelectedPlan(value as SubscriptionPlan | 'All')}
            className={styles.filterSelect}
          />

          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={(value: string) => setSelectedStatus(value as 'All' | 'Active' | 'Expired')}
            className={styles.filterSelect}
          />
        </div>

        <SubscriberList subscribers={filteredSubscribers} />
      </div>
    </div>
  );
};

export default SubscribersDashboard;