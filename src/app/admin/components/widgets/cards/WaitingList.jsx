/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search,
  Users,
  Clock,
  Ban,
  Filter,
  Mail,
  Shield,
  CheckCircle2,
  X,
  Check,
  AlertCircle,
  ChevronDown,
  LayoutGrid,
  List,
  Info,
  Star,
  User,
  Gamepad2,
  Crown,
  Trophy,
  Percent,
  PercentCircle,
} from 'lucide-react';
import TransparentLoader from '@/app/admin/(pages)/tournament/[slug]/Loader';
import SearchAndFilterBar from './SearchAndFilterBar';
import { set } from 'lodash';
import { TbTournament } from 'react-icons/tb';

const DEFAULT_IMAGES = {
  team: `data:image/svg+xml,${encodeURIComponent(`
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" fill="#0F172A"/>
      <path d="M0 0L80 80M80 0L0 80" stroke="#1E293B" stroke-width="1"/>
      <g opacity="0.9">
        <circle cx="25" cy="32" r="8" fill="#475569"/>
        <path d="M17 45C17 41.134 20.134 38 24 38H26C29.866 38 33 41.134 33 45V48H17V45Z" fill="#475569"/>
        <circle cx="40" cy="28" r="10" fill="#475569"/>
        <path d="M30 44C30 39.582 33.582 36 38 36H42C46.418 36 50 39.582 50 44V48H30V44Z" fill="#475569"/>
        <circle cx="55" cy="32" r="8" fill="#475569"/>
        <path d="M47 45C47 41.134 50.134 38 54 38H56C59.866 38 63 41.134 63 45V48H47V45Z" fill="#475569"/>
      </g>
      <rect x="0" y="0" width="80" height="2" fill="#3B82F6" opacity="0.5"/>
      <rect x="20" y="60" width="40" height="4" rx="2" fill="#3B82F6" opacity="0.3"/>
    </svg>
  `)}`,
  participant: `data:image/svg+xml,${encodeURIComponent(`
    <svg width="100%" height="100%" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="80" fill="#0F172A"/>
      <path d="M0 0L80 80M80 0L0 80" stroke="#1E293B" stroke-width="1"/>
      <g opacity="0.9">
        <circle cx="40" cy="30" r="12" fill="#475569"/>
        <path d="M20 55C20 48.373 25.373 43 32 43H48C54.627 43 60 48.373 60 55V60H20V55Z" fill="#475569"/>
      </g>
      <rect x="0" y="0" width="80" height="2" fill="#6366F1" opacity="0.5"/>
      <rect x="25" y="65" width="30" height="3" rx="1.5" fill="#6366F1" opacity="0.3"/>
    </svg>
  `)}`,
};

