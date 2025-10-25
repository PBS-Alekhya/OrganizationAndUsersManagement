import React from 'react';

export const StatusBadge = ({ status }) => {
  const statusStyles = {
    Active: {
      bg: 'bg-[#E7F8E9]',
      text: 'text-[#12BB23]',
      dot: 'bg-[#12BB23]',
    },
    Blocked: {
      bg: 'bg-[#FDEAEA]',
      text: 'text-[#E92B2B]',
      dot: 'bg-[#E92B2B]',
    },
    Inactive: {
      bg: 'bg-[#F5F6F7]',
      text: 'text-[#777777]',
      dot: 'bg-[#97A1B2]',
    },
  };

  const styles = statusStyles[status] || statusStyles.Inactive;

  return (
    <div
      className={`flex items-center justify-center gap-1.5 w-fit px-2 py-1 rounded-full text-xs ${styles.bg} ${styles.text}`}
    >
      <span className={`w-2 h-2 rounded-full ${styles.dot}`}></span>
      <span>{status}</span>
    </div>
  );
};
