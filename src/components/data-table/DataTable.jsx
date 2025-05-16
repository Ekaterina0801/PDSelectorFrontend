import React from 'react';
import PropTypes from 'prop-types';
import styles from './DataTable.module.scss';
export function DataTable({ columns, rows, renderRowActions }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={col.onClick}
                className={styles.headerCell}
              >
                <div className={styles.headerContent}>
                  {col.title}
                  {col.sortIndicator && (
                    <span className={styles.sortIcon}>
                      {col.sortIndicator === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            ))}
            {renderRowActions && (
              <th className={styles.headerCell}>Действия</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, i) => (
              <tr key={i} className={styles.bodyRow}>
                {columns.map(col => {
                  const content = col.render
                    ? col.render(row[col.key], row)
                    : row[col.key];
                  const isDesc = col.key === 'description';
                  const tooltip =
                    isDesc && (typeof content === 'string' || typeof content === 'number')
                      ? content
                      : undefined;

                  return (
                    <td
                      key={col.key}
                      className={`${styles.bodyCell} ${isDesc ? styles.ellipsisCell : ''}`}
                      data-label={col.title}
                      title={tooltip}
                    >
                      {content}
                    </td>
                  );
                })}
                {renderRowActions && (
                  <td className={`${styles.bodyCell} ${styles.actionsCell}`}>
                    {renderRowActions(row)}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (renderRowActions ? 1 : 0)}
                className={`${styles.bodyCell} ${styles.empty}`}
              >
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

DataTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      render: PropTypes.func,
      onClick: PropTypes.func,
      sortIndicator: PropTypes.oneOf(['asc', 'desc']),
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.object).isRequired,
  renderRowActions: PropTypes.func,
};

export default DataTable;