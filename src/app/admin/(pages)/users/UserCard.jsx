import React, { useState } from 'react';
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  User,
  Shield,
  Calendar,
  Mail,
  Trophy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Crown,
  Star
} from 'lucide-react';

const PlayerCard = ({ player, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);

  // Helper function to determine verification status styling
  const getVerificationStatus = () => {
    if (player.is_verified === 1 || player.is_verified === true) {
      return {
        icon: CheckCircle,
        text: 'Vérifié',
        color: 'text-green-400',
        bgColor: 'bg-green-500/10'
      };
    }
    return {
      icon: XCircle,
      text: 'Non vérifié',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    };
  };

  // Helper function to get rank badge color
  const getRankColor = (rank) => {
    if (!rank) return 'text-gray-400';
    if (rank <= 10) return 'text-yellow-400';
    if (rank <= 50) return 'text-blue-400';
    if (rank <= 100) return 'text-purple-400';
    return 'text-gray-400';
  };

  // Helper function to format user type display
  const getUserTypeDisplay = () => {
    const type = player.user_type || player.type || 'user';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const verificationStatus = getVerificationStatus();
  const VerificationIcon = verificationStatus.icon;

  return (
    <div className="relative group">
      {/* Admin Actions Overlay */}
      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="p-2 bg-secondary/90 backdrop-blur-sm hover:bg-slate-700/90 rounded-lg transition-colors"
        >
          <MoreVertical size={18} className="text-white" />
        </button>
        
        {showActions && (
          <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-lg shadow-xl border border-slate-700/50">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onView(player);
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 rounded-t-lg flex items-center gap-2"
            >
              <Eye size={16} />
              Voir détails
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(player);
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-left text-blue-400 hover:bg-slate-700/50 flex items-center gap-2"
            >
              <Edit size={16} />
              Modifier
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(player);
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700/50 rounded-b-lg flex items-center gap-2"
            >
              <Trash2 size={16} />
              Supprimer
            </button>
          </div>
        )}
      </div>

      {/* Main Card */}
      <div
        className="bg-black angular-cut overflow-hidden cursor-pointer transition-all duration-300 border border-gray-800/50 hover:border-gray-700 h-full flex flex-col"
        onClick={() => onView(player)}
      >
        {/* Header with Background */}
        <div className="relative h-32 overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">
          {player.avatar ? (
            <div className="relative w-full h-full">
              <img
                className="w-full h-full object-cover opacity-30"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${player.avatar}`}
                alt={player.username}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          )}
          
          {/* Verification Badge */}
          <div className={`absolute top-2 left-2 px-2 py-1 rounded-full ${verificationStatus.bgColor} flex items-center gap-1`}>
            <VerificationIcon size={12} className={verificationStatus.color} />
            <span className={`text-xs font-circular-web ${verificationStatus.color}`}>
              {verificationStatus.text}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 flex-1 flex flex-col">
          {/* Player Avatar & Basic Info */}
          <div className="flex items-center gap-4 -mt-8 mb-4">
            <div className="w-16 h-16 border-4 border-gray-900 bg-gray-800 shadow-xl flex-shrink-0 rounded-full flex items-center justify-center relative">
              {player.avatar ? (
                <img
                  className="w-full h-full object-cover rounded-full"
                  src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${player.avatar}`}
                  alt={player.username}
                />
              ) : (
                <User className="w-8 h-8 text-gray-500" />
              )}
              {player.rank && player.rank <= 10 && (
                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                  <Crown size={12} className="text-black" />
                </div>
              )}
            </div>
            <div className="flex-1 mt-10">
              <h3 className="text-white font-zentry text-xl truncate">{player.username}</h3>
              <p className="text-gray-400 text-sm font-circular-web truncate">{player.email}</p>
            </div>
          </div>

          {/* Bio */}
          {player.bio && (
            <div className="mb-4">
              <p className="text-gray-400 text-xs font-circular-web line-clamp-2 italic">
              {player.bio}
              </p>
            </div>
          )}

          {/* Player Detailed Info */}
          <div className="space-y-2 mb-4 flex-1">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-circular-web">
              <Shield size={14} />
              <span>Type: {getUserTypeDisplay()}</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-400 font-circular-web">
              <Mail size={14} />
              <span className="truncate">ID: #{player.id}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-circular-web">
              <Calendar size={14} />
              <span>Rejoint le {new Date(player.created_at).toLocaleDateString('fr-FR')}</span>
            </div>

            {player.failed_attempts > 0 && (
              <div className="flex items-center gap-2 text-xs text-orange-400 font-circular-web">
                <AlertTriangle size={14} />
                <span>{player.failed_attempts} tentative(s) échouée(s)</span>
              </div>
            )}
          </div>

          {/* Stats Footer */}
          <div className="grid grid-cols-3 gap-2 py-4 px-4 bg-black/30 rounded-lg border border-gray-800/50 mt-auto">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Trophy size={14} className="text-yellow-400" />
                <span className="text-white font-zentry text-base">{player.points || 0}</span>
              </div>
              <span className="text-primary font-circular-web font-bold text-xs mt-1">Points</span>
            </div>

            <div className="w-px bg-gray-800"></div>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <Star size={14} className={getRankColor(player.rank)} />
                <span className={`font-zentry text-base ${getRankColor(player.rank)}`}>
                  {player.rank ? `#${player.rank}` : 'N/A'}
                </span>
              </div>
              <span className="text-primary font-circular-web font-bold text-xs mt-1">Rang</span>
            </div>

            <div className="w-px bg-gray-800"></div>

            <div className="flex flex-col items-center">
              <VerificationIcon size={16} className={verificationStatus.color} />
              <span className="text-primary font-circular-web font-bold text-xs mt-1 text-center">
                Statut
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerCard;