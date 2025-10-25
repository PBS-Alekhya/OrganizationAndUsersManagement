import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AddUserModal } from './AddUserModal.jsx';
import { EditUserModal } from './EditUserModal.jsx';
import { DeleteUserConfirmationModal } from './DeleteUserConfirmationModal.jsx';

// RoleBadge component 
const RoleBadge = ({ role }) => {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-600';

  if (role === 'Admin') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-700';
  } else if (role === 'Co-ordinator') {
    bgColor = 'bg-orange-100';
    textColor = 'text-orange-700';
  }
  
  return (
    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${bgColor} ${textColor}`}>
      {role}
    </span>
  );
};


export const OrganizationUserTable = ({ organizationId }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/organizations/${organizationId}/users`);
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      setError("Could not load users. Please try refreshing the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (organizationId) {
      fetchUsers();
    }
  }, [organizationId]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    await fetchUsers();
  };

  return (
    <>
      <div className="w-full overflow-hidden bg-white rounded-lg border border-[#DFE2E7]">
         {/* Card Header: Make button wrap below title on small screens */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-5 py-3 gap-3"> {/* Use px-4 on small */}
          <h2 className="text-base font-semibold text-[#232323] self-start sm:self-center">
            Users
          </h2>
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="flex items-center gap-1 px-4 py-2 text-xs font-normal text-white bg-[#6834FF] rounded-md hover:bg-[#5a2ad0] self-end sm:self-center" // Align button
          >
            <Plus className="w-3 h-3" />
            <span>Add user</span>
          </button>
        </div>

        {/* Wrapper div for horizontal scrolling on small screens */}
        <div className="overflow-x-auto">
          {/* Apply min-width to prevent table collapse */}
          <table className="w-full min-w-[500px]"> 
            <thead className="bg-[#F5F6F7]">
              <tr>
                {/* Sr. No: Hidden on small screens */}
                <th className="hidden sm:table-cell px-3 py-3 text-xs font-normal text-center text-[#232323] w-16"> 
                  Sr. No
                </th>
                {/* User Name: Always visible */}
                <th className="px-3 py-3 text-xs font-normal text-left text-[#232323]"> 
                  User name
                </th>
                {/* Role: Always visible */}
                <th className="px-3 py-3 text-xs font-normal text-left text-[#232323] "> 
                  Role
                </th>
                 {/* Action: Always visible */}
                <th className="px-3 py-3 text-xs font-normal text-left text-[#232323] w-24"> 
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F6F7]">
              {/* --- LOADING STATE --- */}
              {loading && (
                [...Array(3)].map((_, index) => (
                  <tr key={`skeleton-user-${index}`}>
                     {/* Responsive Skeleton Cells */}
                    <td className="hidden sm:table-cell px-3 py-4 text-center"><Skeleton width={20} /></td>
                    <td className="px-3 py-4"><Skeleton width={150} /></td>
                    <td className="px-3 py-4"><Skeleton width={80} height={28} style={{ borderRadius: '9999px' }} /></td>
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
                  <td colSpan={4} className="p-5 text-center text-red-600"> 
                    {error}
                  </td>
                </tr>
              )}

              {/* --- DATA LOADED & NO ERROR --- */}
              {!loading && !error && users.map((user, index) => (
                <tr key={user.id}>
                   {/* Responsive Data Cells */}
                  <td className="hidden sm:table-cell px-3 py-4 text-sm text-center text-[#232323]">
                    {index + 1}
                  </td>
                  <td className="px-3 py-4 text-sm text-[#232323] font-normal break-words"> 
                    {user.user_name}
                  </td>
                  <td className="px-3 py-4 text-sm text-[#232323]">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-3 py-4 text-sm text-[#232323]">
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleEditClick(user)}>
                          <Pencil className="w-4 h-4 text-[#97A1B2] cursor-pointer hover:text-[#6834FF]" />
                      </button>
                      <button onClick={() => handleDeleteClick(user)}>
                          <Trash2 className="w-4 h-4 text-[#97A1B2] cursor-pointer hover:text-[#E92B2B]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

               {/* --- EMPTY STATE (NO ERROR) --- */}
              {!loading && !error && users.length === 0 && (
                   <tr>
                      <td colSpan={4} className="p-5 text-center text-gray-500">
                          No users found for this organization.
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div> {/* End overflow wrapper */}
      </div>

      {/* Modals remain unchanged */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        organizationId={organizationId}
        onSaveSuccess={fetchUsers}
      />
      <EditUserModal
        isOpen={isEditUserModalOpen}
        onClose={() => setIsEditUserModalOpen(false)}
        user={selectedUser}
        onSaveSuccess={fetchUsers}
      />
      <DeleteUserConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        user={selectedUser}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
};