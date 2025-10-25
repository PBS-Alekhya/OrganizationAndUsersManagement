import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Filter, Eye, Trash2 } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { StatusBadge } from '../common/StatusBadge';
import { AddOrganizationModal } from './AddOrganizationModal.jsx';
import { Link } from 'react-router-dom';
import { DeleteOrganizationConfirmationModal } from './DeleteOrganizationConfirmationModal.jsx';

export const OrganizationTable = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);

  const fetchOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/organizations');
      setOrganizations(response.data);
    } catch (err) {
      console.error("Failed to fetch organizations:", err);
      setError("Could not load organizations. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleDeleteClick = (org) => {
    setSelectedOrg(org);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await fetchOrganizations();
  };

  return (
    <>
      {/* Container for table + overflow handling */}
      <div className="w-full overflow-hidden rounded-lg border border-[#DFE2E7] bg-white">
        {/* Header section (title + button) */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-5 py-3 gap-3"> 
          <h2 className="text-base font-semibold text-[#232323] self-start sm:self-center"> 
            B2B Organizations
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1 px-4 py-2 text-xs font-normal text-white bg-[#6834FF] rounded-md hover:bg-[#5a2ad0] self-end sm:self-center" // Align button
          >
            <Plus className="w-3 h-3" />
            <span>Add organization</span>
          </button>
        </div>

        {/* Wrapper div for horizontal scrolling on small screens */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]"> {/* min-w ensures table doesn't collapse too much */}
            <thead className="bg-[#F5F6F7]">
              <tr>
                 {/* Sr. No: Hidden on small, visible medium+ */}
                <th className="hidden md:table-cell px-3 py-3 text-xs font-normal text-center text-[#232323] w-16"> 
                  Sr. No
                </th>
                 {/* Organizations: Always visible, takes more space */}
                <th className="px-3 py-3 text-xs font-normal text-left text-[#232323]"> 
                  Organizations
                </th>
                 {/* Pending Requests: Hidden on small, visible large+ */}
                <th className="hidden lg:table-cell px-3 py-3 text-xs font-normal text-left text-[#232323]"> 
                  Pending requests
                </th>
                 {/* Status: Hidden on small, visible medium+ */}
                <th className="hidden sm:table-cell px-3 py-3 text-xs font-normal text-left text-[#232323] w-32"> 
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <Filter className="w-4 h-4 text-[#97A1B2]" />
                  </div>
                </th>
                 {/* Action: Always visible */}
                <th className="px-3 py-3 text-xs font-normal text-left text-[#232323] w-24"> 
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F6F7]"> {/* Use divide-y for borders */}
              {/* --- LOADING STATE --- */}
              {loading && (
                [...Array(3)].map((_, index) => (
                  <tr key={`skeleton-${index}`}>
                    {/* Responsive Skeleton Cells */}
                    <td className="hidden md:table-cell px-3 py-4 text-center"><Skeleton width={20} /></td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton circle width={32} height={32} />
                        <Skeleton width={150} />
                      </div>
                    </td>
                    <td className="hidden lg:table-cell px-3 py-4"><Skeleton width={120} /></td>
                    <td className="hidden sm:table-cell px-3 py-4"><Skeleton width={60} height={28} style={{ borderRadius: '9999px' }} /></td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton width={16} height={16} />
                        <Skeleton width={16} height={16} />
                      </div>
                    </td>
                  </tr>
                ))
              )}

               {/* --- ERROR STATE --- */}
              {!loading && error && (
                <tr>
                  {/* Span across potentially visible columns */}
                  <td colSpan={5} className="p-5 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              )}

              {/* --- DATA LOADED & NO ERROR --- */}
              {!loading && !error && organizations.map((org, index) => (
                <tr key={org.id}>
                  {/* Responsive Data Cells */}
                  <td className="hidden md:table-cell px-3 py-4 text-sm text-center text-[#232323]">
                    {index + 1}
                  </td>
                  <td className="px-3 py-4 text-sm text-[#232323]">
                    <Link
                      to={`/organization/${org.id}`}
                      className="flex items-center gap-2 group"
                    >
                      <img
                        src={org.logo_url || 'https://via.placeholder.com/32'}
                        alt="logo"
                        className="w-8 h-8 rounded-full flex-shrink-0" // Prevent shrinking
                      />
                      {/* Allow text to wrap/truncate if needed */}
                      <span className="font-semibold group-hover:underline group-hover:text-[#6834FF] break-words">
                        {org.name}
                      </span>
                    </Link>
                  </td>
                  <td className="hidden lg:table-cell px-3 py-4 text-sm text-[#232323]">
                    {org.pending_requests} pending requests
                  </td>
                  <td className="hidden sm:table-cell px-3 py-4 text-sm text-[#232323]">
                    <StatusBadge status={org.status} />
                  </td>
                  <td className="px-3 py-4 text-sm text-[#232323]">
                    <div className="flex items-center gap-3">
                      <Link to={`/organization/${org.id}`}>
                        <Eye className="w-4 h-4 text-[#97A1B2] cursor-pointer hover:text-[#6834FF]" />
                      </Link>
                      <button onClick={() => handleDeleteClick(org)}>
                        <Trash2 className="w-4 h-4 text-[#97A1B2] cursor-pointer hover:text-[#E92B2B]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {/* --- EMPTY STATE (NO ERROR) --- */}
              {!loading && !error && organizations.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-5 text-center text-gray-500">
                    No organizations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div> {/* End of overflow-x-auto wrapper */}
      </div>

      
      <AddOrganizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSuccess={fetchOrganizations}
      />
      <DeleteOrganizationConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        organization={selectedOrg}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};