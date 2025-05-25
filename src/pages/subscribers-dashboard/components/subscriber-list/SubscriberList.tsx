import React, { useCallback, useEffect, useMemo } from 'react';
import styles from './SubscriberList.module.scss';
import {
  getCurrentPageFromUrl,
  updatePageInUrl,
  getPaginationRange,
  validatePageNumber,
} from '@/utils/pagination';
import { formatDate } from '@/utils/date-utils';
import { SubscriberListCols } from '@/pages/subscribers-dashboard/subscribers.schema';
import type { SortDirection, SortField, Subscriber } from '@/pages/subscribers-dashboard/subscriber.types';

interface SubscriberListProps {
  subscribers: Subscriber[];
  currentPageNumber: number;
  handlePageNumber: (num: number) => void;
  sortField?: SortField;
  sortDirection?: SortDirection;
  onSort?: (field: SortField) => void;
  searchedKeyword: string;
}

const ITEMS_PER_PAGE = 10;

const SortIndicator: React.FC<{ field: SortField; currentField?: SortField; direction?: SortDirection }> = ({ field, currentField, direction }) => {
  if (field === currentField) return <span>{direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↑↓'}</span>
  return '↑↓'
};

const SubscriberList: React.FC<SubscriberListProps> = ({
  subscribers,
  currentPageNumber,
  handlePageNumber,
  sortField,
  sortDirection,
  onSort,
  searchedKeyword
}) => {

  const totalPages = useMemo(() => Math.ceil(subscribers.length / ITEMS_PER_PAGE), [subscribers.length]);

  const currentItems = useMemo(() => {
    const start = (currentPageNumber - 1) * ITEMS_PER_PAGE;
    return subscribers.slice(start, start + ITEMS_PER_PAGE);
  }, [subscribers, currentPageNumber]);

  const pageNumbers = useMemo(() => getPaginationRange(currentPageNumber, totalPages), [currentPageNumber, totalPages]);

  useEffect(() => {
    handlePageNumber(getCurrentPageFromUrl());
  }, [handlePageNumber])

  const paginate = useCallback(
    (page: number) => {
      const validated = validatePageNumber(page, ITEMS_PER_PAGE, subscribers.length);
      handlePageNumber(validated);
      updatePageInUrl('page', validated);
    },
    [handlePageNumber, subscribers.length]
  );

  const handleHeaderClick = (field: SortField) => {
    onSort?.(field);
    updatePageInUrl('sort', field)
  };

  const highlightMatch = (text: string, keyword: string): React.ReactNode => {
    if (!keyword) return text;

    const regex = new RegExp(`(${keyword})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? <strong key={i}>{part}</strong> : part
    );
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.subscriberTable}>
        <thead>
          <tr>
            {SubscriberListCols.map(({ label, field }) => (
              <th key={field} onClick={() => handleHeaderClick(field as SortField)}>
                {label} <SortIndicator field={field as SortField} currentField={sortField} direction={sortDirection} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((subscriber) => (
              <tr key={subscriber.id}>
                <td>{highlightMatch(subscriber.name, searchedKeyword)}</td>
                <td>{highlightMatch(subscriber.email, searchedKeyword)}</td>
                <td>{subscriber.plan}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[subscriber.status.toLowerCase()]}`}>
                    {subscriber.status}
                  </span>
                </td>
                <td>{formatDate(subscriber.joinDate)}</td>
                <td>{formatDate(subscriber.expiresOn)}</td>
                <td>{subscriber.country}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className={styles.noResults}>
                No subscribers found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            onClick={() => paginate(currentPageNumber - 1)}
            disabled={currentPageNumber === 1}
            className={styles.paginationButton}
          >
            Previous
          </button>

          {pageNumbers.map((number, idx) => (
            <React.Fragment key={idx}>
              {number === '...' ? (
                <span className={styles.paginationEllipsis}>...</span>
              ) : (
                <button
                  onClick={() => paginate(number as number)}
                  className={`${styles.paginationButton} ${currentPageNumber === number ? styles.active : ''}`}
                >
                  {number}
                </button>
              )}
            </React.Fragment>
          ))}

          <button
            onClick={() => paginate(currentPageNumber + 1)}
            disabled={currentPageNumber === totalPages}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriberList;
