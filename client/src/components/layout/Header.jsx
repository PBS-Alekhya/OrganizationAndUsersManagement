import React from 'react';
import { Headset, Bell, User, Menu } from 'lucide-react'; 

export const Header = () => {
  return (
    
    <nav className="flex justify-between items-center w-full px-4 md:px-8 py-4 bg-white/70 backdrop-blur-md shadow-[0px_4px_8px_rgba(54,89,226,0.08)]">
      {/* Logo */}
      
      <div className="text-xl font-bold border-2 border-black px-4 py-1">
        LOGO
      </div>

      {/* Icons */}
      
      <div className="flex items-center gap-3 md:gap-5">
        
        <Headset className="w-5 h-5 text-[#0B1331] cursor-pointer" />
        <Bell className="w-5 h-5 text-[#0B1331] cursor-pointer" />

        {/* Avatar */}
        
        <div className="w-10 h-10 rounded-full bg-[#F0EBFF] flex items-center justify-center cursor-pointer">
          <User className="w-6 h-6 text-[#6834FF]" />
        </div>

        
      </div>
    </nav>
  );
};