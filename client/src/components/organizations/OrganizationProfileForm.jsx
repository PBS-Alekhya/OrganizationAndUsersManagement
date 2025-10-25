import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, ChevronDown, Loader2 } from 'lucide-react';

// Reusable Field for READ-ONLY mode 
const ProfileReadOnlyField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-normal text-[#777777]">{label}</label>
    <div className="flex items-center h-11 px-3 py-2 text-sm text-[#777777] bg-[#F5F6F7] border border-[#DFE2E7] rounded-md overflow-hidden text-ellipsis whitespace-nowrap"> {/* Added overflow handling */}
      {value || '-'}
    </div>
  </div>
);

// Reusable Field for EDITING mode 
const ProfileEditField = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-1">
    <label htmlFor={name} className="text-xs font-normal text-[#777777]">
      {label}
    </label>
    <input
      type="text"
      id={name}
      name={name}
      value={value || ''}
      onChange={onChange}
      className="h-11 px-3 py-2 text-sm bg-white border border-[#B9C0CB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#6834FF]"
    />
  </div>
);

// PhoneEditField 
const PhoneEditField = ({ label, name, value, onChange }) => {
  const prefix = "+91"; 
  const number = (value || '').startsWith(prefix + '-') 
                 ? (value || '').substring(prefix.length + 1) 
                 : (value || '');

  const handleNumberChange = (e) => {
    onChange({ target: { name, value: `${prefix}-${e.target.value}` } });
  };

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-normal text-[#777777]">{label}</label>
      <div className="flex items-center h-11 border border-[#B9C0CB] rounded-md focus-within:ring-2 focus-within:ring-[#6834FF] overflow-hidden">
        <span className="px-3 text-sm text-gray-500 bg-gray-100 h-full flex items-center border-r border-[#B9C0CB]">
          {prefix}
        </span>
        <input
          type="tel" 
          id={name}
          name={name} 
          value={number}
          onChange={handleNumberChange}
          className="flex-1 px-3 py-2 text-sm bg-white focus:outline-none h-full min-w-0" // Added min-w-0 for flex shrink issues
          placeholder="9876543210"
        />
      </div>
    </div>
  );
};


