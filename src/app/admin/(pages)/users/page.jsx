'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Search,
  X,
  Filter,
  ChevronDown,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Users,
  Calendar,
  Award,
  Grid3x3,
  List,
  Shield,
  Mail,
  CheckCircle,
  XCircle,
  Trophy,
  Target,
  User,
  Gamepad2,
  Ban,
  Loader2,
} from 'lucide-react';
import PlayerCard from './UserCard';

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



// Player Row Component for List View
const PlayerRow = ({ player, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="border-b border-slate-700/50 font-circular-web hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {player.profile_picture ? (
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${player.profile_picture}`}
              alt={player.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
              <User size={20} className="text-slate-400" />
            </div>
          )}
          <div>
            <p className="text-white font-zentry tracking-wider">{player.username}</p>
            <p className="text-slate-400 text-sm">{player.email}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-slate-300 capitalize">{player.type || 'User'}</span>
      </td>
      <td className="px-6 py-4 text-slate-300">
        {new Date(player.created_at).toLocaleDateString('fr-FR')}
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
                  onView(player);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 rounded-t-lg flex items-center gap-2"
              >
                <Eye size={16} />
                Voir détails
              </button>
              <button
                onClick={() => {
                  onEdit(player);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-blue-400 hover:bg-slate-700/50 flex items-center gap-2"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={() => {
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
      </td>
    </tr>
  );
};

// Player Details Modal
const PlayerDetailsModal = ({ player, onClose, onEdit, onDelete }) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-secondary rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50 shadow-2xl">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-br from-slate-800/50 to-slate-900/50 overflow-hidden">
          {player.profile_picture ? (
            <>
              <img 
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${player.profile_picture}`} 
                alt={player.username} 
                className="w-full h-full object-cover opacity-30" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-60"></div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="text-slate-600" size={64} />
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
          {/* Player Info */}
          <div className="flex items-start gap-4 mb-6">
            <div className="relative -mt-16">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-slate-800 border-4 border-secondary">
                {player.profile_picture ? (
                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${player.profile_picture}`}
                    alt={player.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User size={48} className="text-slate-400" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 mt-4">
              <h2 className="text-3xl font-bold font-zentry text-white mb-1">{player.username}</h2>
              <p className="text-slate-400 font-circular-web">{player.email}</p>
              <p className="text-primary font-circular-web mt-2 capitalize">Role: {player.type || 'User'}</p>
            </div>
          </div>

          {/* Player Information */}
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/30 mb-6">
            <h3 className="text-white font-zentry text-lg mb-4">Informations du joueur</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Shield className="text-slate-400" size={16} />
                <div>
                  <p className="text-slate-400 text-xs font-circular-web">ID Utilisateur</p>
                  <p className="text-white font-circular-web">#{player.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="text-slate-400" size={16} />
                <div>
                  <p className="text-slate-400 text-xs font-circular-web">Email</p>
                  <p className="text-white font-circular-web">{player.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="text-slate-400" size={16} />
                <div>
                  <p className="text-slate-400 text-xs font-circular-web">Date d'inscription</p>
                  <p className="text-white font-circular-web">
                    {new Date(player.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="text-slate-400" size={16} />
                <div>
                  <p className="text-slate-400 text-xs font-circular-web">Type de compte</p>
                  <p className="text-white font-circular-web capitalize">{player.type || 'User'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700/30">
            <button
              onClick={() => {
                onEdit(player);
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600/50 font-circular-web"
            >
              <Edit size={20} />
              Modifier
            </button>
            <button
              onClick={() => {
                onDelete(player);
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

// Main Players Management Component
const PlayersManagement = () => {
  const [filters, setFilters] = useState({
    type: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const filterOptions = {
    type: [
      { value: '', label: 'Tous les types' },
      { value: 'user', label: 'User' },
      { value: 'admin', label: 'Admin' },
      { value: 'moderator', label: 'Moderator' },
    ],
  };

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`
        );

        if (response.data.success) {
          console.log('Players data:', response.data.users);
          setPlayers(response.data.users);
          setFilteredPlayers(response.data.users);
        } else {
          setError(response.data.error || 'Failed to fetch players');
        }
      } catch (err) {
        console.error('Error fetching players:', err);
        setError('Error fetching players: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const filtered = players.filter((player) => {
      const searchMatch =
        searchTerm.trim() === '' ||
        player.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = filters.type === '' || player.type === filters.type;

      return searchMatch && matchesFilters;
    });

    setFilteredPlayers(filtered);
  }, [filters, players, searchTerm]);

  const stats = {
    total: players.length,
    admins: players.filter(p => p.type === 'admin').length,
    users: players.filter(p => p.type === 'user' || !p.type).length,
    moderators: players.filter(p => p.type === 'moderator').length,
  };

  const handleEdit = (player) => {
    console.log('Edit player:', player);
    // Implement edit functionality
    window.location.href = `/admin/players/edit/${player.id}`;
  };

  const handleDelete = async (player) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${player.username}" ?`)) return;

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`,
        {
          data: { id: player.id },
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.data && response.data.success) {
        setPlayers(players.filter(p => p.id !== player.id));
        alert('Joueur supprimé avec succès');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression: ' + err.message);
    }
  };

  const handleView = (player) => {
    setSelectedPlayer(player);
  };

  const handleCreate = () => {
    window.location.href = '/admin/new-player';
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
              <h1 className="text-4xl font-bold font-ea-football text-primary">Gestion des Joueurs</h1>
              <p className="text-slate-400 font-circular-web uppercase">Gérez tous les joueurs et leurs comptes</p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 font-ea-football text-black transition-colors font-medium"
            >
              <Plus size={20} />
              Nouveau Joueur
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard icon={Users} label="Total Joueurs" value={stats.total} color="blue" />
          <StatsCard icon={CheckCircle} label="Utilisateurs" value={stats.users} color="green" />
          <StatsCard icon={Shield} label="Admins" value={stats.admins} color="yellow" />
          <StatsCard icon={Award} label="Modérateurs" value={stats.moderators} color="purple" />
        </div>

        {/* Filters Section */}
        <div className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Rechercher un joueur, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 bg-secondary text-white pl-12 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 font-circular-web"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" size={20} />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <Dropdown
                label="Type"
                options={filterOptions.type}
                value={filters.type}
                onChange={(value) => setFilters((prev) => ({ ...prev, type: value }))}
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

        {/* Players Display */}
        {isLoading ? (
          <div className="p-12 text-center bg-secondary rounded-xl border border-slate-700/50">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mx-auto" />
            <p className="text-slate-400 mt-4">Chargement des joueurs...</p>
          </div>
        ) : filteredPlayers.length === 0 ? (
          <div className="p-12 text-center">
            <X className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-3xl font-ea-football text-slate-300 mb-2">Aucun joueur trouvé</h3>
            <p className="text-slate-400 mb-6 font-circular-web">Essayez de modifier vos filtres</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ type: '' });
              }}
              className="px-6 py-3 bg-primary hover:bg-primary/90 font-ea-football text-black transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
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
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Joueur</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Type</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Inscrit le</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <PlayerRow
                      key={player.id}
                      player={player}
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

        {/* Pagination Info */}
        {filteredPlayers.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-slate-400 text-sm">
            <p>
              Affichage de {filteredPlayers.length} joueur{filteredPlayers.length > 1 ? 's' : ''}
            </p>
            <p>Total: {players.length} joueur{players.length > 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {/* Player Details Modal */}
      {selectedPlayer && (
        <PlayerDetailsModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
};

export default PlayersManagement;