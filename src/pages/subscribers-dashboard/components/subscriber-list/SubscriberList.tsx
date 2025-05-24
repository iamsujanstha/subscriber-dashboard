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
}

const SubscriberList: React.FC<SubscriberListProps> = ({ subscribers }) => {
  const [itemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(function initializePage() {
    setCurrentPage(getCurrentPageFromUrl());
  }, []);

  const paginate = useCallback(function handlePageChange(pageNumber: number) {
    const validatedPage = validatePageNumber(pageNumber, itemsPerPage, subscribers.length);
    setCurrentPage(validatedPage);
    updatePageInUrl(validatedPage);
  }, [itemsPerPage, subscribers.length]);

  // calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subscribers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subscribers.length / itemsPerPage);

  const pageNumbers = getPaginationRange(currentPage, totalPages);

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
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
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
                  className={`${styles.paginationButton} ${currentPage === number ? styles.active : ''}`}
                >
                  {number}
                </button>
              )}
            </React.Fragment>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
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