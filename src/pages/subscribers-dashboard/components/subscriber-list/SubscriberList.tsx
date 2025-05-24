import React, { useCallback, useState } from 'react';
import styles from './SubscriberList.module.scss';
import type { Subscriber } from '@/types/subscriber';

interface SubscriberListProps {
  subscribers: Subscriber[];
}

const SubscriberList: React.FC<SubscriberListProps> = ({ subscribers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = subscribers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(subscribers.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getPageNumbers = useCallback(() => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const leftBound = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const rightBound = Math.min(totalPages, leftBound + maxVisiblePages - 1);

      if (leftBound > 1) {
        pageNumbers.push(1);
        if (leftBound > 2) {
          pageNumbers.push('...');
        }
      }

      for (let i = leftBound; i <= rightBound; i++) {
        pageNumbers.push(i);
      }

      if (rightBound < totalPages) {
        if (rightBound < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  }, []);

  return (
    <div className={styles.tableContainer}>
      <table className={styles.subscriberTable}>
        <thead>
          <tr>
            <th>USER</th>
            <th>EMAIL</th>
            <th>PLAN</th>
            <th>STATUS</th>
            <th>EXPIRES ON</th>
            <th>JOIN DATE</th>
            <th>COUNTRY</th>
            <th>REVENUE</th>
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

      /* Pagination */
      {subscribers.length > itemsPerPage && (
        <div className={styles.pagination}>
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Previous
          </button>

          {getPageNumbers().map((number, index) => (
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
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
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