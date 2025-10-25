import React from 'react';

export const SubNavigation = () => {
  return (
    
    <nav className="flex items-center gap-4 md:gap-8 px-4 sm:px-6 md:px-10 lg:px-[70px] bg-white shadow-[0px_2px_12px_rgba(54,89,226,0.12)] overflow-x-auto whitespace-nowrap"> 
      {/* - px-4 sm:px-6 md:px-10 lg:px-[70px]: Responsive padding.
        - gap-4 md:gap-8: Smaller gap on mobile, larger on medium+.
        - overflow-x-auto: Allows horizontal scrolling if tabs don't fit.
        - whitespace-nowrap: Prevents tabs from wrapping to the next line.
      */}
      <a
        href="#"
        // Reduced vertical padding slightly for a tighter look (py-3)
        className="py-3 text-sm text-[#777777] hover:text-[#6834FF] flex-shrink-0" // flex-shrink-0 prevents items from shrinking
      >
        Dashboard
      </a>
      <a
        href="#"
        // Reduced vertical padding (py-3)
        className="relative py-3 text-sm font-semibold text-[#6834FF] flex-shrink-0" // flex-shrink-0
      >
        Manage B2B organizations
        {/* Active tab underline */}
        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#6834FF]"></span>
      </a>
      
    </nav>
  );
};