import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Loader2 } from 'lucide-react'; // Added ChevronDown, Loader2
import axios from 'axios';

export const AddUserModal = ({ isOpen, onClose, organizationId, onSaveSuccess }) => {
  const [userName, setUserName] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState(''); 
  const [loading, setLoading] = useState(false); 

  
  useEffect(() => {
    if (isOpen) {
      setUserName('');
      setRole('');
      setError('');
      setLoading(false); 
    }
  }, [isOpen, organizationId]); // Added organizationId dependency

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true); // Start loading

    // Moved validation before loading state
    if (!userName || !role) {
      setError('Both name and role are required.');
      setLoading(false); // Stop loading on validation error
      return;
    }

    try {
      
      
      await axios.post(`/api/organizations/${organizationId}/users`, {
        userName: userName, 
        role: role,
      });
      

      if (onSaveSuccess) { // Check if function exists
        await onSaveSuccess(); // Tell the parent table to refetch its data
      }
      onClose(); // Close the modal
    } catch (err) {
      console.error('Failed to add user:', err);
      
      setError(err.response?.data?.message || 'Failed to add user. Please try again.');
    } finally {
        setLoading(false); // Stop loading after API call finishes
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    // Responsive modal container
    <div className="fixed inset-0 z-50 flex items-start justify-center md:justify-end font-['Nunito_Sans']">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out"
        onClick={!loading ? onClose : undefined} 
        aria-hidden="true"
      ></div>

      {/* Modal Panel */}
      <div
        // Responsive width, full height, slide transition
        className={`relative z-10 flex flex-col w-full md:max-w-[623px] h-screen bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >

        {/* Modal Header */}
        <header className="flex items-center justify-between px-4 md:px-5 py-4 shadow-[0px_4px_8px_rgba(54,89,226,0.08)] flex-shrink-0">
          <h2 className="text-lg font-semibold text-[#232323]">
            Add User
          </h2>
          <button
            onClick={!loading ? onClose : undefined}
            className="text-[#97A1B2] hover:text-black disabled:opacity-50"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body & Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          {/* Responsive padding */}
          <div className="p-4 md:p-6 space-y-4 flex-grow">
            {/* Error Message */}
            {error && (
                <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
                    {error}
                </div>
            )}

            {/* Name Input */}
            <div className="flex flex-col gap-1">
              <label htmlFor="userName" className="text-xs font-normal text-[#777777]">
                Name of the user
              </label>
              <input
                type="text"
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Type here"
                className="h-11 px-3 py-2 text-sm bg-white border border-[#B9C0CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6834FF]"
                
              />
            </div>

            {/* Role Select */}
            <div className="flex flex-col gap-1">
              <label htmlFor="userRole" className="text-xs font-normal text-[#777777]">
                Choose user role
              </label>
              {/* Added relative container for icon */}
              <div className="relative">
                <select
                  id="userRole"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  // Added pr-8 for icon space
                  className="appearance-none w-full h-11 px-3 py-2 text-sm bg-white border border-[#B9C0CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6834FF] pr-8"
                  
                >
                  <option value="" disabled>Select an option</option>
                  <option value="Admin">Admin</option>
                  <option value="Co-ordinator">Co-ordinator</option>
                  <option value="Member">Member</option> 
                </select>
                {/* Positioned chevron icon */}
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <footer className="flex justify-end gap-3 px-4 md:px-6 py-4 border-t border-[#E7DFFF] flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-normal text-[#6834FF] bg-[#F0EBFF] rounded-md hover:bg-[#E7DFFF]"
              disabled={loading} 
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex items-center justify-center px-4 py-2 text-sm font-normal text-white bg-[#6834FF] rounded-md hover:bg-[#5a2ad0] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading} 
            >
               {loading ? (
                 <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                 </>
               ) : (
                 'Add'
               )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
