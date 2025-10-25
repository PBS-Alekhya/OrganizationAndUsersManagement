import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

// A reusable input field component 
const InputField = ({ label, name, value, onChange, placeholder = "Type here" }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-xs font-normal text-[#777777]">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="px-3 py-2 h-10 text-sm bg-white border border-[#B9C0CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6834FF]"
    />
  </div>
);

export const AddOrganizationModal = ({ isOpen, onClose, onSaveSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    contact: '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({ name: '', slug: '', email: '', contact: '' });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send data to the backend
      await axios.post('/api/organizations', formData);
      
      // Tell the parent table to refetch its data
      await onSaveSuccess(); 
      
      // Close the modal
      onClose(); 
    } catch (error) {
      console.error('Failed to add organization:', error);
      
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    // This is the main modal container
    <div className="fixed inset-0 z-50 flex justify-end font-['Nunito_Sans']">
      {/* 1. Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/40" 
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* 2. Modal Panel (The slide-over) */}
      <div className="relative z-10 flex flex-col w-full max-w-[623px] h-screen bg-white shadow-xl">
        
        {/* Modal Header */}
        <header className="flex items-center justify-between px-5 py-4 shadow-[0px_4px_8px_rgba(54,89,226,0.08)]">
          <h2 className="text-lg font-semibold text-[#232323]">
            Add Organization
          </h2>
          <button 
            onClick={onClose}
            className="text-[#97A1B2] hover:text-black"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Modal Body & Form */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="grid grid-cols-2 gap-x-3 gap-y-4">
              <InputField
                label="Name of the organization"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <InputField
                label="Slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
              />
              <InputField
                label="Organization mail"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <InputField
                label="Contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Modal Footer  */}
          <footer className="flex justify-end gap-3 px-6 py-4 mt-auto border-t border-[#E7DFFF]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-normal text-[#6834FF] bg-[#F0EBFF] rounded-md hover:bg-[#E7DFFF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-normal text-white bg-[#6834FF] rounded-md hover:bg-[#5a2ad0]"
            >
              Add
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};
