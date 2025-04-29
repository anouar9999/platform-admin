/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  Users,
  Trophy,
  Gamepad2,
  Clock,
  UserPlus,
  BookOpen,
  Video,
  User,
  Network,
  Zap,
  CheckCircle,
  AlertCircle,
  Clock3,
  XCircle,
  AlertTriangle,
  FileEdit,
  Share2,
  Tag,
} from 'lucide-react';

const TournamentCard = ({
  id,
  name,
  startDate,
  endDate,
  status,
  maxParticipants,
  prizePool,
  description,
  image,
  bracket_type,
  slug,
  game,
  participationType,
  bracketType,
  format_des_qualifications,
  registrationStart,
  registrationEnd,
  prizeDistribution,
  streamUrl,

  isFeatured = false,

  tags = [],
}) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const registrationStartObj = registrationStart ? new Date(registrationStart) : null;
  const registrationEndObj = registrationEnd ? new Date(registrationEnd) : null;

  // Update countdown timer every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(formatTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, [startDate]);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Convert start time to hours:minutes:seconds format for countdown
  const formatTimeRemaining = () => {
    const now = new Date();
    const timeRemaining = startDateObj - now;

    if (timeRemaining <= 0) return '00:00:00';

    const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  // Format date like "SUN, 10 JAN 12:30"
  const formatCardDate = (date) => {
    return (
      date
        .toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        })
        .toUpperCase() +
      ' ' +
      date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    );
  };

  // Calculate tournament duration in days
  const getTournamentDuration = () => {
    const diffTime = Math.abs(endDateObj - startDateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format registration period
  const getRegistrationPeriod = () => {
    if (!registrationStartObj || !registrationEndObj) return 'Registration details unavailable';

    const startFormatted = registrationStartObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });

    const endFormatted = registrationEndObj.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
    });

    return `${startFormatted} - ${endFormatted}`;
  };

  // Get status info with icon, label, color, and animation
  const getStatusInfo = () => {
    switch (status) {
      case 'draft':
        return {
          icon: <FileEdit className="w-3 h-3 mr-1" />,
          label: 'Draft',
          color: 'bg-gray-500',
          textColor: 'text-white',
          animation: '',
        };
      case 'registration_open':
        return {
          icon: <CheckCircle className="w-3 h-3 mr-1" />,
          label: 'Registration Open',
          color: 'bg-green-600',
          textColor: 'text-white',
          animation: 'animate-pulse',
        };
      case 'registration_closed':
        return {
          icon: <AlertCircle className="w-3 h-3 mr-1" />,
          label: 'Registration Closed',
          color: 'bg-yellow-500',
          textColor: 'text-black',
          animation: '',
        };
      case 'upcoming':
        return {
          icon: <Clock className="w-3 h-3 mr-1" />,
          label: 'Upcoming',
          color: 'bg-blue-400',
          textColor: 'text-white',
          animation: '',
        };
      case 'ongoing':
        return {
          icon: <Clock3 className="w-3 h-3 mr-1" />,
          label: 'Ongoing',
          color: 'bg-blue-600',
          textColor: 'text-white',
          animation: 'animate-pulse',
        };
      case 'completed':
        return {
          icon: <Trophy className="w-3 h-3 mr-1" />,
          label: 'Completed',
          color: 'bg-purple-600',
          textColor: 'text-white',
          animation: '',
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-3 h-3 mr-1" />,
          label: 'Cancelled',
          color: 'bg-red-600',
          textColor: 'text-white',
          animation: '',
        };
      default:
        return {
          icon: <AlertTriangle className="w-3 h-3 mr-1" />,
          label: 'Unknown',
          color: 'bg-gray-600',
          textColor: 'text-white',
          animation: '',
        };
    }
  };

  // Parse prize distribution JSON if available
  const getPrizeDistribution = () => {
    if (!prizeDistribution) return null;

    try {
      const prizeData =
        typeof prizeDistribution === 'string' ? JSON.parse(prizeDistribution) : prizeDistribution;

      return prizeData;
    } catch (e) {
      console.error('Error parsing prize distribution', e);
      return null;
    }
  };

  // Dynamic font class based on game type
  const getGameTypeFont = () => {
    switch (game.name) {
      case 'Valorant':
        return 'font-valorant';
      case 'Free Fire':
        return 'font-free-fire';
      case 'Street Fighter':
        return 'font-street-fighter font-[2px]';
      case 'Fc Football':
        return 'font-ea-football';
      default:
        return 'font-custom'; // Default font
    }
  };

  // Badge color and letter based on game type
  const getBadgeInfo = () => {
    switch (game.name?.toLowerCase()) {
      case 'valorant':
        return { color: 'bg-red-500', letter: 'V' };
      case 'free fire':
        return { color: 'bg-yellow-500', letter: 'F' };
      case 'street fighter':
        return { color: 'bg-green-500', letter: 'S' };
      case 'fc football':
        return { color: 'bg-blue-500', letter: 'FC' };
      default:
        return { color: 'bg-yellow-500', letter: 'F' }; // Default badge
    }
  };

  const statusInfo = getStatusInfo();
  const badgeInfo = getBadgeInfo();
  const fontClass = getGameTypeFont();
  const prizeData = getPrizeDistribution();

  // Determine if tournament is starting soon (less than 24 hours)
  const isStartingSoon = () => {
    const now = new Date();
    const timeUntilStart = startDateObj - now;
    return timeUntilStart > 0 && timeUntilStart < 24 * 60 * 60 * 1000;
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleShareClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: name,
        text: description,
        url: `/tournament/${slug}`,
      });
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/tournament/${slug}`);
      // Would show toast notification here
    }
  };

  return (
    <Link href={`/admin/tournament/${slug}`}>
      <div
        className="bg-secondary  overflow-hidden shadow-lg angular-cut transition-all duration-300 flex flex-col h-full group relative hover:shadow-xl "
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Enhanced Status badge */}
        <div
          className={`absolute top-0 right-0 ${statusInfo.color} ${statusInfo.textColor} text-xs px-2 py-1  z-10 flex items-center ${statusInfo.animation} shadow-md`}
        >
          {statusInfo.icon}
          <span className="font-semibold">{statusInfo.label}</span>
        </div>

        {/* Countdown timer with enhanced styling */}
        {/* <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg z-10 flex items-center">
          <Clock className="w-3 h-3 mr-1 text-orange-mge" />
          <span className="font-mono">{timeRemaining}</span>
        </div> */}

        {/* Quick action buttons - visible on hover */}
        <div
          className={`absolute right-2 top-12 z-20 flex flex-col gap-2 transition-opacity duration-200 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <button
            onClick={handleShareClick}
            className="rounded-full p-2 bg-black/50 text-white backdrop-blur-sm hover:bg-black/70"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Card header with image, gradient and hover effect */}
        <div className="relative h-32 overflow-hidden angular-cut">
          {/* Tournament banner image with zoom effect on hover */}
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-700 `}
          />

          {/* Overlay gradient - darker on hover */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-300 ${
              isHovered ? 'opacity-90' : 'opacity-80'
            }`}
          ></div>

          {/* Game type badge with enhanced styling */}
          <div
            className="absolute bottom-0 right-0 px-2 py-0.5 text-xs flex items-center  overflow-hidden "
            style={{
              backgroundImage: `url(${game.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Dark overlay */}
            <div
              className="absolute inset-0 bg-black/50 z-0"
              style={{ mixBlendMode: 'multiply' }}
            ></div>

            {/* Content (on top of the overlay) */}
            <span
              className={`${fontClass}  ${
                game.name == 'Street Fighter' ? 'text-[7px] tracking-widest' : ''
              } tracking-widest relative z-10 text-white`}
            >
              {game.name}
            </span>
          </div>
        </div>

        {/* Card content with more details */}
        <div className="p-3 flex-1 flex flex-col bg-secondary angular-cut">
          {/* Date and duration */}
          {/* <div className="flex justify-between items-center mb-1">
            <div className="text-gray-400 text-xs font-mono flex items-center">
              <Calendar className="w-3 h-3 text-orange-mge mr-1" />
              {formatCardDate(startDateObj)}
            </div>
            <div className="text-gray-400 text-xs font-medium">{getTournamentDuration()} days</div>
          </div> */}

          {/* Tournament title with improved styling */}
          <h3
            className={`text-white ${
              game.name == 'Street Fighter'
                ? 'text-[9px] tracking-widest'
                : 'text-xl tracking-wider'
            }    ${fontClass} mb-1 line-clamp-1 group-hover:text-orange-mge transition-colors duration-200`}
          >
            {name}
          </h3>

          {/* Tournament description */}
          <p className="text-gray-400 text-xs mb-3 line-clamp-2 overflow-hidden">
            {description || 'One more contest is coming upon us. Be sure to sign up for this.'}
          </p>

          {/* Tags row */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-900/30 text-gray-300 px-2 py-1 rounded-md flex items-center"
                >
                  <Tag className="w-3 h-3 text-orange-mge mr-1" />
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs bg-blue-900/30 text-gray-300 px-2 py-1 rounded-md">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Format and bracket type row */}
          <div className="flex justify-between items-center mb-3 text-xs font-mono capitalize text-gray-400">
            <div className="flex items-center">
              <Users className="w-3 h-3 text-orange-mge mr-1" />
              <span>{participationType}</span>
            </div>
            <div className="flex items-center">
              <BookOpen className="w-3 h-3 text-orange-mge mr-1" />
              <span>{bracketType}</span>
            </div>
          </div>

          {/* Stats display with enhanced design */}
          <div className="flex justify-between items-center mb-3 px-1 p-2 rounded-lg">
            <div className="flex items-center">
              <User className="w-4 h-4 text-orange-mge mr-1" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm leading-tight">
                  {maxParticipants}
                </span>
                <span className="text-gray-400 text-[10px] leading-tight">Max Participant</span>
              </div>
            </div>

            <div className="flex items-center">
              <Network className="w-4 h-4 text-orange-mge mr-1" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-xs leading-tight">
                  {formatCardDate(new Date(startDate))}
                </span>
                <span className="text-gray-400 text-[10px] leading-tight">Start Date</span>
              </div>
            </div>

            <div className="flex items-center">
              <Zap className="w-4 h-4 text-orange-mge mr-1" />
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm leading-tight">
                  {formatCardDate(new Date(endDate))}
                </span>
                <span className="text-gray-400 text-[10px] leading-tight">End Date</span>
              </div>
            </div>
          </div>

          {/* Stream indicator if available */}
          {streamUrl && (
            <div className="flex items-center mb-3 text-green-400 text-xs font-medium">
              <Video className="w-3 h-3 mr-1" />
              <span>Live Stream Available</span>
            </div>
          )}

          {/* Registration info if in registration phase */}
          {status === 'registration_open' && registrationEndObj && (
            <div className="flex items-center  text-yellow-400 text-xs font-medium">
              <UserPlus className="w-3 h-3 mr-1" />
              <span>Registration closes: {formatDate(registrationEndObj).split(',')[1]}</span>
            </div>
          )}

          {/* Prize pool and join button with hover effect */}
          <div className=" flex items-center justify-end  -mx-3 -mb-3 py-2 px-3  mt-auto group-hover:bg-orange-mge/20 transition-colors duration-300">
            <div className="flex flex-col items-end">
              <div className="flex items-center">
                <div className="text-orange-mge text-[17px] font-custom">{prizePool} MAD</div>
                {/* <Trophy className="w-4 h-4 text-orange-mge ml-1" /> */}
              </div>
              <div className="text-xs font-mono text-gray-300 ">Prize Pool</div>
            </div>
          </div>
        </div>

        {/* Starting soon flashing indicator */}
        {isStartingSoon() && (
          <div className="absolute inset-0 border-2 border-orange-500 rounded-xl animate-pulse pointer-events-none"></div>
        )}
      </div>
    </Link>
  );
};

export default TournamentCard;
