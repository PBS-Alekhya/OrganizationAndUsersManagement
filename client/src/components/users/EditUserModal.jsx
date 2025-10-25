import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, ChevronDown, Loader2 } from 'lucide-react';

export const EditUserModal = ({ isOpen, onClose, user, onSaveSuccess }) => {
  const [userName, setUserName] = useState('');
  
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setUserName(user.user_name || ''); 
      setRole(user.role || '');
      setError('');
      setLoading(false);
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!userName || !role) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (!user || !user.id) {
        setError('Cannot update user: User ID is missing.');
        setLoading(false);
        return;
    }

    try {
     
      await axios.put(`/api/users/${user.id}`, {
        userName: userName, 
        role,
      });
      if(onSaveSuccess) {
          await onSaveSuccess();
      }
      onClose();
    } catch (error) {
      console.error('Failed to update user:', error);
       if (error.response?.data?.message) {
         setError(error.response.data.message);
      } else {
         setError('An unexpected error occurred. Please try again.');
      }
    } finally {
        setLoading(false);
    }
  };

  if (!isOpen || !user) {
    return null;
  }

  return (
    // Responsive modal container 
    <div className="fixed inset-0 z-50 flex items-start justify-center md:justify-end font-['Nunito_Sans']">
      {/* Backdrop  */}
      <div
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out"
        onClick={!loading ? onClose : undefined}
        aria-hidden="true"
      ></div>
      {/* Modal Panel  */}
      <div
        className={`relative z-10 flex flex-col w-full md:max-w-[623px] h-screen bg-white shadow-xl transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-5 py-4 shadow-[0px_4px_8px_rgba(54,89,226,0.08)] flex-shrink-0">
          <h2 className="text-lg font-semibold text-[#232323]">Edit User</h2>
          <button
            onClick={!loading ? onClose : undefined}
            className="text-[#97A1B2] hover:text-black disabled:opacity-50"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </header>
        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 space-y-4 flex-grow">
             {/* Error Message  */}
             {error && (
              <div className="p-3 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
                {error}
              </div>
            )}
            {/* Name Input */}
            <div className="flex flex-col gap-1">
              <label htmlFor="editUserName" className="text-xs font-normal text-[#777777]">
                Name of the user
              </label>
              <input
                type="text"
                id="editUserName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="h-11 px-3 py-2 text-sm bg-white border border-[#B9C0CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6834FF]"
              />
            </div>

            {/* Role Select */}
            <div className="flex flex-col gap-1">
              <label htmlFor="editRole" className="text-xs font-normal text-[#777777]">
                Choose user role
              </label>
              <div className="relative">
                <select
                  id="editRole"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="appearance-none w-full h-11 px-3 py-2 text-sm bg-white border border-[#B9C0CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6834FF] pr-8"
                >
                  <option value="" disabled>Select an option</option>
                  <option value="Admin">Admin</option>
                  <option value="Co-ordinator">Co-ordinator</option>
                  <option value="Member">Member</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
          {/* Footer  */}
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
                  Saving...
                 </>
               ) : (
                 'Save Changes'
               )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};