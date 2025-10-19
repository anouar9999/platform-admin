'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from './layout/header/Header';
import Sidebar from './layout/sidebar/Sidebar';


const metadata = {
  title: 'Dashboard | Gaming Tournament Platform',
  description:
    'View real-time statistics and insights about tournaments, users, and team performance.',
};

const Layout = ({ children }) => {
  const [showGlow, setShowGlow] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Close mobile sidebar when switching to desktop
      if (!mobile && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileOpen]);

  useEffect(() => {
    let timer;
    if (showGlow) {
      timer = setTimeout(() => setShowGlow(false), 1200);
    }
    return () => clearTimeout(timer);
  }, [showGlow]);

  const triggerGlow = () => {
    setShowGlow(true);
  };

  // Calculate main content margin based on sidebar state
  const getMainContentMargin = () => {
    if (isMobile) {
      return 'ml-0'; // No margin on mobile
    }
    return isSidebarExpanded ? 'ml-64' : 'ml-16'; // 256px for expanded, 64px for collapsed
  };

  return (
    <div className="relative flex flex-col min-h-screen text-white font-pilot">
      {/* Base Background Color */}
      <div className="fixed inset-0 bg-[#11243D] z-10"></div>

      {/* Content */}
      <div className="relative z-30 flex flex-col min-h-screen">
        <Header 
          setIsMobileOpen={setIsMobileOpen}
          isMobileOpen={isMobileOpen}
          isSidebarExpanded={isSidebarExpanded}
          isMobile={isMobile}
        />
        
        <div className="flex flex-1">
          <Sidebar 
            isMobileOpen={isMobileOpen} 
            setIsMobileOpen={setIsMobileOpen}
            isExpanded={isSidebarExpanded}
            setIsExpanded={setIsSidebarExpanded}
          />
          
          <main 
            className={`flex-1 transition-all duration-300 ease-in-out overflow-y-auto pt-16 md:pt-20 ${getMainContentMargin()}`}
          >
            {/* Main content area with background image and overlay */}
            <div className="relative min-h-full">
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src="https://cmsassets.rgpub.io/sanity/images/dsfx7636/news/0c5c2627f823f5ee27062920c2dd921b322f4338-2712x2160.png?auto=format&fit=fill&q=80&h=1735"
                  alt="Gaming Background"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Simplified Overlay - Transparent to Color */}
              <div className="absolute inset-0 z-5 bg-gradient-to-b from-secondary/90 via-secondary to-secondary"></div>
              <div className="absolute inset-0 z-5 bg-gradient-to-r from-secondary/80 via-transparent to-secondary/60"></div>
              
              {/* Content */}
              <div className="relative z-10  ">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay backdrop */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;