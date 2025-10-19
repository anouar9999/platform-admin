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
  Sparkles,
} from 'lucide-react';
import { TbTournament } from 'react-icons/tb';
import TournamentCard from '../../components/TournamentCard';

// Stats Card Component with enhanced design
const StatsCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-gradient-to-br from-secondary to-[#0f172a] p-6    transition-all duration-300  group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3   transition-colors duration-300`}>
        <Icon className={`w-9 h-9 ${color === 'blue' ? 'text-blue-400' : color === 'green' ? 'text-green-400' : color === 'purple' ? 'text-purple-400' : 'text-yellow-400'}`} />
      </div>
 
    </div>
    <h3 className="text-slate-400 text-sm font-circular-web mb-2 uppercase ">{label}</h3>
    <p className="text-primary text-4xl font-zentry">{value}</p>
  </div>
);

// Enhanced Dropdown Component
const Dropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-secondary  text-slate-300 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30 hover:border-slate-600/50 font-circular-web"
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
          <div className="absolute z-50 w-48 mt-2 bg-secondary  shadow-2xl border border-slate-700/30 overflow-hidden">
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

// Enhanced Tournament Row with background image
const TournamentRow = ({ tournament, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusStyle = (status) => {
    const styles = {
      registration_open: 'bg-green-500/20 text-green-300 border-green-500/30',
      ongoing: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      completed: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
      cancelled: 'bg-red-500/20 text-red-300 border-red-500/30',
    };
    return styles[status] || styles.completed;
  };

  const getStatusLabel = (status) => {
    const labels = {
      registration_open: 'Ouvert',
      ongoing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  };

  return (
    <tr className="border-b border-slate-700/30 group cursor-pointer relative overflow-hidden hover:bg-slate-800/20 transition-all duration-300">
      {/* Background Image with Gradient Overlay */}
      <td colSpan="7" className="absolute inset-0 p-0 -z-10">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.featured_image}` || 'https://via.placeholder.com/1200x100'}
            alt={tournament.name}
            className="w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-105 transition-all duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/98 to-secondary/80"></div>
        </div>
      </td>

      {/* Content */}
      <td className="px-6 py-5 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${tournament.featured_image}` || 'https://via.placeholder.com/80'}
              alt={tournament.name}
              className="w-16 h-16  object-cover  transition-all duration-300"
            />
          
          </div>
          <div>
            <p className="text-white font-ea-football text-lg group-hover:text-primary transition-colors duration-300">{tournament.name}</p>
            <p className="text-slate-400 text-sm font-circular-web mt-1">{tournament.game?.name || tournament.game_name}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5 relative">
        <span className={`px-4 py-2  text-xs font-medium  font-circular-web inline-flex items-center gap-1`}>
          <div className={`w-2 h-2  ${tournament.status === 'ongoing' || tournament.status === 'registration_open' ? 'animate-pulse' : ''} ${
            tournament.status === 'registration_open' ? 'bg-green-400' : 
            tournament.status === 'ongoing' ? 'bg-blue-400' : 
            tournament.status === 'completed' ? 'bg-slate-400' : 'bg-red-400'
          }`} />
          {getStatusLabel(tournament.status)}
        </span>
      </td>
      <td className="px-6 py-5 text-slate-200 relative font-medium font-circular-web">{tournament.bracket_type}</td>
      <td className="px-6 py-5 text-slate-200 relative font-medium font-circular-web">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          {tournament.current_participants || 0}/{tournament.max_participants}
        </div>
      </td>
      <td className="px-6 py-5 text-slate-200 relative font-medium font-circular-web">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary" />
          {new Date(tournament.start_date).toLocaleDateString('fr-FR')}
        </div>
      </td>
      <td className="px-6 py-5 relative">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          <span className="text-primary font-bold font-circular-web">{tournament.prize_pool || 'N/A'}</span>
        </div>
      </td>
      <td className="px-6 py-5 relative">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-slate-700/50  transition-all duration-200 hover:scale-110"
          >
            <MoreVertical size={18} className="text-slate-300" />
          </button>
          
          {showActions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-secondary  shadow-2xl border border-slate-700/30 z-50 overflow-hidden">
                <button
                  onClick={() => {
                    onView(tournament);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 flex items-center gap-3 transition-colors duration-200 group/item"
                >
                  <Eye size={16} className="group-hover/item:text-primary transition-colors" />
                  <span className="font-circular-web text-sm">Voir les détails</span>
                </button>
                <button
                  onClick={() => {
                    onEdit(tournament);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-3 text-left text-blue-400 hover:bg-slate-700/50 flex items-center gap-3 transition-colors duration-200 group/item"
                >
                  <Edit size={16} className="group-hover/item:scale-110 transition-transform" />
                  <span className="font-circular-web text-sm">Modifier</span>
                </button>
                <button
                  onClick={() => {
                    onDelete(tournament);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-3 text-left text-red-400 hover:bg-slate-700/50 flex items-center gap-3 transition-colors duration-200 group/item"
                >
                  <Trash2 size={16} className="group-hover/item:scale-110 transition-transform" />
                  <span className="font-circular-web text-sm">Supprimer</span>
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// Wrapper component for TournamentCard with admin actions overlay
const AdminTournamentCard = ({ tournament, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative group">
      {/* Admin action overlay */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="p-2.5 bg-secondary/95 backdrop-blur-sm hover:bg-slate-700/95  transition-all duration-200 hover:scale-110 shadow-lg"
        >
          <MoreVertical size={18} className="text-white" />
        </button>
        
        {showActions && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
            <div className="absolute right-0 mt-2 w-52 bg-secondary shadow-2xl border border-slate-700/30 z-50 overflow-hidden">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onView(tournament);
                  setShowActions(false);
                }}
                className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 flex items-center gap-3 transition-colors duration-200"
              >
                <Eye size={16} />
                <span className="font-circular-web text-sm">Voir les détails</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(tournament);
                  setShowActions(false);
                }}
                className="w-full px-4 py-3 text-left text-blue-400 hover:bg-slate-700/50 flex items-center gap-3 transition-colors duration-200"
              >
                <Edit size={16} />
                <span className="font-circular-web text-sm">Modifier</span>
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(tournament);
                  setShowActions(false);
                }}
                className="w-full px-4 py-3 text-left text-red-400 hover:bg-slate-700/50 flex items-center gap-3 transition-colors duration-200"
              >
                <Trash2 size={16} />
                <span className="font-circular-web text-sm">Supprimer</span>
              </button>
            </div>
          </>
        )}
      </div>

      <TournamentCard
        id={tournament.id}
        name={tournament.name}
        startDate={tournament.start_date}
        endDate={tournament.end_date}
        status={tournament.status}
        maxParticipants={tournament.max_participants}
        prizePool={tournament.prize_pool}
        description={tournament.description}
        image={tournament.featured_image}
        bracket_type={tournament.bracket_type}
        slug={tournament.slug}
        game={tournament.game}
        participationType={tournament.participation_type}
        bracketType={tournament.bracket_type}
        format_des_qualifications={tournament.format_des_qualifications}
        registrationStart={tournament.registration_start}
        registrationEnd={tournament.registration_end}
        prizeDistribution={tournament.prize_distribution}
        streamUrl={tournament.stream_url}
        tags={tournament.tags || []}
      />
    </div>
  );
};

// Main Admin Component
const AdminTournamentManagement = () => {
  const [filters, setFilters] = useState({
    bracket_type: '',
    status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  const filterOptions = {
    bracket_type: [
      { value: '', label: 'Tous les formats' },
      { value: 'Single Elimination', label: 'Single Elimination' },
      { value: 'Double Elimination', label: 'Double Elimination' },
      { value: 'Round Robin', label: 'Round Robin' },
    ],
    status: [
      { value: '', label: 'Tous les statuts' },
      { value: 'registration_open', label: 'Ouvert aux inscriptions' },
      { value: 'ongoing', label: 'En cours' },
      { value: 'completed', label: 'Terminé' },
      { value: 'cancelled', label: 'Annulé' },
    ],
  };

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments.php`);
        const data = await response.json();

        if (data.success) {
          setTournaments(data.tournaments);
          setFilteredTournaments(data.tournaments);
        } else {
          throw new Error(data.message || 'Failed to fetch tournaments');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    const filtered = tournaments.filter((tournament) => {
      const searchMatch =
        searchTerm.trim() === '' ||
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tournament.description &&
          tournament.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tournament.game_name &&
          tournament.game_name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesFilters =
        (filters.bracket_type === '' || tournament.bracket_type === filters.bracket_type) &&
        (filters.status === '' || tournament.status === filters.status);

      return searchMatch && matchesFilters;
    });

    setFilteredTournaments(filtered);
  }, [filters, tournaments, searchTerm]);

  const stats = {
    total: tournaments.length,
    active: tournaments.filter(t => t.status === 'ongoing').length,
    participants: tournaments.reduce((sum, t) => sum + (t.current_participants || 0), 0),
    revenue: tournaments.reduce((sum, t) => {
      const prizePool = typeof t.prize_pool === 'string' 
        ? parseFloat(t.prize_pool.replace(/[^0-9.]/g, '')) 
        : (t.prize_pool || 0);
      return sum + prizePool;
    }, 0).toLocaleString('fr-FR'),
  };

  const handleEdit = (tournament) => {
    window.location.href = `/admin/tournaments/edit/${tournament.id}`;
  };

  const handleDelete = (tournament) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${tournament.name}" ?`)) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments.php?id=${tournament.id}`, {
        method: 'DELETE',
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setTournaments(tournaments.filter(t => t.id !== tournament.id));
            alert('Tournoi supprimé avec succès');
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

  const handleView = (tournament) => {
    window.location.href = `/tournaments/${tournament.slug || tournament.id}`;
  };

  const handleCreate = () => {
    window.location.href = '/admin/new-tournament';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="text-center space-y-6 p-8">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-3xl "></div>
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto relative" />
          </div>
          <div>
            <h2 className="text-2xl font-ea-football text-white mb-2">Une erreur est survenue</h2>
            <p className="text-red-400 text-lg font-circular-web">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-secondary text-white  hover:bg-slate-700/50 border border-slate-700/50 transition-all duration-200 font-circular-web"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-y-auto">
      {/* Enhanced Header with gradient */}
      <div className="bg-gradient-to-r from-secondary via-secondary to-[#0f172a] border-b border-slate-700/30 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="">
              <div className="flex items-center ">
                
                <h1 className="text-3xl font-bold font-zentry text-primary ">Gestion des Tournois</h1>
              </div>
              <p className="text-slate-400 font-circular-web text-sm uppercase  ml-14">
                Gérez tous vos tournois depuis un seul endroit
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-3 px-6 py-2 bg-primary hover:bg-primary/90 font-zentry text-black transition-all duration-300   hover:shadow-primary/20 text-lg"
            >
              <Plus size={22} />
              Nouveau Tournoi
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatsCard icon={Award} label="Total Tournois" value={stats.total} trend={12} color="blue" />
          <StatsCard icon={TrendingUp} label="Tournois Actifs" value={stats.active} color="green" />
          <StatsCard icon={Users} label="Participants" value={stats.participants} trend={8} color="purple" />
          <StatsCard icon={Calendar} label="Prize Pool Total" value={stats.revenue} trend={15} color="yellow" />
        </div>

        {/* Enhanced Filters Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Rechercher un tournoi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 bg-secondary text-white  pl-12 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 font-circular-web"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" size={20} />
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <Dropdown
                label="Format"
                options={filterOptions.bracket_type}
                value={filters.bracket_type}
                onChange={(value) => setFilters((prev) => ({ ...prev, bracket_type: value }))}
                icon={Filter}
              />
              <Dropdown
                label="Statut"
                options={filterOptions.status}
                value={filters.status}
                onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                icon={Star}
              />
              
              {/* Enhanced View Toggle */}
              <div className="flex items-center gap-1 bg-secondary rounded-xl p-1.5 border border-slate-700/30">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-primary text-black shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                  title="Vue Liste"
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-primary text-black shadow-lg' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                  }`}
                  title="Vue Grille"
                >
                  <Grid3x3 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Display */}
        {isLoading ? (
          <div className="p-20 text-center  rounded-2xl ">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
              <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto relative"></div>
            </div>
            <p className="text-slate-400 mt-6 font-circular-web text-lg">Chargement des tournois...</p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="p-20 text-center">
            <X className="w-16 h-16 text-slate-500 mx-auto mb-6 opacity-50" />
            <h3 className="text-4xl font-ea-football text-slate-300 mb-3">Aucun tournoi trouve</h3>
            <p className="text-slate-400 mb-8 font-circular-web text-lg">Essayez de modifier vos filtres ou créez un nouveau tournoi</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <AdminTournamentCard
                key={tournament.id}
                tournament={tournament}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        ) : (
          <div className="bg-secondary rounded-2xl overflow-hidden border border-slate-700/30 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f172a]/70 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-5 text-left text-slate-300 font-ea-football text-lg">Tournoi</th>
                    <th className="px-6 py-5 text-left text-slate-300 font-ea-football text-lg">Statut</th>
                    <th className="px-6 py-5 text-left text-slate-300 font-ea-football text-lg">Format</th>
                    <th className="px-6 py-5 text-left text-slate-300 font-ea-football text-lg">Participants</th>
                    <th className="px-6 py-5 text-left text-slate-300 font-ea-football text-lg">Date</th>
                    <th className="px-6 py-5 text-left text-slate-300 font-ea-football text-lg">Prize</th>
                    <th className="px-6 py-5 text-left text-slate-300 font-ea-football text-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTournaments.map((tournament) => (
                    <TournamentRow
                      key={tournament.id}
                      tournament={tournament}
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

        {/* Enhanced Pagination Info */}
        {filteredTournaments.length > 0 && (
          <div className="mt-8 flex items-center justify-between text-slate-400 font-circular-web p-4 bg-secondary/30 rounded-xl border border-slate-700/20">
            <p className="text-sm">
              Affichage de <span className="text-primary font-bold">{filteredTournaments.length}</span> tournoi{filteredTournaments.length > 1 ? 's' : ''}
            </p>
            <p className="text-sm">
              Total: <span className="text-primary font-bold">{tournaments.length}</span> tournoi{tournaments.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTournamentManagement;