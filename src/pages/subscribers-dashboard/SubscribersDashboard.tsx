import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from './SubscribersDashboard.module.scss';
import PlanDistributionChart from './components/plan-distribution/PlanDistributionChart';
import StatsCard from '@/pages/subscribers-dashboard/components/stats-card/StatsCard';
import SubscriberList from '@/pages/subscribers-dashboard/components/subscriber-list/SubscriberList';
import { planOptions, statusOptions } from '@/pages/subscribers-dashboard/subscribers.schema';
import type { Subscriber, SubscriptionPlan } from '@/types/subscriber';
import { useDebounce } from '@/hooks/useDebounce';
import { getCombinedSubscribers } from '@/services/subscribers.service';
import Select from '@/components/ui/select/Select';
import { removeUrlParam, resetUrlParams, updateUrlParam } from '@/utils/url';


const SubscribersDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Expired'>('All');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(function fetchData() {
    const loadData = async () => {
      try {
        const data = await getCombinedSubscribers();
        setSubscribers(data);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(function updateUrlOnPageNoChange() {
    if (pageNumber > 1) {
      updateUrlParam('page', String(pageNumber));
    } else {
      removeUrlParam('page');
    }
  }, [pageNumber]);

  useEffect(function syncPageNoWithUrl() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    if (page) setPageNumber(Number(page));
  }, []);

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(subscriber => {
      const matchesSearch = subscriber.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        subscriber.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesPlan = selectedPlan === 'All' || subscriber.plan === selectedPlan;
      const matchesStatus = selectedStatus === 'All' || subscriber.status === selectedStatus;

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [subscribers, debouncedSearchTerm, selectedPlan, selectedStatus]);

  const { totalSubscribers, activeSubscribers, totalRevenue } = useMemo(() => {
    return {
      totalSubscribers: subscribers.length,
      activeSubscribers: subscribers.filter(s => s.status === 'Active').length,
      totalRevenue: subscribers.reduce((sum, sub) => sum + sub.revenue, 0)
    };
  }, [subscribers]);

  const handlePlanChange = useCallback((value: string) => {
    setSelectedPlan(value as SubscriptionPlan | 'All');
    setPageNumber(1);
    resetUrlParams();
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setSelectedStatus(value as 'All' | 'Active' | 'Expired');
    setPageNumber(1);
    resetUrlParams();
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPageNumber(1);
    resetUrlParams();
  }, []);

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
          <h2>Subscription Plans</h2>
          <PlanDistributionChart subscribers={subscribers} />
        </div>
        <div className={styles.chartContainer}>
          <h2>Subscribers Chart</h2>
          <div className={styles.placeholderChart}>**Chart as per requirement**</div>
        </div>
      </div>

      <div className={styles.subscribersSection}>
        <h2>Subscribers List</h2>

        <div className={styles.filters}>
          <input
            type="text"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <Select
            options={planOptions}
            value={selectedPlan}
            onChange={handlePlanChange}
            className={styles.filterSelect}
          />
          <Select
            options={statusOptions}
            value={selectedStatus}
            onChange={handleStatusChange}
            className={styles.filterSelect}
          />
        </div>
        <SubscriberList subscribers={filteredSubscribers} currentPageNumber={pageNumber} handlePageNumber={setPageNumber} />
      </div>
    </div>
  );
};

export default React.memo(SubscribersDashboard);