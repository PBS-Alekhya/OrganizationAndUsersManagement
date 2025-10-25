import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/layout/Header.jsx';
import { SubNavigation } from './components/layout/SubNavigation.jsx';
import { ManageB2B } from './pages/ManageB2B.jsx';
import { OrganizationDetailsPage } from './pages/OrganizationDetailsPage.jsx';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-page-bg font-['Nunito_Sans']">
      {/* Sticky Header and SubNav */}
      <div className="sticky top-0 z-40">
        <Header />
        <SubNavigation />
      </div>

      {/* Main Content Area with Responsive Padding */}
      <main className="flex-1 w-full max-w-full px-4 py-4 sm:px-6 md:px-10 lg:px-[70px] lg:py-6"> 
        {/* - px-4 py-4: Smallest padding for mobile.
          - sm:px-6: Slightly more horizontal padding on small screens and up.
          - md:px-10: More horizontal padding on medium screens and up.
          - lg:px-[70px] lg:py-6: Your original large padding for large screens and up.
          - flex-1: Ensures this area takes up remaining vertical space.
          - w-full max-w-full: Ensures it takes full width but prevents overflow issues.
        */}
        <Routes>
          <Route path="/" element={<ManageB2B />} />
          <Route path="/manage-b2b" element={<ManageB2B />} />
          <Route path="/organization/:id" element={<OrganizationDetailsPage />} />
          {/* You can add more routes here later */}
        </Routes>
      </main>
    </div>
  );
}

export default App;