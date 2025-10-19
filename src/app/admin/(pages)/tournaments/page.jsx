'use client';
import React, { useState, useEffect, useRef } from 'react';
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
} from 'lucide-react';
import { TbTournament } from 'react-icons/tb';
import TournamentCard from '../../components/TournamentCard';

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-gradient-to-br from-[#1a2332] to-[#0f172a] p-4    transition-all duration-300  group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3   transition-colors duration-300`}>
        <Icon
          className={`w-6 h-6 ${
            color === 'blue'
              ? 'text-blue-400'
              : color === 'green'
              ? 'text-green-400'
              : color === 'purple'
              ? 'text-purple-400'
              : 'text-yellow-400'
          }`}
        />
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-circular-web mb-2 uppercase ">{label}</h3>
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
        className="flex items-center gap-2 px-4 py-3 bg-[#1a2332]  text-slate-300 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30 hover:border-slate-600/50 font-circular-web"
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
          <div className="absolute z-50 w-48 mt-2 bg-[#1a2332]  shadow-2xl border border-slate-700/30 overflow-hidden">
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

// Tournament Row Component for List View with Admin Actions
const TournamentRow = ({ tournament, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusStyle = (status) => {
    const styles = {
      registration_open: 'bg-green-500/10 text-green-500',
      ongoing: 'bg-blue-500/10 text-blue-500',
      completed: 'bg-slate-500/10 text-slate-400',
      cancelled: 'bg-red-500/10 text-red-500',
    };
    return styles[status] || styles.completed;
  };

  const getStatusLabel = (status) => {
    const labels = {
      registration_open: 'Inscriptions ouvertes',
      ongoing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  };

  return (
    <tr onClick={()=> onView(tournament)} className="border-b border-slate-700/50 font-circular-web hover:bg-slate-800/30 transition-colors hover:cursor-pointer">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={
              `http://localhost/${tournament.featured_image}` || 'https://via.placeholder.com/80'
            }
            alt={tournament.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="text-white font-zentry tracking-wider">{tournament.name}</p>
            <p className="text-slate-400 text-sm">
              {tournament.game?.name || tournament.game_name}
            </p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 font-valorant">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
            tournament.status,
          )}`}
        >
          {getStatusLabel(tournament.status)}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-300">{tournament.bracket_type}</td>
      <td className="px-6 py-4 text-slate-300">
        {tournament.current_participants || 0}/{tournament.max_participants}
      </td>
      <td className="px-6 py-4 text-slate-300">
        {new Date(tournament.start_date).toLocaleDateString('fr-FR')}
      </td>
      <td className="px-6 py-4 text-primary font-ea-football">
        {tournament.prize_pool || 'N/A'} DH
      </td>
      {/* <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-slate-400" />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1a2332] rounded-lg shadow-xl border border-slate-700/50 z-10">
              <button
                onClick={() => {
                  onView(tournament);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 rounded-t-lg flex items-center gap-2"
              >
                <Eye size={16} />
                Voir les détails
              </button>
              <button
                onClick={() => {
                  onEdit(tournament);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-blue-400 hover:bg-slate-700/50 flex items-center gap-2"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={() => {
                  onDelete(tournament);
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
      </td> */}
    </tr>
  );
};

// Wrapper component for TournamentCard with admin actions overlay
const AdminTournamentCard = ({ tournament, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowActions(false);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  return (
    <div className="relative group">
      {/* Admin action overlay - appears on hover */}
      <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div ref={dropdownRef} className="relative">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-2.5 bg-[#1a2332]/95 backdrop-blur-sm hover:bg-slate-700/90 rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-slate-600/50 shadow-lg"
            aria-label="Actions"
          >
            <MoreVertical size={18} className="text-white" />
          </button>

          {showActions && (
            <div className="absolute right-0 mt-2 w-52 bg-[#1a2332] rounded-lg shadow-2xl border border-slate-700/50 overflow-hidden animate-fadeIn">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onView(tournament);
                  setShowActions(false);
                }}
                className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 flex items-center gap-3 group/item"
              >
                <div className="p-1.5 rounded-md bg-blue-500/10 group-hover/item:bg-blue-500/20 transition-colors">
                  <Eye size={16} className="text-blue-400" />
                </div>
                <span className="font-medium text-sm">Voir les détails</span>
              </button>

              <div className="h-px bg-slate-700/50 mx-2" />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(tournament);
                  setShowActions(false);
                }}
                className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 flex items-center gap-3 group/item"
              >
                <div className="p-1.5 rounded-md bg-green-500/10 group-hover/item:bg-green-500/20 transition-colors">
                  <Edit size={16} className="text-green-400" />
                </div>
                <span className="font-medium text-sm">Modifier</span>
              </button>

              <div className="h-px bg-slate-700/50 mx-2" />

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(tournament);
                  setShowActions(false);
                }}
                className="w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all duration-200 flex items-center gap-3 group/item"
              >
                <div className="p-1.5 rounded-md bg-red-500/10 group-hover/item:bg-red-500/20 transition-colors">
                  <Trash2 size={16} className="text-red-400" />
                </div>
                <span className="font-medium text-sm">Supprimer</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Original TournamentCard */}
      <div className="transition-all duration-200 group-hover:shadow-xl">
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

      {/* CSS for fade-in animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
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
  const [viewMode, setViewMode] = useState('grid'); // 'list' or 'grid'

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
          console.log(data.tournaments);
        } else {
          console.log(data);
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
    active: tournaments.filter((t) => t.status === 'ongoing').length,
    participants: tournaments.reduce((sum, t) => sum + (t.current_participants || 0), 0),
    revenue: tournaments
      .reduce((sum, t) => {
        const prizePool =
          typeof t.prize_pool === 'string'
            ? parseFloat(t.prize_pool.replace(/[^0-9.]/g, ''))
            : t.prize_pool || 0;
        return sum + prizePool;
      }, 0)
      .toLocaleString('fr-FR'),
  };

  const handleEdit = (tournament) => {
    console.log('Edit tournament:', tournament);
    window.location.href = `/admin/tournaments/edit/${tournament.id}`;
  };

  const handleDelete = (tournament) => {
    console.log('Delete tournament:', tournament);
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${tournament.name}" ?`)) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments.php?id=${tournament.id}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setTournaments(tournaments.filter((t) => t.id !== tournament.id));
            alert('Tournoi supprimé avec succès');
          } else {
            alert('Erreur lors de la suppression');
          }
        })
        .catch((err) => {
          console.error(err);
          alert('Erreur lors de la suppression');
        });
    }
  };

  const handleView = (tournament) => {
    console.log('View tournament:', tournament);
    window.location.href = `/admin/tournament/${tournament.slug || tournament.id}`;
  };

  const handleCreate = () => {
    console.log('Create new tournament');
    window.location.href = '/admin/new-tournament';
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#1a2332] text-white rounded-lg hover:bg-slate-700/50 border border-slate-700/50"
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
      <div className="bg-[#1a2332] border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold font-ea-football text-primary">
                Gestion des Tournois
              </h1>
              <p className="text-slate-400 font-circular-web     ">
                Gérez tous vos tournois depuis un seul endroit
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 font-ea-football text-black transition-colors font-medium"
            >
              <Plus size={20} />
              Nouveau Tournoi
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={Award}
            label="Total Tournois"
            value={stats.total}
            trend={12}
            color="blue"
          />
          <StatsCard icon={TrendingUp} label="Tournois Actifs" value={stats.active} color="green" />
          <StatsCard
            icon={Users}
            label="Participants"
            value={stats.participants}
            trend={8}
            color="purple"
          />
          <StatsCard
            icon={Calendar}
            label="Prize Pool Total"
            value={stats.revenue}
            trend={15}
            color="yellow"
          />
        </div>

        {/* Filters Section */}
        <div className=" p-6 mb-6 ">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Rechercher un tournoi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 bg-[#1a2332] text-white  pl-12 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 font-circular-web"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors"
                size={20}
              />
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

              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-[#1a2332] rounded-lg p-1 border border-slate-700/50">
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

        {/* Tournament Display */}
        {isLoading ? (
          <div className="p-12 text-center  ">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-4 font-zentry text-2xl">Chargement des tournois...</p>
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="p-12 text-center ">
            <X className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-3xl font-ea-football text-slate-300 mb-2">Aucun tournoi trouve</h3>
            <p className="text-slate-400 mb-6 font-circular-web   ">
              Essayez de modifier vos filtres ou créez un nouveau tournoi
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View with TournamentCard
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTournaments.map((tournament) => (
              <>
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              </>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-[#1a2332]   overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f172a]/50 font-ea-football">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Tournoi</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Statut</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Format</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Participants</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">
                      Date de début
                    </th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Prize Pool</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTournaments.map((tournament) => (
                    <TournamentRow
                      key={tournament.id}
                      tournament={tournament}
                   
                      onView={handleView}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Info */}
        {filteredTournaments.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-slate-400 text-sm">
            <p>
              Affichage de {filteredTournaments.length} tournoi
              {filteredTournaments.length > 1 ? 's' : ''}
            </p>
            <p>
              Total: {tournaments.length} tournoi{tournaments.length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTournamentManagement;
