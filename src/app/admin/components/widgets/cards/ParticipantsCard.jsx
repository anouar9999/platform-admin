/* eslint-disable @next/next/no-img-element */
'use client';

import { Check, X, Clock, CheckCircle2, Ban, Mail, Users, Star, User } from 'lucide-react';

// Constants
const VIEW_CLASSES = {
  list: 'group flex items-center gap-6 w-full angular-cut bg-gray-800/80 backdrop-blur-sm p-1.5 hover:bg-gray-700/80 transition-all duration-300  shadow-lg hover:shadow-xl',
  grid: 'group relative h-36	 rounded   overflow-hidden cursor-pointer transform transition-all duration-300  shadow-lg hover:shadow-xl',
};

const STATUS_CONFIG = {
  pending: {
    color: 'yellow',
    icon: Clock,
    actions: ['accept', 'reject'],
  },
  accepted: {
    color: 'green',
    icon: CheckCircle2,
    actions: [],
  },
  rejected: {
    color: 'red',
    icon: Ban,
    actions: ['review'],
  },
};

// Default SVG Images
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

// Components
const ActionButton = ({ onClick, color, Icon, label, className = '' }) => (
  <button
    onClick={onClick}
    className={`p-2 rounded-lg bg-${color}-500/20 text-${color}-400 hover:bg-${color}-500/30 backdrop-blur-sm shadow-[0_2px_10px_-3px_rgba(0,0,0,0.3)] ${className}`}
  >
    {Icon ? <Icon className="w-4 h-4" /> : label}
  </button>
);

const ActionButtons = ({ status, onStatusUpdate, id, className = '' }) => (
  <div className={`flex gap-2 ${className}`}>
    {status === 'pending' && (
      <>
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onStatusUpdate(id, 'accepted');
          }}
          color="green"
          Icon={Check}
        />
        <ActionButton
          onClick={(e) => {
            e.stopPropagation();
            onStatusUpdate(id, 'rejected');
          }}
          color="red"
          Icon={X}
        />
      </>
    )}
    {status === 'rejected' && (
      <ActionButton
        onClick={(e) => {
          e.stopPropagation();
          onStatusUpdate(id, 'pending');
        }}
        color="yellow"
        label="Review"
      />
    )}
  </div>
);

const Badge = ({ children, color = 'gray', className = '' }) => (
  <div
    className={`px-2 py-1 text-xs font-medium rounded-full backdrop-blur-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.3)] 
    ${color === 'blue' ? 'bg-blue-500/20 text-blue-400' : ''} 
    ${color === 'gray' ? 'bg-gray-900/50 text-gray-300' : ''}
    ${className}`}
  >
    {children}
  </div>
);

const StatusBadge = ({ status }) => (
  <span
    className={`px-2 py-1 text-xs z-40 font-medium capitalize bg-${STATUS_CONFIG[status].color}-500/20 text-${STATUS_CONFIG[status].color}-400 rounded-full backdrop-blur-sm shadow-[0_2px_8px_-3px_rgba(0,0,0,0.3)]`}
  >
    {status}
  </span>
);

const VerificationBadge = ({ className = '' }) => (
  <div
    className={`flex items-center gap-1 bg-gray-900/50 backdrop-blur-sm rounded-full px-2 py-1 shadow-[0_2px_8px_-3px_rgba(59,130,246,0.3)] ${className}`}
  >
    <CheckCircle2 className="w-4 h-4 text-blue-500" />
  </div>
);

const TeamBadge = ({ className = '' }) => (
  <Badge color="blue" className={className}>
    <div className="flex items-center space-x-2">
      <Users size={14} className="text-blue-400" />
      <span>Team</span>
    </div>
  </Badge>
);

