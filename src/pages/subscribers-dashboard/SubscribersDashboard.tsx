import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from './SubscribersDashboard.module.scss';
import PlanDistributionChart from './components/plan-distribution/PlanDistributionChart';
import StatsCard from '@/pages/subscribers-dashboard/components/stats-card/StatsCard';
import SubscriberList from '@/pages/subscribers-dashboard/components/subscriber-list/SubscriberList';
import { planOptions, statusOptions } from '@/pages/subscribers-dashboard/subscribers.schema';
import type { SortDirection, SortField, Subscriber, SubscriptionPlan } from '@/types/subscriber';
import { useDebounce } from '@/hooks/useDebounce';
import { getCombinedSubscribers } from '@/services/subscribers.service';
import Select from '@/components/ui/select/Select';
import { resetUrlParams } from '@/utils/url';
import { barChartIcon, listIcon, pieChartIcon, SubscriptionIcon, userPlusIcon, userSlashIcon } from '@/assets';
import { updatePageInUrl } from '@/utils/pagination';


const SubscribersDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Expired'>('All');
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('none');

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

  // For Persist pagination even when page refresh
  useEffect(function syncPageNoWithUrl() {
    const params = new URLSearchParams(window.location.search);
    const page = params.get('page');
    const plan = params.get('plan');
    const status = params.get('status');

    if (page) setPageNumber(Number(page));
    if (plan) setSelectedPlan(plan as SubscriptionPlan | 'All');
    if (status) setSelectedStatus(status as 'All' | 'Active' | 'Expired');
  }, []);


  const filteredAndSortedSubscribers = useMemo(() => {
    const filtered = subscribers.filter(subscriber => {
      const matchesSearch = subscriber.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        subscriber.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesPlan = selectedPlan === 'All' || subscriber.plan === selectedPlan;
      const matchesStatus = selectedStatus === 'All' || subscriber.status === selectedStatus;

      return matchesSearch && matchesPlan && matchesStatus;
    });

    return [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'plan':
          comparison = a.plan.localeCompare(b.plan);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'expiresOn':
          comparison = a.expiresOn.getTime() - b.expiresOn.getTime();
          break;
        case 'joinDate':
          comparison = a.joinDate.getTime() - b.joinDate.getTime();
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : sortDirection === 'desc' ? -comparison : 0;
    });
  }, [subscribers, debouncedSearchTerm, selectedPlan, selectedStatus, sortField, sortDirection]);

  const handleSort = useCallback((field: SortField) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : prev === 'desc' ? 'none' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('none');
    }
    setPageNumber(1);
  }, [sortField]);


  const { totalSubscribers, activeSubscribers } = useMemo(() => {
    return {
      totalSubscribers: subscribers.length,
      activeSubscribers: subscribers.filter(s => s.status === 'Active').length,
    };
  }, [subscribers]);

  const handleFilterChange = useCallback(
    <T extends string>(
      setter: React.Dispatch<React.SetStateAction<T>>,
      key: string,
      value: T
    ) => {
      setter(value);
      setPageNumber(1);
      resetUrlParams('page');
      updatePageInUrl(key, value);
    },
    []
  );
  const handlePlanChange = (value: string) => {
    handleFilterChange<SubscriptionPlan | 'All'>(setSelectedPlan, 'plan', value as SubscriptionPlan | 'All');
  };

  const handleStatusChange = (value: string) => {
    handleFilterChange<'All' | 'Active' | 'Expired'>(setSelectedStatus, 'status', value as 'All' | 'Active' | 'Expired');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    handleFilterChange(setSearchTerm, 'query', value);
  };


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
          icon={SubscriptionIcon}
        />
        <StatsCard
          title="Active Subscribers"
          value={activeSubscribers}
          trend="up"
          trendValue="5%"
          icon={userPlusIcon}
        />
        <StatsCard
          title="Expired Subscriptions"
          value={activeSubscribers}
          trend="up"
          trendValue="5%"
          icon={userSlashIcon}
        />
      </div>

      <div className={styles.chartsRow}>
        <div className={styles.chartContainer}>
          <div className={styles.inlineHeader}>
            <img src={pieChartIcon} width={30} height={30} alt="List Icon" />
            <h2>Subscription Plans</h2>
          </div>
          <PlanDistributionChart subscribers={subscribers} />
        </div>
        <div className={styles.chartContainer}>
          <div className={styles.inlineHeader}>
            <img src={barChartIcon} width={30} height={30} alt="List Icon" />
            <h2>Subscription Chart</h2>
          </div>
          <div className={styles.placeholderChart}>**Chart as per requirement**</div>
        </div>
      </div>

      <div className={styles.subscribersSection}>
        <div className={styles.inlineHeader}>
          <img src={listIcon} width={30} height={30} alt="List Icon" />
          <h2>Subscribers List</h2>
        </div>

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
        <SubscriberList
          subscribers={filteredAndSortedSubscribers}
          currentPageNumber={pageNumber}
          handlePageNumber={setPageNumber}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </div>
    </div>
  );
};

export default React.memo(SubscribersDashboard);