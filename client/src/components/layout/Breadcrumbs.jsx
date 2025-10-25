import React from 'react';
import { Home, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom'; 

export const Breadcrumbs = () => {
  return (
    
    <div className="flex flex-wrap justify-between items-center w-full gap-2 md:gap-4">
      {/* Breadcrumb Path */}
      
      <div className="flex items-center gap-1 sm:gap-2 text-sm text-[#777777] flex-wrap">
        {/* Link the Home icon */}
        <Link to="/" className="flex-shrink-0">
          <Home className="w-5 h-5 text-[#97A1B2]" />
        </Link>
        <ChevronRight className="w-4 h-4 text-[#97A1B2] flex-shrink-0" /> 
        
        <span className="truncate sm:whitespace-normal">Manage B2B organizations</span>
        
      </div>

      {/* Search Button */}
      
      <button className="p-2 bg-[#F0EBFF] rounded-md hover:bg-[#E7DFFF] flex-shrink-0">
        <Search className="w-4 h-4 text-[#6834FF]" />
      </button>
    </div>
  );
};
