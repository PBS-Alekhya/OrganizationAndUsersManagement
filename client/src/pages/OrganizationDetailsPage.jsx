import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Home, ChevronRight, AlertCircle } from 'lucide-react';
import { OrganizationHeader } from '../components/organizations/OrganizationHeader.jsx';
import { OrganizationTabs } from '../components/organizations/OrganizationTabs.jsx';
import { OrganizationProfileForm } from '../components/organizations/OrganizationProfileForm.jsx';
import { OrganizationUserTable } from '../components/users/OrganizationUserTable.jsx';

export const OrganizationDetailsPage = () => {
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');

  const fetchOrganization = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/organizations/${id}`);
      setOrganization(response.data);
    } catch (err) {
      console.error("Failed to fetch organization:", err);
      if (err.response && err.response.status === 404) {
         setError(`Organization with ID ${id} not found.`);
      } else {
         setError("Could not load organization details. Please try refreshing the page.");
      }
      setOrganization(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [id]);

  const HeaderSkeleton = () => (
     <div className="flex flex-col sm:flex-row gap-6 p-5 bg-white rounded-lg shadow-[0px_2px_12px_rgba(54,89,226,0.12)]"> 
        <Skeleton width={128} height={128} className="rounded-md self-center sm:self-start"/> 
        <div className="flex-1 flex flex-col gap-3">
           <Skeleton width={`60%`} height={32}/>
           <Skeleton width={`40%`} /> 
           <Skeleton width={`35%`} /> 
           <Skeleton width={`30%`} /> 
        </div>
         <div className="flex items-center gap-2 self-start mt-4 sm:mt-0"> 
             <Skeleton width={60} height={28} style={{ borderRadius: '9999px' }} />
             <Skeleton width={80} height={20}/>
         </div>
     </div>
  );
  
  const ContentSkeleton = () => (
      <div className="p-5 bg-white rounded-lg shadow-[0px_2px_12px_rgba(54,89,226,0.12)]">
          <Skeleton height={28} width={150} className="mb-4"/>
          <Skeleton height={1} className="mb-4"/>
          <Skeleton height={28} width={200} className="mb-2"/>
          {/* Use grid-cols-1 on small screens */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <Skeleton height={68} count={2}/>
          </div>
           <Skeleton height={28} width={180} className="mb-2"/>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton height={68} count={3}/>
          </div>
      </div>
  );

  return (
    
    <div className="flex flex-col flex-1 gap-6">
      {/* 1. Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-[#777777] flex-wrap"> 
        <Link to="/"><Home className="w-5 h-5 text-[#97A1B2]" /></Link>
        <ChevronRight className="w-4 h-4 text-[#97A1B2]" />
        <Link to="/manage-b2b" className="hover:underline">Manage B2B organizations</Link>
        <ChevronRight className="w-4 h-4 text-[#97A1B2]" />
        
        <span className="truncate">{loading ? '...' : (organization?.name || 'Organization details')}</span>
      </div>

      {/* --- LOADING STATE --- */}
      {loading && (
          <>
             <HeaderSkeleton />
             <div className="flex gap-3">
                 <Skeleton width={113} height={32} />
                 <Skeleton width={69} height={32} />
             </div>
             <ContentSkeleton />
          </>
      )}

      {/* --- ERROR STATE --- */}
      {!loading && error && (
         <div className="flex flex-col items-center justify-center p-10 border border-red-200 bg-red-50 rounded-lg text-red-600">
             <AlertCircle className="w-12 h-12 mb-4" />
             <h3 className="text-lg font-semibold mb-2">Error Loading Data</h3>
             <p>{error}</p>
         </div>
      )}

      {/* --- SUCCESS STATE --- */}
      {!loading && !error && organization && (
        <>
          <OrganizationHeader
            organization={organization}
            onStatusUpdate={fetchOrganization}
          />
          <OrganizationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === 'details' && (
            <OrganizationProfileForm
              organization={organization}
              onSaveSuccess={fetchOrganization}
            />
          )}
          {activeTab === 'users' && (
            <OrganizationUserTable organizationId={id} />
          )}
        </>
      )}
    </div>
  );
};