const RefusedParticipants = ({ profiles, onReview, onViewDetails }) => (
  <div className="mt-8 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-red-500/20">
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/10">
            <Ban className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Refused Participants</h3>
            <p className="text-sm text-gray-400">{profiles.length} participants refused</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-gray-800/80 rounded-lg overflow-hidden border border-red-500/10 hover:border-red-500/30"
          >
            <div className="flex items-center p-4 gap-4">
              <div className="relative">
                <img
                  src={profile.avatar || '/api/placeholder/64/64'}
                  alt={profile.name}
                  className="w-16 h-16 rounded-lg object-cover grayscale"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-gray-800" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-medium truncate">{profile.name}</h4>
                <p className="text-sm text-gray-400 truncate">{profile.email}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Refused on {new Date(profile.registration_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 flex gap-2">
              <button
                onClick={() => onReview(profile.id)}
                className="flex-1 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 
                         hover:bg-yellow-500/20 transition-colors text-sm"
              >
                Review Again
              </button>
              <button
                onClick={() => onViewDetails(profile)}
                className="px-3 py-2 rounded-lg bg-gray-700/50 text-gray-300
                         hover:bg-gray-700 transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProfileView = ({ tournamentId }) => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRefused, setShowRefused] = useState(false);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [notification, setNotification] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [error, setError] = useState(null);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Remove fakeProfiles array

  // Add this function to handle search:
  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  const handleReviewAgain = async (profileId) => {
    await handleStatusUpdate(profileId, 'pending');
    setShowRefused(false);
  };
  
  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/participants_registration.php?tournament_id=${tournamentId}`,
      );
      const data = await response.json();
      console.log(data);
      if (!response.ok) throw new Error(data.message || 'Failed to fetch');
      setProfiles(data.profiles || []);
    } catch (err) {
      setError(err.message);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, [tournamentId]);
  
  const [showFilter, setShowFilter] = useState(false);

  // Add click outside handler
  useEffect(() => {
    const closeFilter = (e) => {
      if (showFilter && !e.target.closest('.filter-dropdown')) {
        setShowFilter(false);
      }
    };
    document.addEventListener('click', closeFilter);
    return () => document.removeEventListener('click', closeFilter);
  }, [showFilter]);
  
  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);
  
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleStatusUpdate = async (profileId, newStatus) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_registration_status.php`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registration_id: profileId,
            status: newStatus,
            admin_id: localStorage.getItem('adminId'),
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setProfiles((prev) =>
        prev.map((profile) =>
          profile.id === profileId ? { ...profile, status: newStatus } : profile,
        ),
      );
      showNotification(`Successfully ${newStatus} participant`);
      setSelectedProfile(null);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const { activeProfiles, refusedProfiles, filteredProfiles } = useMemo(() => {
    // Start with all profiles
    let filtered = [...profiles];

    // Filter by status first
    if (filterStatus !== 'all') {
      filtered = filtered.filter((profile) => profile.status === filterStatus);
    }

    // Apply search if there is a search term
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((profile) => {
        if (profile.team_id) {
          // Search in team fields
          return (
            (profile.team_name || '').toLowerCase().includes(term) ||
            (profile.owner_name || '').toLowerCase().includes(term) ||
            (profile.description || '').toLowerCase().includes(term)
          );
        } else {
          // Search in individual profile fields
          return (
            (profile.name || '').toLowerCase().includes(term) ||
            (profile.email || '').toLowerCase().includes(term)
          );
        }
      });
    }

    return {
      activeProfiles: profiles.filter((p) => p.status !== 'rejected'),
      refusedProfiles: profiles.filter((p) => p.status === 'rejected'),
      filteredProfiles: filtered,
    };
  }, [profiles, filterStatus, searchQuery]);
  
  // Components
  const Header = () => (
    <div className="mb-8">
      <h1 className="text-4xl flex items-center font-custom tracking-wider uppercasem">Registration Management</h1>
      <div className="flex items-center text-primary">
      
      <TbTournament />
        <p className="mx-2">Manage and review tournament registrations</p>
      </div>
      
    </div>
  );

  const StatsGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {[
        { title: 'Total Participants', value: profiles.length, icon: Users, color: 'blue' },
        {
          title: 'Pending Review',
          value: profiles.filter((p) => p.status === 'pending').length,
          icon: Clock,
          color: 'yellow',
        },
        {
          title: 'Refused',
          value: refusedProfiles.length,
          icon: Ban,
          color: 'red',
          onClick: () => setShowRefused(!showRefused),
        },
      ].map((stat) => (
        <div
          key={stat.title}
          onClick={stat.onClick}
          className={`bg-secondary backdrop-blur-sm  p-6 angular-cut ${
            stat.onClick ? 'cursor-pointer hover:bg-gray-700/50 ' : ''
          }`}
        >
          <div className="flex justify-between items-start angular-cut">
            <div>
              <p className="text-gray-400">{stat.title}</p>
              <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
            </div>
            <div className={`p-3 rounded-lg bg-${stat.color}-500/20`}>
              <stat.icon className={`text-${stat.color}-400`} size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ProfileCard = ({ profile, viewType = 'grid', onStatusUpdate, onClick }) => {
    // Status configuration mapping with improved colors and effects
    const statusConfig = {
      pending: { 
        color: 'amber', 
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        hoverBg: 'hover:bg-amber-500/20',
        textColor: 'text-amber-400',
        icon: Clock 
      },
      accepted: { 
        color: 'emerald', 
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        hoverBg: 'hover:bg-emerald-500/20',
        textColor: 'text-emerald-400',
        icon: CheckCircle2 
      },
      rejected: { 
        color: 'rose', 
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/30',
        hoverBg: 'hover:bg-rose-500/20',
        textColor: 'text-rose-400',
        icon: Ban 
      },
    };
  
    const { bgColor, borderColor, textColor, hoverBg, icon: StatusIcon } = statusConfig[profile.status];
  
    // Default SVG content for profile and team with improved design
    const defaultProfileSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E293B" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#6366F1" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#6366F1" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#profileGrad)"/>
      <path d="M0 0 L400 400 M400 0 L0 400" stroke="#334155" stroke-width="1" opacity="0.3"/>
      <circle cx="200" cy="200" r="180" fill="url(#glowGrad)"/>
      <circle cx="200" cy="150" r="70" fill="#475569"/>
      <path d="M200 230 C120 230 60 280 60 370 L340 370 C340 280 280 230 200 230" fill="#475569"/>
      <circle cx="200" cy="200" r="195" fill="none" stroke="#6366F1" stroke-width="2" stroke-dasharray="4,8" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="60s" repeatCount="indefinite" />
      </circle>
    </svg>`)}`;
  
    const defaultTeamSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="teamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E293B" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
        <radialGradient id="teamGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#3B82F6" stop-opacity="0.2" />
          <stop offset="100%" stop-color="#3B82F6" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="url(#teamGrad)"/>
      <path d="M0 0 L400 400 M400 0 L0 400" stroke="#334155" stroke-width="1" opacity="0.3"/>
      <circle cx="200" cy="200" r="180" fill="url(#teamGlow)"/>
      <circle cx="150" cy="150" r="40" fill="#475569"/>
      <path d="M150 200 C110 200 80 220 80 280 L220 280 C220 220 190 200 150 200" fill="#475569"/>
      <circle cx="250" cy="150" r="40" fill="#475569"/>
      <path d="M250 200 C210 200 180 220 180 280 L320 280 C320 220 290 200 250 200" fill="#475569"/>
      <circle cx="200" cy="220" r="40" fill="#475569"/>
      <path d="M200 270 C160 270 130 290 130 350 L270 350 C270 290 240 270 200 270" fill="#475569"/>
      <circle cx="200" cy="200" r="195" fill="none" stroke="#3B82F6" stroke-width="2" stroke-dasharray="4,8" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" from="0 200 200" to="360 200 200" dur="60s" repeatCount="indefinite" />
      </circle>
    </svg>`)}`;
  
    // Get image URL with fallbacks
    const getImageUrl = () => {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';
  
      if (profile.team_id) {
        return profile.team_image && profile.team_image !== '' 
          ? `${baseUrl}${profile.team_image}` 
          : defaultTeamSvg;
      } else {
        return profile.avatar && profile.avatar !== '' 
          ? `${baseUrl}${profile.avatar}` 
          : defaultProfileSvg;
      }
    };
  
    // Grid View Redesign
    if (viewType === 'grid') {
      return (
        <div 
          className={`relative overflow-hidden angular-cut backdrop-blur-sm bg-secondary 
            hover:bg-gray-800/60 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg 
            hover:shadow-${statusConfig[profile.status].color}-500/10 cursor-pointer h-64`}
          onClick={() => onClick && onClick(profile)}
        >
          
          {/* Content container */}
          <div className="relative h-full z-10 p-5 flex flex-col">
            {/* Top section with status and type */}
            <div className="flex justify-between items-start mb-3">
              {/* Status badge */}
              <div className={`px-3 py-1.5 rounded-full ${bgColor} ${textColor} flex items-center gap-1.5 text-xs font-medium`}>
                <StatusIcon size={12} />
                <span>{profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}</span>
              </div>
              
              {/* Team or individual badge */}
              {profile.team_id ? (
                <div className="bg-blue-500/20 px-2 py-1 rounded-full flex items-center gap-1.5">
                  <Users size={12} className="text-blue-400" />
                  <span className="text-xs font-medium text-blue-300">Team</span>
                </div>
              ) : (
                <div className="bg-purple-500/20 px-2 py-1 rounded-full flex items-center gap-1.5">
                  <User size={12} className="text-purple-400" />
                  <span className="text-xs font-medium text-purple-300">Individual</span>
                </div>
              )}
            </div>
            
            {/* Avatar/Image section */}
            <div className="flex-grow flex flex-col items-center justify-center py-2">
              <div className="relative">
                <div className={`w-20 h-20 rounded-full overflow-hidden  
                  bg-gray-800/80 backdrop-blur-md shadow-lg`}>
                  <img 
                    src={getImageUrl()} 
                    alt={profile.team_id ? profile.team_name : profile.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            
            {/* Name and details section */}
            <div className="mt-2 text-center">
              <h3 className="text-lg font-bold text-white tracking-wide truncate">
                {profile.team_id ? profile.team_name : profile.name}
              </h3>
              
              {profile.team_id ? (
                <div className="mt-1">
                  <p className="text-sm text-gray-300">Captain: {profile.owner_name}</p>
                  <div className="flex items-center justify-center mt-1 gap-3">
                    <div className="flex items-center text-xs text-blue-400">
                      <Users size={12} className="mr-1" />
                      <span>{profile.member_count}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock size={12} className="mr-1" />
                      <span>{new Date(profile.registration_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-1">
                  <p className="text-sm text-gray-300 truncate">{profile.email}</p>
                  <div className="flex items-center justify-center mt-1 gap-1 text-xs text-gray-400">
                    <Clock size={12} className="mr-1" />
                    <span>{new Date(profile.registration_date).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Action buttons for pending status */}
            {profile.status === 'pending' && (
              <div className="absolute top-14 right-4 flex flex-col gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusUpdate(profile.id, 'accepted');
                  }}
                  className="p-2 rounded-full bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/30 
                    transition-colors shadow-lg border border-emerald-500/20"
                  aria-label="Accept"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusUpdate(profile.id, 'rejected');
                  }}
                  className="p-2 rounded-full bg-rose-500/10 text-rose-400 hover:bg-rose-500/30 
                    transition-colors shadow-lg border border-rose-500/20"
                  aria-label="Reject"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // List View Redesign
    return (
      <div 
        className={`group relative rounded-xl ${borderColor} border bg-gray-900/40 backdrop-blur-sm 
          hover:bg-gray-800/60 transition-all duration-300 cursor-pointer overflow-hidden`}
        onClick={() => onClick && onClick(profile)}
      >
        {/* Status indicator line */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${bgColor.replace('/10', '/50')}`}></div>
        
        <div className="flex items-center gap-4 p-4 pl-6">
          {/* Avatar section */}
          <div className="relative flex-shrink-0">
            <div className={`w-14 h-14 rounded-xl overflow-hidden ring-1 ${borderColor} bg-gray-800/80`}>
              <img 
                src={getImageUrl()} 
                alt={profile.team_id ? profile.team_name : profile.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${bgColor} 
              border-2 border-gray-900`}></div>
          </div>
          
          {/* Content section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white tracking-wide truncate group-hover:text-white transition-colors">
                {profile.team_id ? profile.team_name : profile.name}
              </h3>
              
              <div className={`px-2.5 py-1 rounded-full ${bgColor} ${textColor} flex items-center gap-1.5 text-xs font-medium`}>
                <StatusIcon size={12} />
                <span>{profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}</span>
              </div>
            </div>
            
            {profile.team_id ? (
              <div className="mt-1">
                <p className="text-sm text-gray-300">Captain: {profile.owner_name}</p>
                <div className="flex items-center mt-1 gap-4 text-xs">
                  <div className="flex items-center text-blue-400">
                    <Users size={12} className="mr-1" />
                    <span>{profile.member_count} members</span>
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock size={12} className="mr-1" />
                    <span>{new Date(profile.registration_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-1">
                <p className="text-sm text-gray-300 truncate">{profile.email}</p>
                <div className="flex items-center mt-1 text-xs text-gray-400">
                  <Clock size={12} className="mr-1" />
                  <span>{new Date(profile.registration_date).toLocaleDateString()}</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Action buttons for pending status */}
          {profile.status === 'pending' && (
            <div className="flex-shrink-0 flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate(profile.id, 'accepted');
                }}
                className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 
                  transition-colors border border-emerald-500/20"
                aria-label="Accept"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate(profile.id, 'rejected');
                }}
                className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 
                  transition-colors border border-rose-500/20"
                aria-label="Reject"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  const ProfileModal = () => {
    if (!selectedProfile) return null;
    
    // Determine if this is a team or individual profile
    const isTeam = Boolean(selectedProfile.team_id);
  
    // Color scheme configuration
    const colors = {
      background: {
        primary: 'bg-[#0F1623]', // Main modal background
        overlay: 'bg-gray-800/10', // Card backgrounds
        backdrop: 'backdrop-blur-md', // Blur effect
      },
      status: {
        pending: {
          bg: 'bg-amber-500/10',
          text: 'text-amber-400',
          hover: 'hover:bg-amber-500/20',
        },
        accepted: {
          bg: 'bg-green-500/10',
          text: 'text-green-400',
          hover: 'hover:bg-green-500/20',
        },
        rejected: {
          bg: 'bg-red-500/10',
          text: 'text-red-400',
          hover: 'hover:bg-red-500/20',
        },
        warning: {
          bg: 'bg-yellow-500/20',
          text: 'text-yellow-400',
        },
        online: 'bg-green-500',
        offline: 'bg-gray-500',
      },
      text: {
        primary: 'text-white',
        secondary: 'text-gray-400',
        accent: 'text-purple-400',
      },
      border: {
        ring: 'ring-2 ring-gray-700/50',
        divider: 'border-2 border-gray-900',
      },
    };
  
    // Generate stats based on profile type
    const getStats = () => {
      if (isTeam) {
        return [
          {
            icon: Trophy,
            label: 'MMR',
            value: selectedProfile.mmr || '0',
            color: colors.status.warning.text,
          },
          {
            icon: PercentCircle,
            label: 'Win Rate',
            value: `${selectedProfile.win_rate || 0}%`,
            color: colors.status.accepted.text,
          },
          {
            icon: Users,
            label: 'Team Size',
            value: selectedProfile.total_members || selectedProfile.member_count || 0,
            color: 'text-blue-400',
          },
        ];
      } else {
        // For individual participants
        return [
          {
            icon: Shield,
            label: 'Verified',
            value: selectedProfile.is_verified ? 'Yes' : 'No',
            color: selectedProfile.is_verified ? 'text-green-400' : 'text-red-400',
          },
          {
            icon: Star,
            label: 'Points',
            value: selectedProfile.points || '0',
            color: colors.status.warning.text,
          },
          {
            icon: Clock,
            label: 'Registered',
            value: new Date(selectedProfile.registration_date).toLocaleDateString(),
            color: colors.text.secondary,
          },
        ];
      }
    };
  
    // Get the status config based on profile status
    const statusConfig = colors.status[selectedProfile.status || 'pending'];
  
    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop with blur */}
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProfile(null)} />
  
        {/* Modal content wrapper */}
        <div className="relative h-full overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen w-full py-8">
            <div className={`mx-auto w-full max-w-5xl bg-secondary  angular-cut overflow-hidden angular-cut`}>
              {/* Status indicator border */}
              <div className={`h-1 w-full ${statusConfig.bg.replace('/10', '/30')}`}></div>
              
              {/* Header Section */}
              <div className="flex items-start gap-6 p-8">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-24 h-24 rounded-xl overflow-hidden ${colors.border.ring}`}>
                    <img
                      src={
                        isTeam
                          ? selectedProfile.team_image
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedProfile.team_image}`
                            : DEFAULT_IMAGES.team
                          : selectedProfile.avatar
                            ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${selectedProfile.avatar}`
                            : DEFAULT_IMAGES.participant
                      }
                      alt={isTeam ? selectedProfile.team_name : selectedProfile.name}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full ${statusConfig.bg} border-2 border-gray-900`}></div>
                  </div>
                </div>
  
                {/* Profile Info */}
                <div className="relative flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className={`text-3xl font-valorant ${colors.text.primary}`}>
                          {isTeam ? selectedProfile.team_name : selectedProfile.name}
                        </h1>
                        <div className={`px-3 py-1 rounded-full ${statusConfig.bg} ${statusConfig.text} text-xs font-medium`}>
                          {selectedProfile.status.charAt(0).toUpperCase() + selectedProfile.status.slice(1)}
                        </div>
                      </div>
                      
                      <p className="text-gray-400 mb-4">
                        {isTeam 
                          ? `Team Division: ${selectedProfile.division || 'Unranked'}`
                          : selectedProfile.email}
                      </p>
                      
                      {selectedProfile.status === 'pending' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleStatusUpdate(selectedProfile.id, 'accepted')}
                            className={`flex items-center gap-2 px-6 py-2 tracking-wider font-custom ${colors.status.accepted.bg} ${colors.status.accepted.hover} ${colors.status.accepted.text} rounded-lg transition-all`}
                          >
                            <Check className="w-5 h-5" />
                            <span>Accept {isTeam ? 'Team' : 'Participant'}</span>
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedProfile.id, 'rejected')}
                            className={`flex items-center gap-2 px-6 py-2 tracking-wider font-custom ${colors.status.rejected.bg} ${colors.status.rejected.hover} ${colors.status.rejected.text} rounded-lg transition-all`}
                          >
                            <X className="w-5 h-5" />
                            <span>Reject {isTeam ? 'Team' : 'Participant'}</span>
                          </button>
                        </div>
                      )}
                    </div>
  
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedProfile(null)}
                      className={`p-2 hover:bg-gray-800/50 rounded-lg transition-colors ${colors.text.secondary}`}
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
  
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
                {getStats().map((stat, index) => (
                  <div
                    key={index}
                    className={`flex flex-col items-center p-6 ${colors.background.overlay} rounded-xl angular-cut backdrop-blur-sm`}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                    <span
                      className={`text-2xl font-custom tracking-wider ${colors.text.primary} mb-1`}
                    >
                      {stat.value}
                    </span>
                    <span className={`font-medium ${colors.text.secondary}`}>
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
              
              
              {/* Registration Date & Game Info (For both types) */}
              <div className="px-8 mt-6">
                
                {isTeam && (
                  <div className="flex items-center gap-2 mt-2">
                    <Gamepad2 className="w-4 h-4 text-blue-400" />
                    <span className="text-gray-400">
                      Game: {selectedProfile.team_game || 'Not specified'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Description Section (for teams) */}
              {isTeam && selectedProfile.description && (
                <div className="mt-8 mx-8 p-6 bg-gray-900/50 rounded-xl backdrop-blur-sm">
                  <h3 className="text-xl tracking-wider font-custom text-white mb-2">
                    About Team
                  </h3>
                  <p className="text-gray-400">{selectedProfile.description}</p>
                </div>
              )}
              
              {/* Team Members Section */}
              {isTeam && selectedProfile.members && (
                <div className="space-y-4 px-8 py-8">
                  <div className="flex items-center justify-between">
                    <h2 className={`text-xl tracking-wider font-custom ${colors.text.primary}`}>
                      Team Members
                    </h2>
                    <div className={`px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 flex items-center gap-1.5 text-xs font-medium`}>
                      <Users size={12} />
                      <span>{selectedProfile.members?.length || 0} members</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProfile.members?.map((member, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-4 p-4 ${colors.background.overlay} rounded-xl`}
                      >
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-lg overflow-hidden ${colors.border.ring}`}>
                            <img
                              src={
                                member.avatar_url
                                  ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${member.avatar_url}`
                                  : `/api/placeholder/48/48`
                              }
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {member.name === selectedProfile.owner_name && (
                            <Crown
                              className={`absolute -top-2 -right-2 w-5 h-5 ${colors.status.warning.text}`}
                            />
                          )}
                        </div>
  
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${colors.text.primary}`}>
                              {member.name}
                            </span>
                            {member.name === selectedProfile.owner_name && (
                              <span
                                className={`px-2 py-0.5 text-xs ${colors.status.warning.bg} ${colors.status.warning.text} rounded`}
                              >
                                Captain
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-3">
                              <span className={`text-sm ${colors.text.secondary}`}>
                                {member.role || 'Mid'}
                              </span>
                              <span className={`text-sm ${colors.text.accent}`}>
                                {member.rank || 'Unranked'}
                              </span>
                            </div>
                            
                            <div className={`w-2 h-2 rounded-full ${member.is_active ? 'bg-green-500' : 'bg-gray-500'}`}
                              title={member.is_active ? 'Active' : 'Inactive'}>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional Info for Individual Participants */}
              {!isTeam && (
                <div className="px-8 pb-8 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   
                    
                    <div className="bg-secondary/30 rounded-xl p-5">
                      <h3 className="text-lg font-medium text-white mb-3">Bio</h3>
                      <p className="text-gray-400">
                        {selectedProfile.bio || 'No bio provided.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <TransparentLoader messages={['Loading Users...']} />;
  }

  return (
    <div className="space-y-6">
      <Header />
      <StatsGrid />

      <SearchAndFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        viewMode={viewMode}
        setViewMode={setViewMode}
        profiles={profiles}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
      />
      <div
        className={`grid gap-4 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}
      >
        {filteredProfiles.map((profile) => (
          <ProfileCard 
            key={profile.id} 
            profile={profile} 
            viewType={viewMode}
            onStatusUpdate={handleStatusUpdate}
            onClick={() => setSelectedProfile(profile)}
          />
        ))}
      </div>

      {showRefused && (
        <RefusedParticipants
          profiles={refusedProfiles}
          onReview={handleReviewAgain}
          onViewDetails={setSelectedProfile}
        />
      )}

      <ProfileModal />

      {/* Notification remains the same */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`rounded-lg shadow-lg p-4 flex items-center space-x-3 
            ${
              notification.type === 'success'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
            <p>{notification.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;