export const OrganizationProfileForm = ({ organization, onSaveSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(organization);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    setFormData(organization);
    setIsEditing(false);
    setIsSaving(false);
    setSaveError(null);
  }, [organization]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      await axios.put(`/api/organizations/${organization.id}`, formData);
      setIsEditing(false);
      if(onSaveSuccess) {
         await onSaveSuccess();
      }
    } catch (error) {
      console.error('Failed to update organization:', error);
      setSaveError(error.response?.data?.message || 'Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(organization); 
    setSaveError(null);
  };

  // FormField helper 
   const FormField = ({ label, name, type, ...props }) => {
    const value = formData[name];
    if (isEditing) {
       if (type === 'phone') {
         return <PhoneEditField label={label} name={name} value={value} onChange={handleChange} {...props} />;
       }
       return <ProfileEditField label={label} name={name} value={value} onChange={handleChange} {...props} />;
    } else {
       const displayValue = type === 'phone' ? (value || '').replace('-', ' - ') : value;
       return <ProfileReadOnlyField label={label} value={displayValue} {...props} />;
    }
  };
  
  // FormSelect helper 
   const FormSelect = ({ label, name, options }) => {
    const value = formData[name];
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={name} className="text-xs font-normal text-[#777777]">{label}</label>
        {isEditing ? (
          <div className="relative">
            <select 
              id={name} 
              name={name} 
              value={value || ''}
              onChange={handleChange}
              className={`appearance-none w-full h-11 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-[#6834FF] pr-8 ${isEditing ? 'bg-white border-[#B9C0CB]' : 'bg-[#F5F6F7] border-[#DFE2E7] text-[#777777]'}`}
            >
              <option value="" disabled>Select...</option>
              {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none ${isEditing ? 'text-gray-500' : 'text-[#97A1B2]' }`} />
          </div>
        ) : (
           <div className="flex items-center h-11 px-3 py-2 text-sm text-[#777777] bg-[#F5F6F7] border border-[#DFE2E7] rounded-md">
             {value || '-'}
           </div>
        )}
      </div>
    );
  };

  // Dummy Options 
  const coordinatorOptions = [ {value: 'Upto 5 Coordinators', label: 'Upto 5 Coordinators'} ];
  const timezoneCommonOptions = [ { value: 'India Standard Time', label: 'India Standard Time'} ];
  const timezoneRegionOptions = [ {value: 'Asia/Colombo', label: 'Asia/Colombo'} ];
  const languageOptions = [ {value: 'English', label: 'English'} ];


  return (
    <form 
      onSubmit={handleSave}
      // Use responsive padding and gap within the form card
      className="flex flex-col gap-4 md:gap-5 p-4 md:p-5 bg-white rounded-lg shadow-[0px_2px_12px_rgba(54,89,226,0.12)]" 
    >
      {/* Form Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg md:text-xl font-semibold text-[#232323]">Profile</h3> {/* Slightly smaller text on mobile */}
        {!isEditing && !isSaving && (
          <button
            type="button"
            onClick={() => { setIsEditing(true); setSaveError(null); }}
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-[#F0EBFF] rounded-md hover:bg-[#E7DFFF]" // Smaller button on mobile
          >
            <Pencil className="w-4 h-4 text-[#6834FF]" />
          </button>
        )}
      </div>
      
      {/* Save Error Message */}
      {saveError && isEditing && (
        <div className="p-3 my-2 text-sm text-red-700 bg-red-100 border border-red-400 rounded-md">
          {saveError}
        </div>
      )}
      
      <hr className="border-t border-[#DFE2E7]" />

      {/* --- Organization details Section --- */}
      <div className="flex flex-col gap-2 md:gap-3"> {/* Responsive gap */}
        <h4 className="text-md md:text-lg font-semibold">Organization details</h4> {/* Responsive font size */}
         {/* Grid stacks to 1 column by default, becomes 2 columns on medium screens+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4"> {/* Responsive gap */}
          <FormField label="Organization name" name="name" />
          <FormField label="Organization SLUG" name="slug" />
        </div>
      </div>

      {/* --- Contact details Section --- */}
      <div className="flex flex-col gap-2 md:gap-3">
        <h4 className="text-md md:text-lg font-semibold">Contact details</h4>
         {/* Grid stacks to 1 column by default, becomes 2 columns on medium screens+ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4"> 
          <FormField label="Primary Admin name" name="primary_admin_name" />
          <FormField label="Primary Admin Mail-id" name="primary_admin_email" />
          <FormField label="Support Email ID" name="support_email" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4">
            <FormField label="Phone no" name="contact" type="phone" /> 
            <FormField label="Alternative phone no" name="alt_phone_number" type="phone" />
        </div>
        </div>
      </div>

      
      <div className="flex flex-col gap-2 md:gap-3">
         <h4 className="text-md md:text-lg font-semibold"> Maximum Allowed Coordinators</h4>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4">
           <FormSelect label="Max active Coordinators allowed" name="max_coordinators" options={coordinatorOptions}/>
           
         </div>
      </div>
       <div className="flex flex-col gap-2 md:gap-3">
        <h4 className="text-md md:text-lg font-semibold">Timezone</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4">
           <FormSelect label="Common name" name="timezone_common" options={timezoneCommonOptions}/>
           <FormSelect label="Region" name="timezone_region" options={timezoneRegionOptions}/>
        </div>
      </div>
       <div className="flex flex-col gap-2 md:gap-3">
        <h4 className="text-md md:text-lg font-semibold">Language</h4>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4">
           <FormSelect label="Language" name="language" options={languageOptions}/>
         </div>
       </div>
       <div className="flex flex-col gap-2 md:gap-3">
            <h4 className="text-md md:text-lg font-semibold">Official website URL</h4>
            {/* Full width field */}
            <FormField label="website URL" name="website_url" /> 
       </div>

      {/* Edit Mode Buttons */}
      {isEditing && (
        // Added flex-wrap and justify-end for different screen sizes
        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-[#E7DFFF]">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-normal text-[#6834FF] bg-[#F0EBFF] rounded-md hover:bg-[#E7DFFF]"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`flex items-center justify-center px-4 py-2 text-sm font-normal text-white bg-[#6834FF] rounded-md hover:bg-[#5a2ad0] ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      )}
    </form>
  );
};