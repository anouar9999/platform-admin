'use client';
import React, { useState, useEffect } from 'react';
import { Menu, Plus, X } from 'lucide-react';
import Profile from './Profile';
import { Stack } from '@mui/material';
import Image from 'next/image';
import CustomButton from '@/app/admin/components/CustomButton';

const Header = ({ setIsMobileOpen }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobileOpen]);

  const toggleMenu = () => {
    setIsMobileOpen((prev) => !prev);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 md:h-20 bg-secondary bg-opacity-90 backdrop-filter backdrop-blur-lg flex items-center justify-between px-6 md:px-16 z-50">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="relative w-24 h-8 md:w-32 md:h-14">
          <Image
            src="/images/logo-gamius-white.png"
            alt="Logo"
            fill
            style={{ objectFit: 'contain' }}
            priority
          />
        </div>
        
      </div>
    
    
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {!isMobile ? (
          <>
            {/* <button
              onClick={() => window.location.href = '/admin/new-tournament'}
                className="flex items-center justify-around bg-primary text-base sm:text-[12pt] text-black px-7 py-2 font-custom rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed "
              type="button"
            >
              <Plus className=''/>
              New Tournament
            </button>
             */}
            <Profile />
          </>
        ) : (
          <button 
            className="text-white hover:text-gray-300 transition-colors duration-200 p-1" 
            onClick={toggleMenu}
            aria-label="Toggle mobile menu"
          >
            <Menu size={24} />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;