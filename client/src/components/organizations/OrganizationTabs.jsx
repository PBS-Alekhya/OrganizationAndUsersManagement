import React from 'react';

export const OrganizationTabs = ({ activeTab, setActiveTab }) => {
  
  const getTabClasses = (tabName) => {
    return activeTab === tabName
      ? "px-4 py-2 text-sm font-semibold bg-[#F0EBFF] text-[#6834FF] rounded-md" // Active style
      : "px-4 py-2 text-sm font-normal bg-[#F5F6F7] text-[#777777] rounded-md hover:bg-gray-200"; // Inactive style
  };

  
  
  return (
    <nav className="flex gap-3">
      <button 
        className={getTabClasses('details')}
        onClick={() => setActiveTab('details')} // Set state on click
      >
        Basic details
      </button>
      <button 
        className={getTabClasses('users')}
        onClick={() => setActiveTab('users')} // Set state on click
      >
        Users
      </button>
    </nav>
  );
};