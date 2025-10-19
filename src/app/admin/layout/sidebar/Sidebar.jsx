'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Settings,
  Trophy,
  ChevronRight,
  X,
  Home,
  Gamepad2,
  UserRound,
  UsersRound,
  BarChart3,
  Play,
  Archive,
  ShoppingBag,
  Crown,
  HelpCircle,
  CreditCard,
  House,
} from 'lucide-react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Award,
  Shield,
  MessageSquare,
  FileText,
  DollarSign,
  UserCog,
  Bell,
  Tag,
  Image as ImageIcon,
  Zap,
  List,
  GitBranch,
  Flag,
  Mail,
  Download,
  Upload,
} from 'lucide-react';

// Menu sections matching the design
const menuSections = [
  {
    title: null,
    items: [
      { 
        id: 1, 
        icon: LayoutDashboard, 
        name: 'Dashboard', 
        href: '/admin',
        description: 'Overview & Analytics'
      }
    ],
  },
  {
    title: 'TOURNAMENT MANAGEMENT',
    items: [
      { 
        id: 2, 
        icon: Trophy, 
        name: 'All Tournaments', 
        href: '/admin/tournaments',
        badge: '15'
      },
      { 
        id: 3, 
        icon: Calendar, 
        name: 'Schedule', 
        href: '/admin/schedule' 
      },
      { 
        id: 5, 
        icon: Flag, 
        name: 'Matches', 
        href: '/admin/matches',
        badge: '8'
      },
    ],
  },
  {
    title: 'PARTICIPANTS',
    items: [
      { 
        id: 7, 
        icon: Users, 
        name: 'Teams', 
        href: '/admin/teams',
        badge: '42'
      },
      { 
        id: 8, 
        icon: Shield, 
        name: 'Players', 
        href: '/admin/players',
        badge: '156'
      },
      // { 
      //   id: 9, 
      //   icon: UserCog, 
      //   name: 'Registrations', 
      //   href: '/admin/registrations',
      //   badge: '23'
      // },
      // { 
      //   id: 10, 
      //   icon: FileText, 
      //   name: 'Verification', 
      //   href: '/admin/verification' 
      // },
    ],
  },
  // {
  //   title: 'CONTENT & MEDIA',
  //   comingSoon: true,
  //   items: [
  //     { 
  //       id: 11, 
  //       icon: FileText, 
  //       name: 'News & Articles', 
  //       href: '/admin/articles' 
  //     },
  //     { 
  //       id: 12, 
  //       icon: Zap, 
  //       name: 'Live Streams', 
  //       href: '/admin/streams' 
  //     },
  //     { 
  //       id: 13, 
  //       icon: ImageIcon, 
  //       name: 'Media Gallery', 
  //       href: '/admin/media' 
  //     },
  //     { 
  //       id: 14, 
  //       icon: MessageSquare, 
  //       name: 'Announcements', 
  //       href: '/admin/announcements' 
  //     },
  //   ],
  // },
  // {
  //   title: 'ANALYTICS & REPORTS',
  //   comingSoon: true,
  //   items: [
  //     { 
  //       id: 15, 
  //       icon: BarChart3, 
  //       name: 'Statistics', 
  //       href: '/admin/analytics' 
  //     },
  //     { 
  //       id: 16, 
  //       icon: DollarSign, 
  //       name: 'Financial Reports', 
  //       href: '/admin/finance' 
  //     },
  //     { 
  //       id: 17, 
  //       icon: Download, 
  //       name: 'Export Data', 
  //       href: '/admin/export' 
  //     },
  //   ],
  // },
  {
    title: 'SYSTEM',
    items: [
      { 
        id: 18, 
        icon: Gamepad2, 
        name: 'Games', 
        href: '/admin/games' 
      },
      { 
        id: 19, 
        icon: Tag, 
        name: 'Sponsors', 
        href: '/admin/sponsors' 
      },
      { 
        id: 20, 
        icon: Bell, 
        name: 'Notifications', 
        href: '/admin/notifications',
        badge: '5'
      },
      { 
        id: 21, 
        icon: Mail, 
        name: 'Email Templates', 
        href: '/admin/email-templates' 
      },
      { 
        id: 22, 
        icon: Settings, 
        name: 'Settings', 
        href: '/admin/settings' 
      },
    ],
  },
];

