import React, { useState } from 'react';
import { Mail, Phone, Globe } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { ChangeStatusModal } from './ChangeStatusModal.jsx';

export const OrganizationHeader = ({ organization, onStatusUpdate }) => {
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  const handleStatusUpdateSuccess = () => {
    if (onStatusUpdate) {
      onStatusUpdate();
    }
  };

  return (
    <>
      {/* Main container: stacks vertically on small screens, row on medium+ */}
      
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-5 bg-white rounded-lg shadow-[0px_2px_12px_rgba(54,89,226,0.12)]">
        {/* Image: Smaller on small screens, centers itself, larger on medium+ */}
        <img
          src={organization.logo_url || 'https://via.placeholder.com/128'}
          alt="Organization Logo"
          className="w-24 h-24 md:w-32 md:h-32 rounded-md object-cover self-center md:self-start flex-shrink-0" // Centered on mobile
        />

        {/* Text content section */}
        <div className="flex-1 flex flex-col gap-2 md:gap-3"> {/* Smaller gap on mobile */}
          {/* Responsive heading size, allow wrapping */}
          <h2 className="text-xl md:text-2xl font-semibold text-[#232323] break-words">
            {organization.name || 'Organization Name'}
          </h2>

          {/* Contact info: Use smaller gap, allow wrapping */}
          <div className="flex items-center gap-1.5 text-sm text-[#777777] flex-wrap">
            <Mail className="w-5 h-5 text-[#97A1B2] flex-shrink-0" /> 
            <span className="truncate">{organization.organization_mail || 'N/A'}</span> {/* Truncate long emails */}
          </div>

          <div className="flex items-center gap-1.5 text-sm text-[#777777] flex-wrap">
            <Phone className="w-5 h-5 text-[#97A1B2] flex-shrink-0" />
            <span>{organization.contact || 'N/A'}</span>
          </div>

          <div className="flex items-center gap-1.5 text-sm flex-wrap">
            <Globe className="w-5 h-5 text-[#97A1B2] flex-shrink-0" />
            <a
              href={organization.website_url ? `http://${organization.website_url}` : '#'} // Basic URL handling
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6834FF] hover:underline truncate" // Truncate long URLs
            >
              {organization.website_url || 'website.com'}
            </a>
          </div>
        </div>

        {/* Status section: Aligns top-right on medium+, stacks below text on small */}
        <div className="flex items-center gap-2 self-start md:self-start mt-2 md:mt-0 flex-shrink-0"> {/* Adjusted alignment and margin */}
          <StatusBadge status={organization.status} />
          <button
            onClick={() => setIsStatusModalOpen(true)}
            className="text-xs text-[#6834FF] hover:underline whitespace-nowrap" // Prevent wrapping
          >
            Change status
          </button>
        </div>
      </div>

      
      <ChangeStatusModal
          isOpen={isStatusModalOpen}
          onClose={() => setIsStatusModalOpen(false)}
          organizationId={organization.id}
          currentStatus={organization.status}
          onSaveSuccess={handleStatusUpdateSuccess}
      />
    </>
  );
};