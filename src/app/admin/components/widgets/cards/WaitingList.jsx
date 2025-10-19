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
import { 
  sendAcceptanceNotification, 
  sendRejectionNotification 
} from '@/utils/adminNotifications';
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
  <div className="mt-8 relative">
    {/* Tech panel style container */}
    <div className="ml-6 bg-black/60 border-l-4 border-red-500 p-6 md:p-8 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}></div>
      
      {/* Header */}
      <div className="relative z-10 flex items-center gap-4 mb-8 pb-4 border-b-2 border-red-500/30">
        <div className="w-12 h-12 bg-red-500 flex items-center justify-center transform -skew-x-12">
          <Ban className="w-6 h-6 text-black transform skew-x-12" />
        </div>
        <div>
          <h3 className="text-2xl md:text-3xl font-zentry text-white uppercase tracking-wider">
            Refused Participants
          </h3>
          <div className="h-0.5 w-20 bg-red-500 mt-2"></div>
          <p className="text-sm text-gray-400 mt-2">{profiles.length} participants refused</p>
        </div>
      </div>

      {/* Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className="relative bg-black/40 overflow-hidden group"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
          >
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(239,68,68,0.02)_2px,rgba(239,68,68,0.02)_4px)] opacity-50"></div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center p-4 gap-4">
              <div className="relative">
                <img
                  src={profile.avatar || '/api/placeholder/64/64'}
                  alt={profile.name}
                  className="w-16 h-16 rounded-lg object-cover grayscale"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-gray-800" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-white font-zentry truncate">{profile.name}</h4>
                <p className="text-sm text-gray-400 truncate">{profile.email}</p>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>Refused on {new Date(profile.registration_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="relative z-10 px-4 pb-4 flex gap-2">
              <button
                onClick={() => onReview(profile.id)}
                className="flex-1 py-2 bg-yellow-500/10 text-yellow-400 
                         hover:bg-yellow-500/20 transition-colors text-sm font-medium
                         transform -skew-x-6"
              >
                <span className="transform skew-x-6 inline-block">Review Again</span>
              </button>
              <button
                onClick={() => onViewDetails(profile)}
                className="px-3 py-2 bg-gray-700/50 text-gray-300
                         hover:bg-gray-700 transition-colors"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom accent line */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
  const [tournamentName, setTournamentName] = useState('');

  const handleSearch = useCallback((term) => {
    setSearchTerm(term);
  }, []);
  
  const handleReviewAgain = async (profileId) => {
    await handleStatusUpdate(profileId, 'pending');
    setShowRefused(false);
  };
  useEffect(() => {
  const fetchTournamentName = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournament_details.php?tournament_id=${tournamentId}`
      );
      const data = await response.json();
      if (data.success && data.tournament) {
        setTournamentName(data.tournament.name);
      }
    } catch (error) {
      console.error('Error fetching tournament name:', error);
      // Fallback to a generic name
      setTournamentName('the tournament');
    }
  };
  
  if (tournamentId) {
    fetchTournamentName();
  }
}, [tournamentId]);
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
    // Get admin ID from localStorage
    const adminId = localStorage.getItem('adminId');
    
    if (!adminId) {
      showNotification('Admin not authenticated', 'error');
      return;
    }

    // Find the profile being updated
    const profile = profiles.find(p => p.id === profileId);
    
    if (!profile) {
      showNotification('Profile not found', 'error');
      return;
    }

    console.log('Updating registration status:', {
      profileId,
      newStatus,
      profileName: profile.team_id ? profile.team_name : profile.name,
      userId: profile.team_id ? profile.owner_id : profile.user_id
    });

    // Update registration status in database
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_registration_status.php`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registration_id: profileId,
          status: newStatus,
          admin_id: adminId,
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);

    // Update local state
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === profileId ? { ...p, status: newStatus } : p,
      ),
    );

    // Send notification to user
    let notificationSent = false;
    
    if (newStatus === 'accepted') {
      console.log('Sending acceptance notification...');
      notificationSent = await sendAcceptanceNotification(
        profile, 
        parseInt(adminId), 
        tournamentName || 'the tournament'
      );
    } else if (newStatus === 'rejected') {
      console.log('Sending rejection notification...');
      notificationSent = await sendRejectionNotification(
        profile, 
        parseInt(adminId), 
        tournamentName || 'the tournament'
      );
    }

    // Show success message
    const successMessage = notificationSent 
      ? `Successfully ${newStatus} participant and sent notification`
      : `Successfully ${newStatus} participant (notification may have failed)`;
    
    showNotification(successMessage);
    setSelectedProfile(null);
    
    // Log the complete action
    console.log('✅ Status update complete:', {
      profileId,
      newStatus,
      notificationSent,
      userName: profile.team_id ? profile.team_name : profile.name
    });
    
  } catch (error) {
    console.error('❌ Error updating status:', error);
    showNotification(error.message, 'error');
  }
};

  const { activeProfiles, refusedProfiles, filteredProfiles } = useMemo(() => {
    let filtered = [...profiles];

    if (filterStatus !== 'all') {
      filtered = filtered.filter((profile) => profile.status === filterStatus);
    }

    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((profile) => {
        if (profile.team_id) {
          return (
            (profile.team_name || '').toLowerCase().includes(term) ||
            (profile.owner_name || '').toLowerCase().includes(term) ||
            (profile.description || '').toLowerCase().includes(term)
          );
        } else {
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
  
  // Header Component
  const Header = () => (
    <div className="mb-8">
      <h1 className="text-4xl flex items-center font-zentry tracking-wider uppercase text-white">
        Registration Management
      </h1>
      <div className="flex items-center text-primary mt-2">
        <TbTournament className="w-5 h-5" />
        <p className="mx-2 text-sm">Manage and review tournament registrations</p>
      </div>
    </div>
  );

  // Stats Grid Component with Tech Styling
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
          className={`group relative ${stat.onClick ? 'cursor-pointer' : ''}`}
        >
          {/* Decorative corner accents */}
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"></div>
          
          {/* Main card */}
          <div className="relative bg-black/40 transition-all duration-300 overflow-hidden">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50"></div>
            
            {/* Content */}
            <div className="relative z-10 p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs md:text-sm text-white/40 uppercase tracking-widest font-bold">{stat.title}</p>
                  <h3 className="text-2xl md:text-3xl font-zentry tracking-wide text-white group-hover:text-primary transition-colors duration-300 mt-2">
                    {stat.value}
                  </h3>
                </div>
                
                {/* Icon container with skew */}
                <div className="flex items-center justify-center w-12 h-12 transform -skew-x-6 group-hover:bg-primary/20 transition-all duration-300">
                  <div className="text-primary group-hover:text-white transition-colors duration-300 transform skew-x-6">
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
              
              {/* Accent bar */}
              <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-primary/50 group-hover:h-6 transition-all duration-300"></div>
              </div>
            </div>
            
            {/* Bottom accent line */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const ProfileCard = ({ profile, viewType = 'grid', onStatusUpdate, onClick }) => {
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
  
    const defaultProfileSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="profileGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E293B" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#profileGrad)"/>
      <path d="M0 0 L400 400 M400 0 L0 400" stroke="#334155" stroke-width="1" opacity="0.3"/>
      <circle cx="200" cy="150" r="70" fill="#475569"/>
      <path d="M200 230 C120 230 60 280 60 370 L340 370 C340 280 280 230 200 230" fill="#475569"/>
    </svg>`)}`;
  
    const defaultTeamSvg = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="teamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1E293B" />
          <stop offset="100%" stop-color="#0F172A" />
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="url(#teamGrad)"/>
      <path d="M0 0 L400 400 M400 0 L0 400" stroke="#334155" stroke-width="1" opacity="0.3"/>
      <circle cx="150" cy="150" r="40" fill="#475569"/>
      <path d="M150 200 C110 200 80 220 80 280 L220 280 C220 220 190 200 150 200" fill="#475569"/>
      <circle cx="250" cy="150" r="40" fill="#475569"/>
      <path d="M250 200 C210 200 180 220 180 280 L320 280 C320 220 290 200 250 200" fill="#475569"/>
      <circle cx="200" cy="220" r="40" fill="#475569"/>
      <path d="M200 270 C160 270 130 290 130 350 L270 350 C270 290 240 270 200 270" fill="#475569"/>
    </svg>`)}`;
  
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
  
    // Grid View with Tech Styling
    if (viewType === 'grid') {
      return (
        <div 
          className="relative overflow-hidden backdrop-blur-sm bg-black/40 
            hover:bg-gray-800/60 transition-all duration-300 transform hover:-translate-y-1 
            cursor-pointer group"
          onClick={() => onClick && onClick(profile)}
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)' }}
        >
          {/* Scanline effect */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50"></div>
          
          {/* Top accent line */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Content container */}
          <div className="relative h-full z-10 p-5 flex flex-col">
            {/* Top section with status and type */}
            <div className="flex justify-between items-start mb-3">
              <div className={`px-3 py-1.5 transform -skew-x-6 ${bgColor} flex items-center gap-1.5`}>
                <span className={`${textColor} transform skew-x-6 text-xs font-medium uppercase tracking-wider flex items-center gap-1`}>
                  <StatusIcon size={12} />
                  {profile.status}
                </span>
              </div>
              
              {profile.team_id ? (
                <div className="bg-blue-500/20 px-2 py-1 flex items-center gap-1.5 transform -skew-x-6">
                  <Users size={12} className="text-blue-400 transform skew-x-6" />
                  <span className="text-xs font-medium text-blue-300 transform skew-x-6">Team</span>
                </div>
              ) : (
                <div className="bg-purple-500/20 px-2 py-1 flex items-center gap-1.5 transform -skew-x-6">
                  <User size={12} className="text-purple-400 transform skew-x-6" />
                  <span className="text-xs font-medium text-purple-300 transform skew-x-6">Individual</span>
                </div>
              )}
            </div>
            
            {/* Avatar/Image section */}
            <div className="flex-grow flex flex-col items-center justify-center py-2">
              <div className="relative">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-800/80 backdrop-blur-md shadow-lg border-2 border-primary/30">
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
              <h3 className="text-lg font-zentry text-white tracking-wide truncate">
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
                  className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/30 
                    transition-colors shadow-lg border border-emerald-500/20 transform -skew-x-6"
                  aria-label="Accept"
                >
                  <Check className="w-4 h-4 transform skew-x-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onStatusUpdate(profile.id, 'rejected');
                  }}
                  className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/30 
                    transition-colors shadow-lg border border-rose-500/20 transform -skew-x-6"
                  aria-label="Reject"
                >
                  <X className="w-4 h-4 transform skew-x-6" />
                </button>
              </div>
            )}
          </div>
          
          {/* Bottom accent line */}
          <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      );
    }
    
    // List View with Tech Styling
    return (
      <div 
        className="group relative bg-black/40 backdrop-blur-sm 
          hover:bg-gray-800/60 transition-all duration-300 cursor-pointer overflow-hidden border-l-2 border-primary/30"
        onClick={() => onClick && onClick(profile)}
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50"></div>
        
        <div className="relative z-10 flex items-center gap-4 p-4 pl-6">
          {/* Avatar section */}
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 overflow-hidden bg-gray-800/80 border-2 border-primary/30">
              <img 
                src={getImageUrl()} 
                alt={profile.team_id ? profile.team_name : profile.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Content section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-zentry text-white tracking-wide truncate group-hover:text-primary transition-colors">
                {profile.team_id ? profile.team_name : profile.name}
              </h3>
              
              <div className={`px-2.5 py-1 ${bgColor} ${textColor} flex items-center gap-1.5 text-xs font-medium transform -skew-x-6`}>
                <StatusIcon size={12} className="transform skew-x-6" />
                <span className="transform skew-x-6 uppercase tracking-wider">{profile.status}</span>
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
                className="p-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 
                  transition-colors border border-emerald-500/20 transform -skew-x-6"
                aria-label="Accept"
              >
                <Check className="w-4 h-4 transform skew-x-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate(profile.id, 'rejected');
                }}
                className="p-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 
                  transition-colors border border-rose-500/20 transform -skew-x-6"
                aria-label="Reject"
              >
                <X className="w-4 h-4 transform skew-x-6" />
              </button>
            </div>
          )}
        </div>
        
        {/* Bottom accent line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    );
  };
  
  const ProfileModal = () => {
    if (!selectedProfile) return null;
    
    const isTeam = Boolean(selectedProfile.team_id);
  
    const colors = {
      background: {
        primary: 'bg-[#0F1623]',
        overlay: 'bg-gray-800/10',
        backdrop: 'backdrop-blur-md',
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
  
    const statusConfig = colors.status[selectedProfile.status || 'pending'];
  
    return (
      <div className="fixed inset-0 z-50">
        {/* Backdrop with blur */}
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProfile(null)} />
  
        {/* Modal content wrapper */}
        <div className="relative h-full overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen w-full py-8">
            <div className="mx-auto w-full max-w-5xl bg-secondary overflow-hidden relative">
              {/* Tech panel styling */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'linear-gradient(rgba(255,61,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,61,8,0.3) 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}></div>
              
              {/* Status indicator border */}
              <div className={`h-1 w-full ${statusConfig.bg.replace('/10', '/30')}`}></div>
              
              {/* Header Section */}
              <div className="relative z-10 flex items-start gap-6 p-8">
                {/* Avatar with tech frame */}
                <div className="relative flex-shrink-0">
                  <div className="w-24 h-24 overflow-hidden border-2 border-primary/30 bg-gray-800/80">
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
                  </div>
                  {/* Corner accents */}
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary"></div>
                </div>
  
                {/* Profile Info */}
                <div className="relative flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-zentry text-white uppercase tracking-wider">
                          {isTeam ? selectedProfile.team_name : selectedProfile.name}
                        </h1>
                        <div className={`px-3 py-1 transform -skew-x-6 ${statusConfig.bg} ${statusConfig.text} text-xs font-medium`}>
                          <span className="transform skew-x-6 inline-block uppercase tracking-wider">
                            {selectedProfile.status}
                          </span>
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
                            className="flex items-center gap-2 px-6 py-2 tracking-wider font-ea-football bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 transition-all transform -skew-x-6"
                          >
                            <Check className="w-5 h-5 transform skew-x-6" />
                            <span className="transform skew-x-6 uppercase">Accept {isTeam ? 'Team' : 'Participant'}</span>
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(selectedProfile.id, 'rejected')}
                            className="flex items-center gap-2 px-6 py-2 tracking-wider font-ea-football bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all transform -skew-x-6"
                          >
                            <X className="w-5 h-5 transform skew-x-6" />
                            <span className="transform skew-x-6 uppercase">Reject {isTeam ? 'Team' : 'Participant'}</span>
                          </button>
                        </div>
                      )}
                    </div>
  
                    {/* Close Button */}
                    <button
                      onClick={() => setSelectedProfile(null)}
                      className="p-2 hover:bg-gray-800/50 transition-colors text-gray-400"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
  
              {/* Stats Grid with Tech Styling */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 px-8">
                {getStats().map((stat, index) => (
                  <div
                    key={index}
                    className="group relative"
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative bg-black/40 p-6 transition-all duration-300 overflow-hidden">
                      {/* Scanline effect */}
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50"></div>
                      
                      <div className="relative z-10 flex flex-col items-center">
                        <stat.icon className={`w-8 h-8 ${stat.color} mb-3`} />
                        <span className="text-2xl font-zentry tracking-wider text-white mb-1">
                          {stat.value}
                        </span>
                        <span className="font-medium text-gray-400 uppercase text-xs tracking-widest">
                          {stat.label}
                        </span>
                      </div>
                      
                      {/* Bottom accent line */}
                      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Registration Date & Game Info */}
              <div className="relative z-10 px-8 mt-6">
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
                <div className="relative z-10 mt-8 mx-8">
                  <div className="ml-6 bg-black/60 border-l-4 border-primary p-6 relative overflow-hidden">
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-5" style={{
                      backgroundImage: 'linear-gradient(rgba(255,61,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,61,8,0.3) 1px, transparent 1px)',
                      backgroundSize: '20px 20px'
                    }}></div>
                    
                    <div className="relative z-10">
                      <h3 className="text-xl tracking-wider font-zentry text-white mb-2 uppercase">
                        About Team
                      </h3>
                      <div className="h-0.5 w-20 bg-primary mb-4"></div>
                      <p className="text-gray-400">{selectedProfile.description}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Team Members Section */}
              {isTeam && selectedProfile.members && (
                <div className="relative z-10 space-y-4 px-8 py-8">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl tracking-wider font-zentry text-white uppercase">
                      Team Members
                    </h2>
                    <div className="px-3 py-1 bg-blue-500/10 text-blue-400 flex items-center gap-1.5 text-xs font-medium transform -skew-x-6">
                      <Users size={12} className="transform skew-x-6" />
                      <span className="transform skew-x-6">{selectedProfile.members?.length || 0} members</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProfile.members?.map((member, index) => (
                      <div
                        key={index}
                        className="group relative"
                      >
                        <div className="relative bg-black/40 p-4 transition-all duration-300 overflow-hidden"
                          style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
                        >
                          {/* Scanline effect */}
                          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50"></div>
                          
                          <div className="relative z-10 flex items-center gap-4">
                            <div className="relative">
                              <div className="w-12 h-12 overflow-hidden border-2 border-primary/30">
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
                                <Crown className="absolute -top-2 -right-2 w-5 h-5 text-yellow-400" />
                              )}
                            </div>
  
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-white">
                                  {member.name}
                                </span>
                                {member.name === selectedProfile.owner_name && (
                                  <span className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-400 transform -skew-x-6">
                                    <span className="transform skew-x-6 inline-block uppercase tracking-wider">Captain</span>
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm text-gray-400">
                                    {member.role || 'Mid'}
                                  </span>
                                  <span className="text-sm text-purple-400">
                                    {member.rank || 'Unranked'}
                                  </span>
                                </div>
                                
                                <div className={`w-2 h-2 rounded-full ${member.is_active ? 'bg-green-500' : 'bg-gray-500'}`}
                                  title={member.is_active ? 'Active' : 'Inactive'}>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Bottom accent line */}
                          <div className="h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Additional Info for Individual Participants */}
              {!isTeam && (
                <div className="relative z-10 px-8 pb-8 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative bg-black/40 p-5 overflow-hidden">
                      {/* Scanline effect */}
                      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50"></div>
                      
                      <div className="relative z-10">
                        <h3 className="text-lg font-medium text-white mb-3 uppercase tracking-wider">Bio</h3>
                        <div className="h-0.5 w-16 bg-primary mb-3"></div>
                        <p className="text-gray-400">
                          {selectedProfile.bio || 'No bio provided.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Bottom accent bar */}
              <div className="h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
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

      {/* Notification with Tech Styling */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`relative overflow-hidden p-4 flex items-center space-x-3 
            ${
              notification.type === 'success'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}
          >
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,61,8,0.02)_2px,rgba(255,61,8,0.02)_4px)] opacity-50"></div>
            
            <div className="relative z-10 flex items-center gap-3">
              {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
              <p className="font-medium">{notification.message}</p>
            </div>
            
            {/* Accent line */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
              notification.type === 'success' 
                ? 'bg-green-500' 
                : 'bg-red-500'
            }`}></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;