import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, AlertTriangle, Loader2 } from 'lucide-react'; 

export const DeleteUserConfirmationModal = ({ isOpen, onClose, user, onConfirmDelete }) => {
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
 

  // Reset error when opening
  useEffect(() => {
    if (isOpen) {
      setError('');
      setLoading(false); // Ensure loading is reset
    }
  }, [isOpen]);


  if (!isOpen || !user) {
    return null;
  }

  const handleDelete = async () => {
    setLoading(true); // Start loading
    setError('');
    try {
      await axios.delete(`/api/users/${user.id}`);
      if(onConfirmDelete){ // Check if function exists
          await onConfirmDelete(); 
      }
      onClose(); // Close only on success
    } catch (err) { 
      console.error('Failed to delete user:', err);
      setError(err.response?.data?.message || 'Failed to delete user. Please try again.');
      setLoading(false); // Stop loading only on error
    } 
    
  };

  return (
    // Centered modal container
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-['Nunito_Sans']"> {/* Added base padding p-4 */}
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 ease-in-out" 
        onClick={!loading ? onClose : undefined} // Prevent close while loading
        aria-hidden="true"
      ></div>

      {/* Modal Panel */}
      {/* - w-full: Takes full width available within padding
        - max-w-md: Limits max width on medium screens and up
        - mx-auto: Helps ensure centering if needed (though flex on parent does most work)
        - p-4 md:p-6: Responsive internal padding
      */}
      <div className="relative z-10 w-full max-w-md p-4 md:p-6 mx-auto bg-white rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-full flex-shrink-0"> 
              <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-red-600" /> 
            </div>
            {/* Responsive text size */}
            <h2 className="text-base md:text-lg font-semibold text-[#232323]">Delete User</h2> 
          </div>
          <button 
             onClick={!loading ? onClose : undefined} 
             className="text-[#97A1B2] hover:text-black disabled:opacity-50" 
             disabled={loading}
           >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Error Message Display */}
        {error && (
            <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
                {error}
            </div>
        )}


        {/* Body */}
        
        <p className="text-sm text-gray-600 mb-6 break-words"> 
          Are you sure you want to delete the user "{user.user_name}"? This action cannot be undone.
        </p>

        {/* Footer Buttons */}
         {/* Added flex-wrap for very narrow screens */}
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
            onClick={handleDelete}
            className={`flex items-center justify-center px-4 py-2 text-sm font-normal text-white bg-red-600 rounded-md hover:bg-red-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
             {loading ? (
                 <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                  Deleting...
                 </>
               ) : (
                 'Delete'
               )}
          </button>
        </div>
      </div>
    </div>
  );
};