const ProfileInfo = ({ profile, viewType }) => {
  const isTeam = profile.team_id != undefined;
  console.log(isTeam);

  if (viewType === 'list') {
    return (
      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
        {!isTeam && (
          <div className="flex items-center gap-2 text-gray-400">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{profile.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-gray-400">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm">
            Joined {new Date(profile.decision_date).toLocaleDateString()}
          </span>
        </div>
      </div>
    );
  }

  return isTeam ? (
    <>
      <p className="text-sm text-gray-300 mb-1">
        Joined: {new Date(profile.decision_date).toLocaleDateString()}
      </p>
      <p className="text-sm text-blue-400 mb-3">{profile.division}</p>
    </>
  ) : (
    <div className="grid grid-cols-1 gap-2 text-xs text-gray-300">
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4" />
        <span className="truncate">{profile.email}</span>
      </div>
      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4" />
        <span>Joined {new Date(profile.decision_date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};

const ProfileCard = ({ profile, viewType = 'grid', onStatusUpdate, setSelectedProfile }) => {
  // Status configuration with color schemes and icons
  const statusConfig = {
    pending: {
      color: 'amber',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      ringColor: 'ring-amber-500/20',
      hoverBg: 'hover:bg-amber-500/20',
      textColor: 'text-amber-400',
      icon: Clock,
    },
    accepted: {
      color: 'emerald',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      ringColor: 'ring-emerald-500/20',
      hoverBg: 'hover:bg-emerald-500/20',
      textColor: 'text-emerald-400',
      icon: CheckCircle2,
    },
    rejected: {
      color: 'rose',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      ringColor: 'ring-rose-500/20',
      hoverBg: 'hover:bg-rose-500/20',
      textColor: 'text-rose-400',
      icon: Ban,
    },
  };

  const config = statusConfig[profile.status] || statusConfig.pending;
  const StatusIcon = config.icon;

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
      return profile.team_avatar && profile.team_avatar !== ''
        ? `${baseUrl}${profile.team_avatar}`
        : defaultTeamSvg;
    } else {
      return profile.avatar && profile.avatar !== ''
        ? `${baseUrl}${profile.avatar}`
        : defaultProfileSvg;
    }
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    if (typeof setSelectedProfile === 'function') {
      setSelectedProfile(profile);
    }
  };

  // Status badge component
  const StatusBadge = ({ className = '' }) => (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-  angular-cut ${config.bgColor} ${config.textColor}   text-xs font-medium whitespace-nowrap shadow-sm ${className}`}
    >
      <StatusIcon className="w-3 h-3" />
      <span className="capitalize">{profile.status}</span>
    </div>
  );

  // Grid View Implementation
  const renderGridView = () => (
    <div
      className={`relative overflow-hidden angular-cut backdrop-blur-sm bg-secondary
        hover:bg-secondary/60 transition-all duration-300 transform hover:-translate-y-1 
        hover:shadow-lg hover:shadow-${config.color}-500/10 cursor-pointer h-52`}
      onClick={handleProfileClick}
    >
      {/* Background gradient overlay based on status */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-gray-900/30 via-gray-900/40 to-${config.color}-900/10 opacity-60`}
      ></div>

      {/* Decorative elements */}
      <div
        className={`absolute -bottom-16 -right-16 w-32 h-32 rounded-full bg-${config.color}-600/5 blur-xl`}
      ></div>
      <div className={`absolute top-0 left-0 w-full h-1 bg-${config.color}-500/30`}></div>

      {/* Content container */}
      <div className="relative h-full z-10 p-5 flex flex-col">
        {/* Avatar/Image section */}
        <div className="flex-grow flex flex-col items-center justify-center py-2">
          <div className="relative">
            <div
              className={`w-20 h-20 rounded-full overflow-hidden  
              bg-gray-800/80 backdrop-blur-md shadow-lg`}
            >
              <img
                src={getImageUrl()}
                alt={profile.team_id ? profile.team_name : profile.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Name and details section */}
        <div className="mt-2 text-center">
          <h3 className="text-lg font-custom tracking-widest text-white truncate">
            {profile.team_id ? profile.team_name : profile.username}
          </h3>

          {profile.team_id ? (
            <div className="mt-1">
              <div className="flex items-center justify-center mt-1 gap-3">
                <div className="flex items-center justify-between px-2 py-0.5 rounded-md bg-gray-800/70  text-xs font-mono text-gray-300">
                  {/* <Clock size={12} className="mr-1.5 text-gray-400" /> */}
                  <span className="pr-2">Registration Date</span>
                  <span>{new Date(profile.registration_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-1">
              <p className="text-sm text-gray-300 font-mono truncate">{profile.email}</p>
              <div className="flex items-center justify-center mt-1 gap-3 text-xs">
                <div className="flex items-center justify-between px-2 py-0.5 rounded-md bg-gray-800/70  text-xs font-mono text-gray-300">
                  {/* <Clock size={12} className="mr-1.5 text-gray-400" /> */}
                  <span className="pr-2">Registration Date</span>
                  <span>{new Date(profile.registration_date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons for pending status */}
        {profile.status === 'pending' && typeof onStatusUpdate === 'function' && (
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

  // List View Implementation
  const renderListView = () => (
    <div
      className={`group relative angular-cut backdrop-blur-sm 
        hover:bg-secondary/60 transition-all duration-300 cursor-pointer bg-secondary overflow-hidden`}
      onClick={() => setSelectedProfile(profile)}
    >
      {/* Status indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${config.color}-500/50`}></div>

      <div className="flex items-center gap-4 p-4 pl-6">
        {/* Avatar section */}
        <div className="relative flex-shrink-0">
          <div className={`w-14 h-14 rounded-xl overflow-hidden   bg-gray-800/80`}>
            <img
              src={getImageUrl()}
              alt={profile.team_id ? profile.team_name : profile.username}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* Content section */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap justify-between">
            <h3 className="text-lg font-custom text-white tracking-widest truncate group-hover:text-white transition-colors">
              {profile.team_id ? profile.team_name : profile.username}
            </h3>

            <StatusBadge />
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3">
            {profile.team_id ? (
              <>
                <div className="flex items-center justify-between px-2 py-0.5 rounded-md bg-gray-800/70  text-xs font-mono text-gray-300">
                  <Clock size={12} className="mr-1.5 text-primary" />
                  <span className="pr-2">Registration Date</span>
                  <span>{new Date(profile.registration_date).toLocaleDateString()}</span>
                </div>
              </>
            ) : (
              <>
                <div className="text-sm text-gray-300 truncate">{profile.email}</div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-between px-2 py-0.5 rounded-md bg-gray-800/70  text-xs font-mono text-gray-300">
                    <Clock size={12} className="mr-1.5 text-primary" />
                    <span className="pr-2">Registration Date</span>
                    <span>{new Date(profile.registration_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action buttons for pending status */}
        {profile.status === 'pending' && typeof onStatusUpdate === 'function' && (
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

  return viewType === 'list' ? renderListView() : renderGridView();
};

export default ProfileCard;
