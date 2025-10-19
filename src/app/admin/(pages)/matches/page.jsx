'use client';
import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Star,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Users,
  Calendar,
  TrendingUp,
  Award,
  Grid3x3,
  List,
  Clock,
  Play,
  CheckCircle,
  XCircle,
  Radio,
  Swords,
  Flag,
  MessageSquare,
  Download,
} from 'lucide-react';

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-gradient-to-br from-secondary to-[#0f172a] p-4 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 transition-colors duration-300`}>
        <Icon className={`w-6 h-6 ${color === 'blue' ? 'text-blue-400' : color === 'green' ? 'text-green-400' : color === 'purple' ? 'text-purple-400' : 'text-yellow-400'}`} />
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-circular-web mb-2 uppercase">{label}</h3>
    <p className="text-primary text-4xl font-zentry">{value}</p>
  </div>
);

// Dropdown Component
const Dropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-secondary text-slate-300 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30 hover:border-slate-600/50 font-circular-web"
      >
        {Icon && <Icon size={18} />}
        <span className="text-sm">{value || label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-48 mt-2 bg-secondary shadow-2xl border border-slate-700/30 overflow-hidden">
            {options.map((option, index) => (
              <button
                key={option.value}
                className={`w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 transition-colors duration-200 text-sm ${
                  index === 0 ? 'rounded-t-xl' : ''
                } ${index === options.length - 1 ? 'rounded-b-xl' : ''}`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// Match Card Component for Grid View
const MatchCard = ({ match, onEdit, onDelete, onView, onUpdateResult }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusStyle = (status) => {
    const styles = {
      upcoming: 'bg-blue-500/10 text-blue-500',
      live: 'bg-green-500/10 text-green-500',
      completed: 'bg-slate-500/10 text-slate-400',
      cancelled: 'bg-red-500/10 text-red-500',
      disputed: 'bg-yellow-500/10 text-yellow-500',
    };
    return styles[status] || styles.completed;
  };

  const getStatusLabel = (status) => {
    const labels = {
      upcoming: 'À venir',
      live: 'En direct',
      completed: 'Terminé',
      cancelled: 'Annulé',
      disputed: 'Contesté',
    };
    return labels[status] || status;
  };

  return (
    <div className="relative group">
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
                onView(match);
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 rounded-t-lg flex items-center gap-2"
            >
              <Eye size={16} />
              Voir détails
            </button>
            {match.status === 'upcoming' && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onUpdateResult(match);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-green-400 hover:bg-slate-700/50 flex items-center gap-2"
              >
                <Play size={16} />
                Entrer résultat
              </button>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(match);
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
                onDelete(match);
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

      <div className="bg-secondary rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all overflow-hidden">
        <div className="bg-slate-800/50 p-4 border-b border-slate-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="text-primary" size={18} />
              <div>
                <h3 className="text-white font-zentry text-sm">{match.tournament_name}</h3>
                <p className="text-slate-400 text-xs font-circular-web">{match.round || 'Round 1'}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium font-valorant ${getStatusStyle(match.status)}`}>
              {getStatusLabel(match.status)}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800">
                <img
                  src={match.team1_logo || 'https://via.placeholder.com/40'}
                  alt={match.team1_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-white font-zentry text-sm">{match.team1_name}</p>
                <p className="text-slate-400 text-xs font-circular-web">{match.team1_tag || 'Team 1'}</p>
              </div>
            </div>

            <div className="px-4">
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold font-ea-football text-white">{match.team1_score ?? '-'}</p>
                <span className="text-slate-600">:</span>
                <p className="text-2xl font-bold font-ea-football text-white">{match.team2_score ?? '-'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-1 flex-row-reverse">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-800">
                <img
                  src={match.team2_logo || 'https://via.placeholder.com/40'}
                  alt={match.team2_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-right">
                <p className="text-white font-zentry text-sm">{match.team2_name}</p>
                <p className="text-slate-400 text-xs font-circular-web">{match.team2_tag || 'Team 2'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-700/30">
            <div className="flex items-center gap-3 text-xs text-slate-400 font-circular-web">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(match.scheduled_time).toLocaleDateString('fr-FR')}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {new Date(match.scheduled_time).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            {match.stream_url && (
              <span className="flex items-center gap-1 text-xs text-red-400 font-circular-web">
                <Radio size={12} />
                Stream
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Match Row Component for List View
const MatchRow = ({ match, onEdit, onDelete, onView, onUpdateResult }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusStyle = (status) => {
    const styles = {
      upcoming: 'bg-blue-500/10 text-blue-500',
      live: 'bg-green-500/10 text-green-500',
      completed: 'bg-slate-500/10 text-slate-400',
      cancelled: 'bg-red-500/10 text-red-500',
      disputed: 'bg-yellow-500/10 text-yellow-500',
    };
    return styles[status] || styles.completed;
  };

  const getStatusLabel = (status) => {
    const labels = {
      upcoming: 'À venir',
      live: 'En direct',
      completed: 'Terminé',
      cancelled: 'Annulé',
      disputed: 'Contesté',
    };
    return labels[status] || status;
  };

  return (
    <tr className="border-b border-slate-700/50 font-circular-web hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div>
          <p className="text-white font-zentry tracking-wider">{match.tournament_name}</p>
          <p className="text-slate-400 text-sm">{match.round || 'Round 1'}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <img
            src={match.team1_logo || 'https://via.placeholder.com/32'}
            alt={match.team1_name}
            className="w-8 h-8 rounded object-cover"
          />
          <span className="text-white">{match.team1_name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-xl font-bold font-ea-football text-primary">
          {match.team1_score ?? '-'} : {match.team2_score ?? '-'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <img
            src={match.team2_logo || 'https://via.placeholder.com/32'}
            alt={match.team2_name}
            className="w-8 h-8 rounded object-cover"
          />
          <span className="text-white">{match.team2_name}</span>
        </div>
      </td>
      <td className="px-6 py-4 font-valorant">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(match.status)}`}>
          {getStatusLabel(match.status)}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-300">
        {new Date(match.scheduled_time).toLocaleDateString('fr-FR')}
      </td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-slate-400" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-lg shadow-xl border border-slate-700/50 z-10">
              <button
                onClick={() => {
                  onView(match);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 rounded-t-lg flex items-center gap-2"
              >
                <Eye size={16} />
                Voir détails
              </button>
              {match.status === 'upcoming' && (
                <button
                  onClick={() => {
                    onUpdateResult(match);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-green-400 hover:bg-slate-700/50 flex items-center gap-2"
                >
                  <Play size={16} />
                  Entrer résultat
                </button>
              )}
              <button
                onClick={() => {
                  onEdit(match);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-blue-400 hover:bg-slate-700/50 flex items-center gap-2"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={() => {
                  onDelete(match);
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
      </td>
    </tr>
  );
};

// Match Details Modal
const MatchDetailsModal = ({ match, onClose, onEdit, onDelete, onUpdateResult }) => {
  if (!match) return null;

  const getStatusStyle = (status) => {
    const styles = {
      upcoming: 'bg-blue-500/10 text-blue-500',
      live: 'bg-green-500/10 text-green-500',
      completed: 'bg-slate-500/10 text-slate-400',
      cancelled: 'bg-red-500/10 text-red-500',
      disputed: 'bg-yellow-500/10 text-yellow-500',
    };
    return styles[status] || styles.completed;
  };

  const getStatusLabel = (status) => {
    const labels = {
      upcoming: 'À venir',
      live: 'En direct',
      completed: 'Terminé',
      cancelled: 'Annulé',
      disputed: 'Contesté',
    };
    return labels[status] || status;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-secondary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50 shadow-2xl">
        <div className="sticky top-0 bg-secondary border-b border-slate-700/30 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <Swords className="text-primary" size={24} />
                <div>
                  <h2 className="text-2xl font-bold font-zentry text-white">{match.tournament_name}</h2>
                  <p className="text-slate-400 font-circular-web">{match.round || 'Round 1'} - Match #{match.id}</p>
                </div>
              </div>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium font-valorant ${getStatusStyle(match.status)}`}>
                {getStatusLabel(match.status)}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X size={24} className="text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-slate-800/30 rounded-xl p-8 border border-slate-700/30">
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center gap-4 flex-1">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-800 border-4 border-slate-700">
                  <img
                    src={match.team1_logo || 'https://via.placeholder.com/96'}
                    alt={match.team1_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold font-zentry text-xl mb-1">{match.team1_name}</p>
                  <p className="text-slate-400 text-sm font-circular-web">{match.team1_tag || 'Team 1'}</p>
                </div>
              </div>

              <div className="px-8">
                <div className="flex items-center gap-6">
                  <div className="text-center bg-slate-800 rounded-xl p-6 min-w-[80px]">
                    <p className="text-5xl font-bold font-ea-football text-primary">{match.team1_score ?? '-'}</p>
                  </div>
                  <div className="text-slate-600">
                    <Swords size={40} />
                  </div>
                  <div className="text-center bg-slate-800 rounded-xl p-6 min-w-[80px]">
                    <p className="text-5xl font-bold font-ea-football text-primary">{match.team2_score ?? '-'}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center gap-4 flex-1">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-800 border-4 border-slate-700">
                  <img
                    src={match.team2_logo || 'https://via.placeholder.com/96'}
                    alt={match.team2_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-white font-bold font-zentry text-xl mb-1">{match.team2_name}</p>
                  <p className="text-slate-400 text-sm font-circular-web">{match.team2_tag || 'Team 2'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2 font-circular-web">
                <Calendar size={16} />
                <span>Date programmée</span>
              </div>
              <p className="text-white font-medium font-zentry">
                {new Date(match.scheduled_time).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-slate-300 text-sm mt-1 font-circular-web">
                {new Date(match.scheduled_time).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
              <div className="flex items-center gap-2 text-slate-400 text-sm mb-2 font-circular-web">
                <Flag size={16} />
                <span>Format</span>
              </div>
              <p className="text-white font-medium font-zentry">{match.format || 'Best of 3'}</p>
            </div>

            {match.stream_url && (
              <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30 col-span-2">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-2 font-circular-web">
                  <Radio size={16} />
                  <span>Lien du stream</span>
                </div>
                <a
                  href={match.stream_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors truncate block font-circular-web"
                >
                  {match.stream_url}
                </a>
              </div>
            )}
          </div>

          {match.notes && (
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30">
              <h3 className="text-slate-400 text-sm font-medium mb-2 font-circular-web">Notes</h3>
              <p className="text-white font-circular-web">{match.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-slate-700/30">
            {match.status === 'upcoming' && (
              <button
                onClick={() => {
                  onUpdateResult(match);
                  onClose();
                }}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-ea-football rounded-lg transition-colors"
              >
                <Play size={20} />
                Entrer le résultat
              </button>
            )}
            <button
              onClick={() => {
                onEdit(match);
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600/50 font-circular-web"
            >
              <Edit size={20} />
              Modifier
            </button>
            <button
              onClick={() => {
                onDelete(match);
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/30 font-circular-web"
            >
              <Trash2 size={20} />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Result Entry Modal
const ResultEntryModal = ({ match, onClose, onSubmit }) => {
  const [team1Score, setTeam1Score] = useState(match?.team1_score || 0);
  const [team2Score, setTeam2Score] = useState(match?.team2_score || 0);

  if (!match) return null;

  const handleSubmit = () => {
    onSubmit({
      ...match,
      team1_score: team1Score,
      team2_score: team2Score,
      status: 'completed',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-secondary rounded-xl max-w-2xl w-full border border-slate-700/50 shadow-2xl">
        <div className="p-6 border-b border-slate-700/30">
          <h2 className="text-2xl font-bold font-zentry text-white">Entrer le résultat du match</h2>
          <p className="text-slate-400 mt-1 font-circular-web">{match.tournament_name} - {match.round}</p>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between gap-8">
            <div className="flex-1 text-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border-2 border-slate-700 mx-auto mb-3">
                <img
                  src={match.team1_logo || 'https://via.placeholder.com/80'}
                  alt={match.team1_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-white font-bold font-zentry mb-4">{match.team1_name}</p>
              <input
                type="number"
                min="0"
                value={team1Score}
                onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-800 text-white text-center text-2xl font-bold font-ea-football rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="text-slate-600">
              <Swords size={32} />
            </div>

            <div className="flex-1 text-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-800 border-2 border-slate-700 mx-auto mb-3">
                <img
                  src={match.team2_logo || 'https://via.placeholder.com/80'}
                  alt={match.team2_name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-white font-bold font-zentry mb-4">{match.team2_name}</p>
              <input
                type="number"
                min="0"
                value={team2Score}
                onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-slate-800 text-white text-center text-2xl font-bold font-ea-football rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors font-circular-web"
            >
              Annuler
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-black font-ea-football rounded-lg transition-colors"
            >
              Enregistrer le résultat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Matches Management Component
const MatchesManagement = () => {
  const [filters, setFilters] = useState({
    status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [resultEntryMatch, setResultEntryMatch] = useState(null);

  const filterOptions = {
    status: [
      { value: '', label: 'Tous les statuts' },
      { value: 'live', label: 'En direct' },
      { value: 'upcoming', label: 'À venir' },
      { value: 'completed', label: 'Terminés' },
      { value: 'cancelled', label: 'Annulés' },
      { value: 'disputed', label: 'Contestés' },
    ],
  };

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        
        // Mock data - replace with actual API when ready
        const mockMatches = [
          {
            id: 1,
            tournament_name: 'Championship League 2025',
            round: 'Quarter Finals',
            team1_name: 'Team Alpha',
            team1_tag: 'ALPHA',
            team1_logo: 'https://via.placeholder.com/100',
            team1_score: 2,
            team2_name: 'Team Beta',
            team2_tag: 'BETA',
            team2_logo: 'https://via.placeholder.com/100',
            team2_score: 1,
            scheduled_time: '2025-10-20T15:00:00',
            status: 'completed',
            format: 'Best of 3',
            stream_url: 'https://twitch.tv/example',
          },
          {
            id: 2,
            tournament_name: 'Winter Cup 2025',
            round: 'Semi Finals',
            team1_name: 'Team Gamma',
            team1_tag: 'GAMMA',
            team1_logo: 'https://via.placeholder.com/100',
            team1_score: null,
            team2_name: 'Team Delta',
            team2_tag: 'DELTA',
            team2_logo: 'https://via.placeholder.com/100',
            team2_score: null,
            scheduled_time: '2025-10-25T18:00:00',
            status: 'live',
            format: 'Best of 5',
            stream_url: 'https://twitch.tv/example2',
          },
          {
            id: 3,
            tournament_name: 'Spring Tournament',
            round: 'Finals',
            team1_name: 'Team Epsilon',
            team1_tag: 'EPS',
            team1_logo: 'https://via.placeholder.com/100',
            team1_score: null,
            team2_name: 'Team Zeta',
            team2_tag: 'ZETA',
            team2_logo: 'https://via.placeholder.com/100',
            team2_score: null,
            scheduled_time: '2025-11-01T20:00:00',
            status: 'upcoming',
            format: 'Best of 7',
          },
          {
            id: 4,
            tournament_name: 'Pro League Season 3',
            round: 'Group Stage',
            team1_name: 'Team Phoenix',
            team1_tag: 'PHX',
            team1_logo: 'https://via.placeholder.com/100',
            team1_score: 1,
            team2_name: 'Team Viper',
            team2_tag: 'VPR',
            team2_logo: 'https://via.placeholder.com/100',
            team2_score: 1,
            scheduled_time: '2025-10-18T14:00:00',
            status: 'completed',
            format: 'Best of 3',
          },
          {
            id: 5,
            tournament_name: 'Regional Finals',
            round: 'Round 1',
            team1_name: 'Team Storm',
            team1_tag: 'STRM',
            team1_logo: 'https://via.placeholder.com/100',
            team1_score: null,
            team2_name: 'Team Thunder',
            team2_tag: 'THND',
            team2_logo: 'https://via.placeholder.com/100',
            team2_score: null,
            scheduled_time: '2025-11-05T16:00:00',
            status: 'upcoming',
            format: 'Best of 5',
            stream_url: 'https://twitch.tv/example3',
          },
        ];
        
        setMatches(mockMatches);
        setFilteredMatches(mockMatches);
        
        // Uncomment below when API is ready
        /*
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/matches.php`);
        
        // Check if response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Check if response is JSON
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("La réponse du serveur n'est pas au format JSON");
        }
        
        const data = await response.json();

        if (data.success) {
          setMatches(data.matches);
          setFilteredMatches(data.matches);
        } else {
          throw new Error(data.message || 'Échec de la récupération des matchs');
        }
        */
      } catch (err) {
        console.error('Error fetching matches:', err);
        // Don't show error, just use mock data
        // setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, []);

  useEffect(() => {
    const filtered = matches.filter((match) => {
      const searchMatch =
        searchTerm.trim() === '' ||
        match.tournament_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team1_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.team2_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = filters.status === '' || match.status === filters.status;

      return searchMatch && matchesFilters;
    });

    setFilteredMatches(filtered);
  }, [filters, matches, searchTerm]);

  const stats = {
    total: matches.length,
    live: matches.filter(m => m.status === 'live').length,
    upcoming: matches.filter(m => m.status === 'upcoming').length,
    completed: matches.filter(m => m.status === 'completed').length,
  };

  const handleEdit = (match) => {
    console.log('Edit match:', match);
    window.location.href = `/admin/matches/edit/${match.id}`;
  };

  const handleDelete = (match) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer ce match ?`)) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/matches.php?id=${match.id}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setMatches(matches.filter(m => m.id !== match.id));
            alert('Match supprimé avec succès');
          } else {
            alert('Erreur lors de la suppression');
          }
        })
        .catch(err => {
          console.error(err);
          alert('Erreur lors de la suppression');
        });
    }
  };

  const handleView = (match) => {
    setSelectedMatch(match);
  };

  const handleUpdateResult = (match) => {
    setResultEntryMatch(match);
  };

  const handleSubmitResult = (updatedMatch) => {
    setMatches(matches.map(m => m.id === updatedMatch.id ? updatedMatch : m));
    alert('Résultat enregistré avec succès');
  };

  const handleCreate = () => {
    console.log('Create new match');
    window.location.href = '/admin/new-match';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-slate-700/50 border border-slate-700/50"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-y-auto">
      {/* Header */}
      <div className="bg-secondary border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold font-ea-football text-primary">Gestion des Matchs</h1>
              <p className="text-slate-400 font-circular-web uppercase">Gérez tous les matchs et résultats</p>
            </div>
           
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Swords}
            label="Total Matchs"
            value={stats.total}
            color="blue"
          />
          <StatsCard
            icon={Radio}
            label="En Direct"
            value={stats.live}
            color="green"
          />
          <StatsCard
            icon={Clock}
            label="À Venir"
            value={stats.upcoming}
            color="yellow"
          />
          <StatsCard
            icon={CheckCircle}
            label="Terminés"
            value={stats.completed}
            color="purple"
          />
        </div>

        {/* Filters Section */}
        <div className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Rechercher un match, tournoi ou équipe..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 bg-secondary text-white pl-12 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 font-circular-web"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" size={20} />
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <Dropdown
                label="Statut"
                options={filterOptions.status}
                value={filters.status}
                onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                icon={Filter}
              />
              
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-secondary rounded-lg p-1 border border-slate-700/50">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-slate-700/50 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Vue Liste"
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-slate-700/50 text-white' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Vue Grille"
                >
                  <Grid3x3 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Matches Display */}
        {isLoading ? (
          <div className="p-12 text-center bg-secondary rounded-xl border border-slate-700/50">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-4">Chargement des matchs...</p>
          </div>
        ) : filteredMatches.length === 0 ? (
          <div className="p-12 text-center">
            <X className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-3xl font-ea-football text-slate-300 mb-2">Aucun match trouvé</h3>
            <p className="text-slate-400 mb-6 font-circular-web">Essayez de modifier vos filtres ou créez un nouveau match</p>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
                onUpdateResult={handleUpdateResult}
              />
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-secondary overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f172a]/50 font-ea-football">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Tournoi</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Équipe 1</th>
                    <th className="px-6 py-4 text-center text-slate-400 font-medium">Score</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Équipe 2</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Statut</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Date</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMatches.map((match) => (
                    <MatchRow
                      key={match.id}
                      match={match}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                      onUpdateResult={handleUpdateResult}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Info */}
        {filteredMatches.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-slate-400 text-sm">
            <p>
              Affichage de {filteredMatches.length} match{filteredMatches.length > 1 ? 's' : ''}
            </p>
            <p>Total: {matches.length} match{matches.length > 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {/* Match Details Modal */}
      {selectedMatch && (
        <MatchDetailsModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdateResult={handleUpdateResult}
        />
      )}

      {/* Result Entry Modal */}
      {resultEntryMatch && (
        <ResultEntryModal
          match={resultEntryMatch}
          onClose={() => setResultEntryMatch(null)}
          onSubmit={handleSubmitResult}
        />
      )}
    </div>
  );
};

export default MatchesManagement;