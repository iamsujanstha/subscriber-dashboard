import React, { useCallback, useEffect, useState } from 'react';
import styles from './SubscriberList.module.scss';
import type { Subscriber } from '@/types/subscriber';
import {
  getCurrentPageFromUrl,
  updatePageInUrl,
  getPaginationRange,
  validatePageNumber,
} from '@/utils/pagination';
import { formatDate } from '@/utils/date-utils';


interface SubscriberListProps {
  subscribers: Subscriber[];
  currentPageNumber: number;
  handlePageNumber: React.Dispatch<React.SetStateAction<number>>
}

const SubscriberList: React.FC<SubscriberListProps> = ({ subscribers, currentPageNumber, handlePageNumber }) => {
  const [itemsPerPage] = useState(10);

  useEffect(function initializePage() {
    handlePageNumber(getCurrentPageFromUrl());
  }, [handlePageNumber]);

  const paginate = useCallback(function handlePageChange(pageNumber: number) {
    const validatedPage = validatePageNumber(pageNumber, itemsPerPage, subscribers.length);
    handlePageNumber(validatedPage);
    updatePageInUrl(validatedPage);
  }, [handlePageNumber, itemsPerPage, subscribers.length]);

  // calculate pagination
  const indexOfLastItem = currentPageNumber * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subscribers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subscribers.length / itemsPerPage);

  const pageNumbers = getPaginationRange(currentPageNumber, totalPages);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.subscriberTable}>
        <thead>
          <tr>
            {['user', 'email', 'plan', 'status', 'expires on', 'join date', 'country', 'revenue'].map(
              (item) => (
                <th>{item.toUpperCase()}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((subscriber) => (
              <tr key={subscriber.id}>
                <td>{subscriber.name}</td>
                <td>{subscriber.email}</td>
                <td>{subscriber.plan}</td>
                <td>
                  <span className={`${styles.statusBadge} ${styles[subscriber.status.toLowerCase()]}`}>
                    {subscriber.status}
                  </span>
                </td>
                <td>{formatDate(subscriber.expiresOn)}</td>
                <td>{formatDate(subscriber.joinDate)}</td>
                <td>{subscriber.country}</td>
                <td>${subscriber.revenue.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className={styles.noResults}>No subscribers found</td>
            </tr>
          )}
        </tbody>
      </table>

      {subscribers.length > itemsPerPage && (
        <div className={styles.pagination}>
          <button
            onClick={() => paginate(currentPageNumber - 1)}
            disabled={currentPageNumber === 1}
            className={styles.paginationButton}
          >
            Previous
          </button>

          {pageNumbers.map((number, index) => (
            <React.Fragment key={index}>
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