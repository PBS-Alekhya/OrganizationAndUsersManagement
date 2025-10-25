import React from 'react';

import { Breadcrumbs } from '../components/layout/Breadcrumbs.jsx';
import { OrganizationTable } from '../components/organizations/OrganizationTable.jsx';

export const ManageB2B = () => {
  return (
    <div className="flex flex-col flex-1 gap-6">
      <Breadcrumbs />
      <OrganizationTable />
    </div>
  );
};
