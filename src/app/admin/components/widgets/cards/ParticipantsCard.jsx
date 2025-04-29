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
        hover:shadow-lg hover:shadow-${config.color}-500/10 cursor-pointer `}
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
                <div className="flex items-center justify-between px-1  rounded-md bg-gray-800/70  text-xs font-mono text-gray-300">
                  {/* <Clock size={12} className="mr-1.5 text-gray-400" /> */}
                  <img
                    className="w-10 h-10"
                    src="https://curry.gg/uploads/703/64q9D5Bw2mASHeqoTlvoglqW7P7p1G-metaR29sZCAzLnBuZw==-.png"
                  />
                  {/* 
                  <span className="pr-2">Registration Date</span> */}
                  <span>{profile.division}</span>
                </div>
                <div className="flex items-center justify-between px-1  rounded-md bg-gray-800/70  text-xs font-mono text-gray-300">
                  {/* <Clock size={12} className="mr-1.5 text-gray-400" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="30"
                    viewBox="0 0 26 30"
                    fill="none"
                    class="svg replaced-svg"
                  >
                    <path
                      d="M11.9316 3.16432C12.6156 2.76945 13.4582 2.76945 14.1422 3.16432L22.7342 8.12491C23.4181 8.51979 23.8394 9.24954 23.8394 10.0393V19.9605C23.8394 20.7502 23.4181 21.48 22.7342 21.8748L14.1422 26.8354C13.4582 27.2303 12.6156 27.2303 11.9316 26.8354L3.33964 21.8748C2.6557 21.48 2.23438 20.7502 2.23438 19.9605V10.0393C2.23438 9.24954 2.6557 8.51979 3.33964 8.12491L11.9316 3.16432Z"
                      fill="#0C1E2D"
                      class="color"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M21.2657 9.59158L13.6526 5.19612C13.2908 4.98726 12.8451 4.98726 12.4833 5.19612L4.87018 9.59158C4.50842 9.80044 4.28557 10.1864 4.28557 10.6042V19.3951C4.28557 19.8128 4.50842 20.1988 4.87018 20.4077L12.4833 24.8031C12.8451 25.012 13.2908 25.012 13.6526 24.8031L21.2657 20.4077C21.6275 20.1988 21.8503 19.8128 21.8503 19.3951V10.6042C21.8503 10.1864 21.6275 9.80044 21.2657 9.59158ZM14.0473 4.51242C13.4413 4.16253 12.6946 4.16253 12.0886 4.51242L4.47544 8.90788C3.86942 9.25777 3.49609 9.90438 3.49609 10.6042V19.3951C3.49609 20.0949 3.86942 20.7415 4.47544 21.0914L12.0886 25.4868C12.6946 25.8367 13.4413 25.8367 14.0473 25.4868L21.6605 21.0914C22.2665 20.7415 22.6398 20.0949 22.6398 19.3951V10.6042C22.6398 9.90438 22.2665 9.25777 21.6605 8.90788L14.0473 4.51242Z"
                      fill="url(#paint0_linear_3418_418224)"
                    ></path>
                    <path
                      opacity="0.14"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.7915 11.2258L13.4785 8.15832C13.2261 8.01256 12.915 8.01256 12.6626 8.15832L7.34956 11.2258C7.0971 11.3715 6.94158 11.6409 6.94158 11.9324V18.0673C6.94158 18.3589 7.0971 18.6282 7.34956 18.774L12.6626 21.8415C12.915 21.9872 13.2261 21.9872 13.4785 21.8415L18.7915 18.774C19.044 18.6282 19.1995 18.3589 19.1995 18.0673V11.9324C19.1995 11.6409 19.044 11.3715 18.7915 11.2258ZM13.754 7.68118C13.3311 7.437 12.81 7.437 12.3871 7.68118L7.07408 10.7486C6.65116 10.9928 6.39062 11.4441 6.39062 11.9324V18.0673C6.39062 18.5557 6.65116 19.007 7.07408 19.2511L12.3871 22.3186C12.81 22.5628 13.3311 22.5628 13.754 22.3186L19.067 19.2511C19.4899 19.007 19.7505 18.5557 19.7505 18.0673V11.9324C19.7505 11.4441 19.4899 10.9928 19.067 10.7486L13.754 7.68118Z"
                      fill="url(#paint1_linear_3418_418224)"
                    ></path>
                    <path
                      d="M20.5299 8.95605H22.9155V17.6858L20.5299 16.4549V15.5372L5.35825 16.4548V9.22589L20.5299 8.95605Z"
                      fill="#0C1E2D"
                      class="color"
                    ></path>
                    <path
                      d="M5.35825 9.22589H2.97266V17.6858L5.35825 16.4548V9.22589Z"
                      fill="#0C1E2D"
                      class="color"
                    ></path>
                    <path
                      d="M5.53516 14.1448C5.53454 13.8117 5.70888 13.5027 5.99434 13.3311L12.4459 9.45187C12.7463 9.27125 13.1218 9.27125 13.4222 9.45187L19.8738 13.3311C20.1592 13.5027 20.3336 13.8117 20.3329 14.1448L20.3329 14.1452L20.3323 14.5337L20.3309 15.462C20.3301 16.1817 20.3294 17.0207 20.3304 17.5031C20.331 17.8403 20.1524 18.1524 19.8614 18.3227C19.5704 18.493 19.2107 18.4957 18.9171 18.3299L18.9169 18.3297L18.6418 18.1744L17.9152 17.7644C17.3137 17.425 16.5113 16.9726 15.7079 16.5202C14.9043 16.0677 14.1002 15.6156 13.4949 15.2768C13.2792 15.156 13.0893 15.05 12.934 14.9636C12.7788 15.05 12.5889 15.156 12.3732 15.2768C11.7679 15.6156 10.9638 16.0677 10.1602 16.5202C9.35677 16.9726 8.55444 17.425 7.95293 17.7644L7.22634 18.1744L6.95093 18.3299C6.65733 18.4957 6.29773 18.493 6.00669 18.3227C5.71566 18.1524 5.53705 17.8403 5.53771 17.5031C5.53866 17.0207 5.53802 16.1817 5.53715 15.462L5.53582 14.5337L5.53516 14.1448Z"
                      fill="#0C1E2D"
                      class="color"
                    ></path>
                    <path
                      d="M12.9782 13.9438C13.0159 13.9438 19.4271 17.5644 19.4271 17.5644C19.4252 16.5962 19.4297 14.2025 19.4297 14.2025L12.9782 10.3232L6.52665 14.2025C6.52665 14.2025 6.5311 16.5962 6.5292 17.5644C6.5292 17.5644 12.9404 13.9438 12.9782 13.9438Z"
                      fill="url(#paint2_linear_3418_418224)"
                    ></path>
                    <path
                      d="M3.80078 7.53473C3.80017 7.20309 3.97303 6.89527 4.25652 6.72317L12.5032 1.71665C12.8053 1.53325 13.1844 1.53325 13.4865 1.71665L21.7332 6.72317C22.0167 6.89527 22.1896 7.20309 22.189 7.53473L22.1881 8.03674L22.1864 9.23499C22.1853 10.1638 22.1845 11.247 22.1857 11.8701C22.1864 12.208 22.007 12.5207 21.715 12.6907C21.423 12.8607 21.0625 12.8623 20.769 12.6949L20.417 12.4943L19.4882 11.965C18.7193 11.527 17.6936 10.9431 16.6665 10.3592C15.6392 9.77517 14.6112 9.19155 13.8371 8.75409C13.5007 8.56392 13.2131 8.40189 12.9949 8.27963C12.7766 8.40189 12.4891 8.56392 12.1526 8.75409C11.3786 9.19155 10.3505 9.77517 9.32325 10.3592C8.29615 10.9431 7.27049 11.527 6.50157 11.965L5.57275 12.4943L5.22067 12.695C4.92715 12.8623 4.56671 12.8607 4.27473 12.6907C3.98274 12.5207 3.80339 12.208 3.80405 11.8701C3.80526 11.247 3.80444 10.1638 3.80332 9.23499L3.80163 8.03674L3.80078 7.53473Z"
                      fill="#0C1E2D"
                      class="color"
                    ></path>
                    <path
                      d="M12.9928 7.24013C13.0411 7.24013 21.2363 11.9129 21.2363 11.9129C21.2339 10.6632 21.2395 7.5739 21.2395 7.5739L12.9928 2.56738L4.74609 7.5739C4.74609 7.5739 4.75178 10.6632 4.74936 11.9129C4.74936 11.9129 12.9445 7.24013 12.9928 7.24013Z"
                      fill="url(#paint3_linear_3418_418224)"
                    ></path>
                    <defs>
                      <linearGradient
                        id="paint0_linear_3418_418224"
                        x1="13.068"
                        y1="2.92067"
                        x2="13.068"
                        y2="20.9207"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="white"></stop>
                        <stop offset="1" stop-color="#9BA2BC"></stop>
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_3418_418224"
                        x1="13.0705"
                        y1="6.57035"
                        x2="13.0705"
                        y2="19.132"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="white"></stop>
                        <stop offset="1" stop-color="#9BA2BC"></stop>
                      </linearGradient>
                      <linearGradient
                        id="paint2_linear_3418_418224"
                        x1="5.77287"
                        y1="10.3618"
                        x2="20.6614"
                        y2="11.7605"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FEE894"></stop>
                        <stop offset="1" stop-color="#FFC549"></stop>
                      </linearGradient>
                      <linearGradient
                        id="paint3_linear_3418_418224"
                        x1="2.47944"
                        y1="3.55237"
                        x2="19.3959"
                        y2="15.3022"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FEE894"></stop>
                        <stop offset="1" stop-color="#FFC549"></stop>
                      </linearGradient>
                    </defs>
                  </svg>{' '}
                  {/* 
                  <span className="pr-2">Registration Date</span> */}
                  <span>{profile.total_members} Players</span>
                </div>
                
              </div>
            <div className="flex items-center justify-between px-2 py-1 m-1 rounded-md bg-gray-800/70  text-xs font-mono text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="31" viewBox="0 0 26 31" fill="none" class="svg replaced-svg">
<path d="M12.1152 4.03248C12.7992 3.63761 13.6418 3.63761 14.3258 4.03248L22.9178 8.99308C23.6017 9.38795 24.023 10.1177 24.023 10.9074V20.8286C24.023 21.6184 23.6017 22.3481 22.9178 22.743L14.3258 27.7036C13.6418 28.0985 12.7992 28.0985 12.1152 27.7036L3.52323 22.743C2.83929 22.3481 2.41797 21.6184 2.41797 20.8286V10.9074C2.41797 10.1177 2.83929 9.38795 3.52323 8.99308L12.1152 4.03248Z" fill="#0C1E2D" class="color"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.4181 10.4597L13.8049 6.06428C13.4431 5.85542 12.9974 5.85542 12.6357 6.06428L5.02252 10.4597C4.66076 10.6686 4.43791 11.0546 4.43791 11.4723V20.2632C4.43791 20.681 4.66076 21.067 5.02252 21.2758L12.6357 25.6713C12.9974 25.8801 13.4431 25.8801 13.8049 25.6713L21.4181 21.2758C21.7798 21.067 22.0027 20.681 22.0027 20.2632V11.4723C22.0027 11.0546 21.7798 10.6686 21.4181 10.4597ZM14.1996 5.38058C13.5936 5.03069 12.847 5.03069 12.2409 5.38058L4.62778 9.77604C4.02176 10.1259 3.64844 10.7725 3.64844 11.4723V20.2632C3.64844 20.963 4.02176 21.6096 4.62778 21.9595L12.2409 26.355C12.847 26.7049 13.5936 26.7049 14.1996 26.355L21.8128 21.9595C22.4188 21.6096 22.7922 20.963 22.7922 20.2632V11.4723C22.7922 10.7725 22.4188 10.1259 21.8128 9.77604L14.1996 5.38058Z" fill="url(#paint0_linear_3418_418199)"></path>
<rect x="11.0078" y="5.13184" width="5.05263" height="4.89474" fill="#0C1E2D" class="color"></rect>
<path d="M6.90844 6.34324C7.92559 5.72165 9.40421 5.76471 9.40421 5.76471L9.40419 8.49929L5.25363 8.22013C5.25363 8.22013 5.89128 6.96483 6.90844 6.34324Z" fill="#0C1E2D" class="color"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M14.5858 10.3964C14.6181 9.86796 14.7214 9.63112 14.7214 9.63112C14.7214 9.63112 13.1336 8.59758 12.5109 7.81533C11.961 7.12461 11.5635 5.7627 11.5635 5.7627L11.0109 6.55217C11.0109 6.55217 8.00539 5.88194 6.56021 7.25565C5.67876 8.09351 5.27682 9.28234 4.87654 10.4663C4.73698 10.8791 4.59762 11.2912 4.43821 11.6877C4.43821 14.7667 4.4375 20.2117 4.4375 20.2117L9.58985 21.2364L10.2729 16.98C10.2729 16.98 11.5761 14.9965 12.0475 14.3477C13.1655 15.6254 14.5817 16.8498 14.5817 16.8498L18.4858 14.9507V15.4024L19.5856 14.4799L19.8577 12.4621L15.3674 13.7482C15.3674 13.7482 14.9538 12.9756 14.3795 12.1169C14.5916 11.6879 14.6926 11.2 14.6181 10.6393L14.5858 10.3964Z" fill="url(#paint1_linear_3418_418199)"></path>
<path d="M5.14062 19.1899L4.76989 10.8301L4.43957 11.3609V19.8857L5.14062 21.1887L5.14062 19.1899Z" fill="#0C1E2D" class="color"></path>
<path d="M7.63119 8.06121C8.40296 7.53501 10.1774 7.19996 10.1774 7.19996C10.1774 7.19996 8.43804 7.1298 7.4441 7.7221C6.45015 8.31441 5.68501 10.4492 5.68501 10.4492C5.68501 10.4492 6.85942 8.58742 7.63119 8.06121Z" fill="#0C1E2D" class="color"></path>
<path d="M12.3649 14.6683L10.7457 12.8265L11.6155 14.9893L12.3649 14.6683Z" fill="#0C1E2D" class="color"></path>
<path d="M14.685 11.7496L12.8291 10.5503L14.3808 12.1362L14.685 11.7496Z" fill="#0C1E2D" class="color"></path>
<path d="M18.3806 4.26131C18.3806 4.26131 18.6022 4.71213 18.6293 5.02448C18.6562 5.33502 18.5175 5.81472 18.5175 5.81472L18.6273 6.71661L18.7797 7.19371L18.1482 7.365C18.1482 7.365 18.0953 9.014 17.3508 9.34401C17.0063 9.49668 16.3884 9.38402 16.3884 9.38402C16.3884 9.38402 12.6797 7.99984 12.5991 6.06078C12.5185 4.12172 13.7726 2.49495 15.4003 2.42727C17.6378 2.33425 18.3806 4.26131 18.3806 4.26131Z" fill="url(#paint2_linear_3418_418199)"></path>
<path d="M18.3806 4.26131C18.3806 4.26131 18.6022 4.71213 18.6293 5.02448C18.6562 5.33502 18.5175 5.81472 18.5175 5.81472L18.6273 6.71661L18.7797 7.19371L18.1482 7.365C18.1482 7.365 18.0953 9.014 17.3508 9.34401C17.0063 9.49668 16.3884 9.38402 16.3884 9.38402C16.3884 9.38402 12.6797 7.99984 12.5991 6.06078C12.5185 4.12172 13.7726 2.49495 15.4003 2.42727C17.6378 2.33425 18.3806 4.26131 18.3806 4.26131Z" fill="#DFE2EA"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M16.3892 9.38352C16.3892 9.38352 12.6805 7.99934 12.5999 6.06028C12.5192 4.12122 13.7734 2.49444 15.4011 2.42677C17.6385 2.33375 18.3814 4.2608 18.3814 4.2608C18.3814 4.2608 18.6029 4.71163 18.63 5.02397C18.657 5.33451 18.5183 5.81421 18.5183 5.81421L18.6281 6.7161L18.7805 7.19321L18.1489 7.3645C18.1489 7.3645 18.0961 9.0135 17.3516 9.34351C17.0071 9.49618 16.3892 9.38352 16.3892 9.38352ZM18.5938 7.73463C18.5749 7.90064 18.5433 8.11367 18.4906 8.33833C18.4323 8.58722 18.3438 8.86942 18.2061 9.12192C18.0703 9.37086 17.862 9.63537 17.5435 9.77656C17.2634 9.9007 16.9268 9.90348 16.7195 9.89395C16.6046 9.88867 16.5032 9.87791 16.4305 9.86852C16.3939 9.86379 16.3639 9.85933 16.3423 9.85592C16.3316 9.85421 16.3228 9.85276 16.3164 9.85166L16.3085 9.85029L16.3059 9.84983L16.305 9.84965L16.3044 9.84955C16.3043 9.84953 16.3042 9.84952 16.3892 9.38352C16.2236 9.8273 16.2235 9.82726 16.2233 9.82721L16.223 9.82709L16.2221 9.82675L16.2193 9.8257L16.2097 9.82206C16.2016 9.81896 16.19 9.81452 16.1753 9.80876C16.1458 9.79724 16.1034 9.78043 16.05 9.75854C15.9433 9.71479 15.7921 9.65058 15.611 9.56749C15.2499 9.40186 14.7642 9.15868 14.2729 8.85022C13.7845 8.5436 13.2726 8.16141 12.8725 7.71291C12.4745 7.26677 12.153 6.71609 12.1266 6.07995C12.0385 3.96051 13.4181 2.03512 15.3814 1.95349C16.6576 1.90044 17.5263 2.42958 18.0669 2.97566C18.3337 3.24515 18.5196 3.51706 18.6395 3.72236C18.6996 3.82542 18.7438 3.91292 18.7738 3.97668C18.7888 4.0086 18.8003 4.03469 18.8085 4.05395C18.8109 4.05954 18.813 4.06457 18.8148 4.06899C18.8161 4.07183 18.8176 4.075 18.8193 4.07849C18.8265 4.09383 18.8365 4.11537 18.8485 4.14192C18.8722 4.19476 18.9042 4.26877 18.9373 4.35419C18.9987 4.51289 19.0823 4.75617 19.1019 4.98303C19.1215 5.20855 19.0817 5.46118 19.049 5.62719C19.0317 5.71504 19.0135 5.79189 18.9995 5.84753L19.0929 6.61453L19.2317 7.04909C19.271 7.17223 19.2583 7.30609 19.1965 7.41964C19.1347 7.53318 19.0292 7.61654 18.9045 7.65038L18.5938 7.73463ZM16.2236 9.8273L16.3892 9.38352L16.3042 9.84952C16.2768 9.84451 16.2498 9.83707 16.2236 9.8273Z" fill="#0C1E2D" class="color"></path>
<path d="M18.38 4.12352C18.38 4.12352 17.0192 2.93756 16.4696 3.15531C15.92 3.37307 17.1854 3.72246 16.8434 5.13758C16.5015 6.55269 16.0939 6.38691 16.0939 6.38691C16.0939 6.38691 16.2532 5.36276 15.6554 5.18697C14.8718 4.95658 14.8073 6.1115 15.6635 6.55099C15.066 8.24473 15.2403 7.7624 15.2403 7.7624L13.7643 7.89685C13.7643 7.89685 12.6252 7.66403 12.5534 5.93721C12.4721 3.9828 13.736 2.34315 15.3764 2.27495C17.6313 2.1812 18.38 4.12352 18.38 4.12352Z" fill="#0C1E2D" class="color"></path>
<path d="M17.1478 6.175L17.3934 5.9725L18.2894 5.73112L18.1429 6.36398L17.7851 6.26635L17.1478 6.175Z" fill="#0C1E2D" class="color"></path>
<path d="M4.53906 20.7334L9.71924 21.8936L10.8403 24.6801C10.8403 24.6801 6.052 21.8918 4.83553 21.1838C4.57493 20.8768 4.53906 20.7334 4.53906 20.7334Z" fill="url(#paint3_linear_3418_418199)"></path>
<path d="M4.5389 20.7338L4.44074 20.2704L4.44076 19.7456L4.90379 19.8046L5.03922 20.4893L5.16826 20.9545L7.82654 22.4851L11.1142 24.2364L10.8401 24.6805C10.8401 24.6805 6.05184 21.8922 4.83536 21.1842C4.57477 20.8772 4.5389 20.7338 4.5389 20.7338Z" fill="#0C1E2D" class="color"></path>
<path d="M21.3419 11.9424L23.5524 12.321V17.1163L22.632 21.8272L20.2812 23.3728L20.5023 21.464L21.085 20.8813L21.3419 11.9424Z" fill="#0C1E2D" class="color"></path>
<path d="M23.2984 14.9726L21.2438 30.1267L20.0705 30.1267L22.134 15.8019C22.134 15.8019 21.4226 15.5542 21.094 15.5634C20.4727 15.5807 20.0624 16.0238 19.7511 16.2114C19.4397 16.399 19.2508 16.5313 18.9681 16.3887C18.3713 16.0877 18.9602 15.5895 18.9602 15.5895C18.9602 15.5895 19.6585 14.9444 20.2151 14.7495C20.6156 14.6092 20.8645 14.596 21.2886 14.5809C22.0877 14.5525 23.2984 14.9726 23.2984 14.9726Z" fill="url(#paint4_linear_3418_418199)"></path>
<path d="M20.3074 12.6202L20.9375 13.103C21.5087 13.0368 22.4893 12.7186 22.8304 13.103C23.2566 13.5835 24.0712 14.5142 23.6887 14.6588C23.3827 14.7745 22.4861 14.6151 22.0111 14.3736L20.6905 14.3736L20.1425 14.4508L20.3074 12.6202Z" fill="url(#paint5_linear_3418_418199)"></path>
<defs>
<linearGradient id="paint0_linear_3418_418199" x1="13.2203" y1="3.78884" x2="13.2203" y2="21.7888" gradientUnits="userSpaceOnUse">
<stop stop-color="white"></stop>
<stop offset="1" stop-color="#9BA2BC"></stop>
</linearGradient>
<linearGradient id="paint1_linear_3418_418199" x1="20.7585" y1="5.84505" x2="2.85793" y2="6.78557" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEE894"></stop>
<stop offset="1" stop-color="#FFC549"></stop>
</linearGradient>
<linearGradient id="paint2_linear_3418_418199" x1="18.9353" y1="2.31787" x2="11.8363" y2="2.9394" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEE894"></stop>
<stop offset="1" stop-color="#FFC549"></stop>
</linearGradient>
<linearGradient id="paint3_linear_3418_418199" x1="11.7291" y1="22.0633" x2="3.76664" y2="21.6716" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEE894"></stop>
<stop offset="1" stop-color="#FFC549"></stop>
</linearGradient>
<linearGradient id="paint4_linear_3418_418199" x1="18.7658" y1="14.0918" x2="24.6804" y2="15.3529" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEE894"></stop>
<stop offset="1" stop-color="#FFC549"></stop>
</linearGradient>
<linearGradient id="paint5_linear_3418_418199" x1="21.8179" y1="12.3722" x2="21.9521" y2="14.2865" gradientUnits="userSpaceOnUse">
<stop stop-color="white"></stop>
<stop offset="1" stop-color="#9BA2BC"></stop>
</linearGradient>
</defs>
</svg>    
                  <span className="">Registration Date</span>
                  <span>{new Date(profile.registration_date).toLocaleDateString()}</span>
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
                </div><div className="flex items-center justify-between px-1  rounded-md  text-xs font-mono text-gray-300">
                  {/* <Clock size={12} className="mr-1.5 text-gray-400" /> */}
                  <img
                    className="w-10 h-10"
                    src="https://curry.gg/uploads/703/64q9D5Bw2mASHeqoTlvoglqW7P7p1G-metaR29sZCAzLnBuZw==-.png"
                  />
                  {/* 
                  <span className="pr-2">Registration Date</span> */}
                  <span>{profile.division}</span>
                </div>
                <div className="flex items-center justify-between px-1  rounded-md  text-xs font-mono text-gray-300">
                  {/* <Clock size={12} className="mr-1.5 text-gray-400" /> */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="26"
                    height="30"
                    viewBox="0 0 26 30"
                    fill="none"
                    class="svg replaced-svg"
                  >
                    <path
                      d="M11.9316 3.16432C12.6156 2.76945 13.4582 2.76945 14.1422 3.16432L22.7342 8.12491C23.4181 8.51979 23.8394 9.24954 23.8394 10.0393V19.9605C23.8394 20.7502 23.4181 21.48 22.7342 21.8748L14.1422 26.8354C13.4582 27.2303 12.6156 27.2303 11.9316 26.8354L3.33964 21.8748C2.6557 21.48 2.23438 20.7502 2.23438 19.9605V10.0393C2.23438 9.24954 2.6557 8.51979 3.33964 8.12491L11.9316 3.16432Z"
                      fill="#0C1E2D"
                      class="color"
                    ></path>
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M21.2657 9.59158L13.6526 5.19612C13.2908 4.98726 12.8451 4.98726 12.4833 5.19612L4.87018 9.59158C4.50842 9.80044 4.28557 10.1864 4.28557 10.6042V19.3951C4.28557 19.8128 4.50842 20.1988 4.87018 20.4077L12.4833 24.8031C12.8451 25.012 13.2908 25.012 13.6526 24.8031L21.2657 20.4077C21.6275 20.1988 21.8503 19.8128 21.8503 19.3951V10.6042C21.8503 10.1864 21.6275 9.80044 21.2657 9.59158ZM14.0473 4.51242C13.4413 4.16253 12.6946 4.16253 12.0886 4.51242L4.47544 8.90788C3.86942 9.25777 3.49609 9.90438 3.49609 10.6042V19.3951C3.49609 20.0949 3.86942 20.7415 4.47544 21.0914L12.0886 25.4868C12.6946 25.8367 13.4413 25.8367 14.0473 25.4868L21.6605 21.0914C22.2665 20.7415 22.6398 20.0949 22.6398 19.3951V10.6042C22.6398 9.90438 22.2665 9.25777 21.6605 8.90788L14.0473 4.51242Z"
                      fill="url(#paint0_linear_3418_418224)"
                    ></path>
                    <path
                      opacity="0.14"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M18.7915 11.2258L13.4785 8.15832C13.2261 8.01256 12.915 8.01256 12.6626 8.15832L7.34956 11.2258C7.0971 11.3715 6.94158 11.6409 6.94158 11.9324V18.0673C6.94158 18.3589 7.0971 18.6282 7.34956 18.774L12.6626 21.8415C12.915 21.9872 13.2261 21.9872 13.4785 21.8415L18.7915 18.774C19.044 18.6282 19.1995 18.3589 19.1995 18.0673V11.9324C19.1995 11.6409 19.044 11.3715 18.7915 11.2258ZM13.754 7.68118C13.3311 7.437 12.81 7.437 12.3871 7.68118L7.07408 10.7486C6.65116 10.9928 6.39062 11.4441 6.39062 11.9324V18.0673C6.39062 18.5557 6.65116 19.007 7.07408 19.2511L12.3871 22.3186C12.81 22.5628 13.3311 22.5628 13.754 22.3186L19.067 19.2511C19.4899 19.007 19.7505 18.5557 19.7505 18.0673V11.9324C19.7505 11.4441 19.4899 10.9928 19.067 10.7486L13.754 7.68118Z"
                      fill="url(#paint1_linear_3418_418224)"
                    ></path>
                    <path
                      d="M20.5299 8.95605H22.9155V17.6858L20.5299 16.4549V15.5372L5.35825 16.4548V9.22589L20.5299 8.95605Z"
                      fill="#0C1E2D"
                      class="color"
                    ></path>
                    <path
                      d="M5.35825 9.22589H2.97266V17.6858L5.35825 16.4548V9.22589Z"
                      fill="#0C1E2D"
                      class="color"
                    ></path>
                    <path
                      d="M5.53516 14.1448C5.53454 13.8117 5.70888 13.5027 5.99434 13.3311L12.4459 9.45187C12.7463 9.27125 13.1218 9.27125 13.4222 9.45187L19.8738 13.3311C20.1592 13.5027 20.3336 13.8117 20.3329 14.1448L20.3329 14.1452L20.3323 14.5337L20.3309 15.462C20.3301 16.1817 20.3294 17.0207 20.3304 17.5031C20.331 17.8403 20.1524 18.1524 19.8614 18.3227C19.5704 18.493 19.2107 18.4957 18.9171 18.3299L18.9169 18.3297L18.6418 18.1744L17.9152 17.7644C17.3137 17.425 16.5113 16.9726 15.7079 16.5202C14.9043 16.0677 14.1002 15.6156 13.4949 15.2768C13.2792 15.156 13.0893 15.05 12.934 14.9636C12.7788 15.05 12.5889 15.156 12.3732 15.2768C11.7679 15.6156 10.9638 16.0677 10.1602 16.5202C9.35677 16.9726 8.55444 17.425 7.95293 17.7644L7.22634 18.1744L6.95093 18.3299C6.65733 18.4957 6.29773 18.493 6.00669 18.3227C5.71566 18.1524 5.53705 17.8403 5.53771 17.5031C5.53866 17.0207 5.53802 16.1817 5.53715 15.462L5.53582 14.5337L5.53516 14.1448Z"
                      fill="#0C1E2D"
                      class="color"
                    ></path>
                    <path
                      d="M12.9782 13.9438C13.0159 13.9438 19.4271 17.5644 19.4271 17.5644C19.4252 16.5962 19.4297 14.2025 19.4297 14.2025L12.9782 10.3232L6.52665 14.2025C6.52665 14.2025 6.5311 16.5962 6.5292 17.5644C6.5292 17.5644 12.9404 13.9438 12.9782 13.9438Z"
                      fill="url(#paint2_linear_3418_418224)"
                    ></path>
                    <path
                      d="M3.80078 7.53473C3.80017 7.20309 3.97303 6.89527 4.25652 6.72317L12.5032 1.71665C12.8053 1.53325 13.1844 1.53325 13.4865 1.71665L21.7332 6.72317C22.0167 6.89527 22.1896 7.20309 22.189 7.53473L22.1881 8.03674L22.1864 9.23499C22.1853 10.1638 22.1845 11.247 22.1857 11.8701C22.1864 12.208 22.007 12.5207 21.715 12.6907C21.423 12.8607 21.0625 12.8623 20.769 12.6949L20.417 12.4943L19.4882 11.965C18.7193 11.527 17.6936 10.9431 16.6665 10.3592C15.6392 9.77517 14.6112 9.19155 13.8371 8.75409C13.5007 8.56392 13.2131 8.40189 12.9949 8.27963C12.7766 8.40189 12.4891 8.56392 12.1526 8.75409C11.3786 9.19155 10.3505 9.77517 9.32325 10.3592C8.29615 10.9431 7.27049 11.527 6.50157 11.965L5.57275 12.4943L5.22067 12.695C4.92715 12.8623 4.56671 12.8607 4.27473 12.6907C3.98274 12.5207 3.80339 12.208 3.80405 11.8701C3.80526 11.247 3.80444 10.1638 3.80332 9.23499L3.80163 8.03674L3.80078 7.53473Z"
                      fill="#0C1E2D"
                      class="color"
                    ></path>
                    <path
                      d="M12.9928 7.24013C13.0411 7.24013 21.2363 11.9129 21.2363 11.9129C21.2339 10.6632 21.2395 7.5739 21.2395 7.5739L12.9928 2.56738L4.74609 7.5739C4.74609 7.5739 4.75178 10.6632 4.74936 11.9129C4.74936 11.9129 12.9445 7.24013 12.9928 7.24013Z"
                      fill="url(#paint3_linear_3418_418224)"
                    ></path>
                    <defs>
                      <linearGradient
                        id="paint0_linear_3418_418224"
                        x1="13.068"
                        y1="2.92067"
                        x2="13.068"
                        y2="20.9207"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="white"></stop>
                        <stop offset="1" stop-color="#9BA2BC"></stop>
                      </linearGradient>
                      <linearGradient
                        id="paint1_linear_3418_418224"
                        x1="13.0705"
                        y1="6.57035"
                        x2="13.0705"
                        y2="19.132"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="white"></stop>
                        <stop offset="1" stop-color="#9BA2BC"></stop>
                      </linearGradient>
                      <linearGradient
                        id="paint2_linear_3418_418224"
                        x1="5.77287"
                        y1="10.3618"
                        x2="20.6614"
                        y2="11.7605"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FEE894"></stop>
                        <stop offset="1" stop-color="#FFC549"></stop>
                      </linearGradient>
                      <linearGradient
                        id="paint3_linear_3418_418224"
                        x1="2.47944"
                        y1="3.55237"
                        x2="19.3959"
                        y2="15.3022"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stop-color="#FEE894"></stop>
                        <stop offset="1" stop-color="#FFC549"></stop>
                      </linearGradient>
                    </defs>
                  </svg>{' '}
                  {/* 
                  <span className="pr-2">Registration Date</span> */}
                  <span>{profile.total_members} Players</span>
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
