'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  TrendingDown,
  Minus,
  Award,
  Shield,
  CheckCircle,
  Clock,
  Trophy,
  Target,
  Mail,
  Phone,
  MapPin,
  List,
} from 'lucide-react';

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, color }) => (
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

// Team Card Component for Grid View
const TeamCard = ({ team, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);
  const memberCount = team.members?.length || team.total_members || 0;
  const organizerName = team.owner_username || 'Team Owner';

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
                onView(team);
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
                onEdit(team);
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
                onDelete(team.id);
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

      <div
        className="bg-black angular-cut overflow-hidden cursor-pointer 
                   transition-all duration-300  
                   border border-gray-800/50 h-full flex flex-col relative"
        onClick={() => onView(team)}
      >
        {/* Header with background pattern/image */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-black">
          {team.logo ? (
            <div className="relative w-full h-full">
              <img
                className="w-full h-full object-cover opacity-30 hover:scale-105 transition-transform duration-500"
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`}
                alt={`${team.name} banner`}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black"></div>
            </div>
          ) : (
            <div className="w-full h-full relative">
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
              </div>
            </div>
          )}

          {/* Team logo and info section (moved out of header for proper overlap) */}
        </div>
          <div className="px-6 -mt-16 pb-4 z-50">
            <div className="flex items-center gap-4">
              {/* Team logo */}
              <div className="w-14 h-14 border-4 border-gray-900 bg-gray-800 shadow-xl flex-shrink-0 flex items-center justify-center rounded-full">
                {team.logo ? (
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`}
                    alt={`${team.name} logo`}
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-gray-700 to-gray-800">
                    <Users className="w-8 h-8 text-gray-500" />
                  </div>
                )}
              </div>
              {/* Team info next to logo */}
              <div className="flex flex-col min-w-0 font-circular-web">
                <h3 className="text-white font-zentry text-xl mb-1 truncate">{team.name}</h3>
                <div className="flex items-center gap-1.5 text-md text-gray-400 mb-1">
                  <span>Organisé(e) par</span>
                  <span className="text-primary font-bold uppercase">
                    {team.owner_username || 'Team Owner'}
                  </span>
                  {team.verified && (
                    <svg
                      className="w-4 h-4 text-blue-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <p className="text-gray-400 text-md">{memberCount.toLocaleString()} membres</p>
              </div>
            </div>
          </div>

        {/* Content section */}
        <div className="px-6 pb-6 flex-1 flex flex-col">
            
          {/* Description preview */}
          {team.description && (
            <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed font-circular-web">
              {team.description}
            </p>
          )}

          {/* Stats section */}
          <div className="flex items-center justify-between py-4 px-4 bg-black/30 rounded-lg border border-gray-800/50 mt-auto">
            <div className="flex flex-col items-center flex-1">
              <span className="text-white font-zentry text-xl">
                {team.game?.name || team.team_game || 'Game'}
              </span>
              <span className="text-primary font-circular-web font-bold text-xs mt-1">Game Team</span>
            </div>

            <div className="w-px h-12 bg-gray-800"></div>

            <div className="flex flex-col items-center flex-1">
              <div className="flex items-center gap-1 mb-1">
                <div className="w-7 h-7 rounded-full flex items-center justify-center">
                  <div className="w-3.5 h-3.5 rounded-full font-zentry text-white text-lg">
                    {memberCount}
                  </div>
                </div>
              </div>
              <span className="text-primary font-circular-web font-bold text-xs">Members</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Team Row Component for List View
const TeamRow = ({ team, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="border-b border-slate-700/50 font-circular-web hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {team.logo ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`}
              alt={team.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {team.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <p className="text-white font-zentry tracking-wider">{team.name}</p>
            <p className="text-slate-400 text-sm">{team.tag || 'N/A'}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-slate-300">{team.game?.name || team.team_game || 'N/A'}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-slate-300 font-ea-football">{team.total_members || 0}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-green-400 font-ea-football">{team.wins || 0}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-red-400 font-ea-football">{team.losses || 0}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <span className="text-primary font-ea-football font-bold">{team.win_rate || 0}%</span>
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
                  onView(team);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 rounded-t-lg flex items-center gap-2"
              >
                <Eye size={16} />
                Voir détails
              </button>
              <button
                onClick={() => {
                  onEdit(team);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-blue-400 hover:bg-slate-700/50 flex items-center gap-2"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={() => {
                  onDelete(team.id);
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

// Team Details Modal
const TeamDetailsModal = ({ team, onClose, onEdit, onDelete }) => {
  if (!team) return null;

  const matches = (team.wins || 0) + (team.losses || 0) + (team.draws || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-secondary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50 shadow-2xl">
        <div className="relative h-40 bg-gradient-to-br from-slate-800/50 to-slate-900/50 overflow-hidden">
          {team.banner ? (
            <>
              <img 
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.banner}`} 
                alt={team.name} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-60"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Shield className="text-slate-600" size={64} />
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-secondary/90 hover:bg-slate-700/90 rounded-lg transition-colors"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative -mt-16">
              <div className="w-32 h-32 rounded-xl overflow-hidden bg-slate-800 border-4 border-secondary">
                {team.logo ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`}
                    alt={team.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl font-bold text-white">
                      {team.name.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 mt-4">
              <h2 className="text-3xl font-bold font-zentry text-white mb-1">{team.name}</h2>
              <p className="text-slate-400 font-circular-web text-lg">{team.tag || 'N/A'}</p>
              {team.game && (
                <p className="text-primary font-circular-web mt-2">{team.game.name || team.team_game}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30 text-center">
              <Users className="text-blue-400 mx-auto mb-2" size={24} />
              <p className="text-slate-400 text-xs font-circular-web mb-1">Membres</p>
              <p className="text-white text-2xl font-bold font-ea-football">{team.total_members || 0}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30 text-center">
              <Trophy className="text-yellow-400 mx-auto mb-2" size={24} />
              <p className="text-slate-400 text-xs font-circular-web mb-1">Matchs</p>
              <p className="text-white text-2xl font-bold font-ea-football">{matches}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30 text-center">
              <Target className="text-green-400 mx-auto mb-2" size={24} />
              <p className="text-slate-400 text-xs font-circular-web mb-1">Victoires</p>
              <p className="text-white text-2xl font-bold font-ea-football">{team.wins || 0}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30 text-center">
              <Star className="text-purple-400 mx-auto mb-2" size={24} />
              <p className="text-slate-400 text-xs font-circular-web mb-1">Win Rate</p>
              <p className="text-white text-2xl font-bold font-ea-football">{team.win_rate || 0}%</p>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30 mb-6">
            <h3 className="text-white font-zentry text-lg mb-4">Statistiques détaillées</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex justify-between">
                <span className="text-slate-400 font-circular-web">Victoires</span>
                <span className="text-green-400 font-ea-football font-bold">{team.wins || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-circular-web">Défaites</span>
                <span className="text-red-400 font-ea-football font-bold">{team.losses || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-circular-web">Nuls</span>
                <span className="text-slate-400 font-ea-football font-bold">{team.draws || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-circular-web">Total Matchs</span>
                <span className="text-white font-ea-football font-bold">{matches}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-700/30">
            <button
              onClick={() => {
                onEdit(team);
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600/50 font-circular-web"
            >
              <Edit size={20} />
              Modifier
            </button>
            <button
              onClick={() => {
                onDelete(team.id);
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

// Main Teams Management Component
const TeamsManagement = () => {
  const [filters, setFilters] = useState({
    game: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [teams, setTeams] = useState([]);
  const [filteredTeams, setFilteredTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const filterOptions = {
    game: [
      { value: '', label: 'Tous les jeux' },
    ],
  };

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_teams.php`);
        
        if (response.data.success) {
          console.log('Teams data:', response.data.data);
          setTeams(response.data.data || []);
          setFilteredTeams(response.data.data || []);
          
          // Extract unique games for filter
          const games = [...new Set(response.data.data.map(t => t.team_game))].filter(Boolean);
          games.forEach(game => {
            if (!filterOptions.game.find(opt => opt.value === game)) {
              filterOptions.game.push({ value: game, label: game });
            }
          });
        } else {
          setError(response.data.error || 'Failed to fetch teams');
        }
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError('Error fetching teams: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  useEffect(() => {
    const filtered = teams.filter((team) => {
      const searchMatch =
        searchTerm.trim() === '' ||
        team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (team.tag && team.tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (team.team_game && team.team_game.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilters = filters.game === '' || team.team_game === filters.game;

      return searchMatch && matchesFilters;
    });

    setFilteredTeams(filtered);
  }, [filters, teams, searchTerm]);

  const stats = {
    total: teams.length,
    totalMembers: teams.reduce((sum, t) => sum + (t.total_members || 0), 0),
    totalWins: teams.reduce((sum, t) => sum + (t.wins || 0), 0),
    avgWinRate: teams.length > 0
      ? Math.round(teams.reduce((sum, t) => sum + (parseFloat(t.win_rate) || 0), 0) / teams.length)
      : 0,
  };

  const handleEdit = (team) => {
    console.log('Edit team:', team);
    // You can implement edit modal here or redirect
    window.location.href = `/admin/teams/edit/${team.id}`;
  };

  const handleDelete = async (teamId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette équipe ?')) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete_team.php`,
        { data: { team_id: teamId } }
      );

      if (response.data.success) {
        setTeams(teams.filter(t => t.id !== teamId));
        alert('Équipe supprimée avec succès');
      } else {
        alert(response.data.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  const handleView = (team) => {
    setSelectedTeam(team);
  };

  const handleCreate = () => {
    window.location.href = '/admin/new-team';
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
      <div className="bg-secondary border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold font-ea-football text-primary">Gestion des Équipes</h1>
              <p className="text-slate-400 font-circular-web uppercase">Gérez toutes les équipes et leurs membres</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 font-ea-football text-black transition-colors font-medium"
            >
              <Plus size={20} />
              Nouvelle Équipe
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard icon={Shield} label="Total Équipes" value={stats.total} color="blue" />
          <StatsCard icon={Users} label="Total Membres" value={stats.totalMembers} color="green" />
          <StatsCard icon={Trophy} label="Total Victoires" value={stats.totalWins} color="yellow" />
          <StatsCard icon={Target} label="Win Rate Moyen" value={`${stats.avgWinRate}%`} color="purple" />
        </div>

        <div className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Rechercher une équipe, tag ou jeu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 bg-secondary text-white pl-12 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 font-circular-web"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" size={20} />
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <Dropdown
                label="Jeu"
                options={filterOptions.game}
                value={filters.game}
                onChange={(value) => setFilters((prev) => ({ ...prev, game: value }))}
                icon={Filter}
              />
              
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
                  <Users size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center bg-secondary rounded-xl border border-slate-700/50">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-4">Chargement des équipes...</p>
          </div>
        ) : filteredTeams.length === 0 ? (
          <div className="p-12 text-center">
            <X className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-3xl font-ea-football text-slate-300 mb-2">Aucune équipe trouvée</h3>
            <p className="text-slate-400 mb-6 font-circular-web">Essayez de modifier vos filtres ou créez une nouvelle équipe</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredTeams.map((team) => (
              <TeamCard
                key={team.id}
                team={team}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        ) : (
          <div className="bg-secondary overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f172a]/50 font-ea-football">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Équipe</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Jeu</th>
                    <th className="px-6 py-4 text-center text-slate-400 font-medium">Membres</th>
                    <th className="px-6 py-4 text-center text-slate-400 font-medium">Victoires</th>
                    <th className="px-6 py-4 text-center text-slate-400 font-medium">Défaites</th>
                    <th className="px-6 py-4 text-center text-slate-400 font-medium">Win Rate</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeams.map((team) => (
                    <TeamRow
                      key={team.id}
                      team={team}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredTeams.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-slate-400 text-sm">
            <p>
              Affichage de {filteredTeams.length} équipe{filteredTeams.length > 1 ? 's' : ''}
            </p>
            <p>Total: {teams.length} équipe{teams.length > 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {selectedTeam && (
        <TeamDetailsModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default TeamsManagement;