const Sidebar = ({ isMobileOpen, setIsMobileOpen, isExpanded = true, setIsExpanded }) => {
  const pathname = usePathname();
  const [localExpanded, setLocalExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Use prop if provided, otherwise use local state
  const expanded = setIsExpanded ? isExpanded : localExpanded;
  const setExpanded = setIsExpanded || setLocalExpanded;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      setExpanded(!expanded);
    }
  };

  const isOpen = isMobile ? isMobileOpen : expanded;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-secondary border-r border-slate-700/50 transition-all duration-300 ease-in-out z-50 flex flex-col ${
          isOpen ? (isMobile ? 'w-64' : 'w-64') : 'w-16'
        } ${isMobile && !isMobileOpen ? '-translate-x-full' : 'translate-x-0'}`}
      >
        {/* Header - Fixed */}
        <div className="flex items-center justify-between p-4 border-b border-secondary/50 h-20 flex-shrink-0">
          {/* Logo - only show when sidebar is open */}
          {(isOpen || isMobile) && (
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-48 h-16">
                <Image
                  src="/images/logo-gamius-white.png"
                  alt="Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>
            </div>
          )}

          {/* Close button for mobile */}
          {isMobile && isMobileOpen && (
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-1 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors duration-200 flex-shrink-0"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>
          )}

          {/* Toggle button for desktop collapsed */}
          {!isMobile && !isOpen && (
            <button
              onClick={handleToggle}
              className="p-1 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors duration-200 mx-auto"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {/* Section title */}
              {section.title && (isOpen || isMobile) && (
                <div className="px-4 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs text-slate-500 uppercase font-valorant whitespace-nowrap">
                      {section.title}
                    </h3>
                    {section.comingSoon && (
                      <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-400 rounded-full font-semibold whitespace-nowrap">
                        COMING SOON
                      </span>
                    )}
                    <span className="flex-1 h-px bg-gradient-to-r from-slate-600/60 to-transparent"></span>
                  </div>
                </div>
              )}

              {/* Section items */}
              <div className="space-y-1 px-2">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  const isDisabled = section.comingSoon;

                  if (isDisabled) {
                    return (
                      <div
                        key={item.id}
                        className="relative flex items-center font-ea-football tracking-wider px-3 py-2 rounded-lg opacity-50 cursor-not-allowed"
                        title={!isOpen && !isMobile ? `${item.name} (Coming Soon)` : undefined}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0 text-slate-500" />

                        {(isOpen || isMobile) && (
                          <>
                            <span className="ml-3 font-medium text-sm truncate text-slate-500">
                              {item.name}
                            </span>
                            {item.badge && (
                              <span className="ml-auto px-2 py-1 text-xs bg-slate-700/50 text-slate-500">
                                {item.badge}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      href={item.href}
                      key={item.id}
                      className={`relative flex items-center font-ea-football tracking-wider px-3 py-2 rounded-lg transition-all duration-200 group
                        ${
                          isActive
                            ? 'text-white faded-border p-0.5 ' 
                            : 'text-slate-400 hover:text-primary ' 
                        }`}
                      onClick={() => isMobile && setIsMobileOpen(false)}
                      title={!isOpen && !isMobile ? item.name : undefined}
                    >
                      <Icon className={`${isActive && 'text-primary'} w-4 h-4 flex-shrink-0`} />

                      {(isOpen || isMobile) && (
                        <>
                          <span className="ml-3 font-medium text-sm truncate">{item.name}</span>

                          {item.badge && (
                            <span
                              className={`ml-auto px-2 py-1 text-xs ${
                                isActive ? 'bg-white/20 text-white' : 'bg-slate-700 text-slate-300'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse button for expanded desktop view - Fixed */}
        {!isMobile && isOpen && (
          <div className="p-4 border-t border-slate-700/50 flex-shrink-0">
            <button
              onClick={handleToggle}
              className="w-full flex items-center justify-center p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 transition-colors duration-200"
            >
              <ChevronRight className="w-4 h-4 text-gray-400 rotate-180" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;