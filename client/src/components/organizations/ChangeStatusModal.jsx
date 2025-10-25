import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, CheckCircle, AlertTriangle, XCircle, Loader2 } from 'lucide-react'; // Added Loader2

export const ChangeStatusModal = ({ isOpen, onClose, organizationId, currentStatus, onSaveSuccess }) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  
  useEffect(() => {
    if (isOpen) {
        setSelectedStatus(currentStatus);
        setError('');
        setLoading(false); // Ensure loading is reset
    }
  }, [currentStatus, isOpen]);


  const handleSave = async () => {
     setError('');
     setLoading(true);
    try {
      await axios.patch(`/api/organizations/${organizationId}/status`, {
        status: selectedStatus,
      });
      if (onSaveSuccess) { s
          await onSaveSuccess(); 
      }
      onClose(); // Close modal on success
    } catch (err) {
      console.error("Failed to update status:", err);
       setError(err.response?.data?.message || 'Failed to update status. Please try again.');
       setLoading(false); // Stop loading only on error
    } 
    
  };

  if (!isOpen) {
    return null;
  }

  const statusOptions = [
    { value: 'Active', label: 'Active', icon: <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> }, // Added flex-shrink-0
    { value: 'Blocked', label: 'Blocked', icon: <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" /> }, // Added flex-shrink-0
    { value: 'Inactive', label: 'Inactive', icon: <AlertTriangle className="w-4 h-4 text-gray-500 flex-shrink-0" /> }, // Added flex-shrink-0
  ];

  return (
    // Centered modal container with base padding
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Nunito_Sans']">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out" 
        onClick={!loading ? onClose : undefined} // Prevent close while loading
        aria-hidden="true"
      ></div>

      {/* Modal Panel */}
      {/* - w-full max-w-sm: Controls width, already suitable for mobile up
        - p-4 md:p-6: Responsive internal padding
      */}
      <div className="relative z-10 w-full max-w-sm p-4 md:p-6 mx-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4"> {/* Use items-start for alignment */}
          {/* Responsive title size */}
          <h2 className="text-base md:text-lg font-semibold text-[#232323] mr-2">Change Organization Status</h2> {/* Added mr-2 */}
          <button 
            onClick={!loading ? onClose : undefined} 
            className="text-[#97A1B2] hover:text-black flex-shrink-0 disabled:opacity-50" // Added flex-shrink-0
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

         {/* Error Message */}
        {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
                {error}
            </div>
        )}

        {/* Body - Status Options */}
        
        <div className="space-y-2 md:space-y-3 mb-6"> 
          <p className="text-sm text-gray-600">Select the new status for this organization:</p>
          {statusOptions.map((option) => (
            
            <label key={option.value} className="flex items-center p-2 md:p-3 border rounded-md cursor-pointer hover:bg-gray-50"> 
              <input
                type="radio"
                name="status"
                value={option.value}
                checked={selectedStatus === option.value}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="mr-2 md:mr-3 h-4 w-4 text-[#6834FF] focus:ring-[#6834FF] flex-shrink-0" // Responsive margin
              />
              <span className="flex items-center gap-2 text-sm">
                {option.icon}
                <span className="break-words">{option.label}</span> 
              </span>
            </label>
          ))}
        </div>

        {/* Footer Buttons */}
        {/* Added flex-wrap for very small screens, responsive gap */}
        <div className="flex flex-wrap justify-end gap-2 md:gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-normal text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className={`flex items-center justify-center px-4 py-2 text-sm font-normal text-white bg-[#6834FF] rounded-md hover:bg-[#5a2ad0] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Status'
              )}
          </button>
        </div>
      </div>
    </div>
  );
};