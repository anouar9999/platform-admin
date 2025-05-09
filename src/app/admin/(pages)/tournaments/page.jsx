'use client';
import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Star,
  AlertCircle,
} from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import TournamentCard from '../../TournamentCard';
import { TbTournament } from 'react-icons/tb';

// Enhanced Filter Button Component
const FilterButton = ({ active, label, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
      ${
        active
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      }
    `}
  >
    {Icon && <Icon size={18} />}
    <span>{label}</span>
  </button>
);

// Enhanced Dropdown Component
const Dropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-secondary angular-cut text-gray-300 hover:bg-gray-700 transition-all duration-200"
      >
        {Icon && <Icon size={18} />}
        <span>{value || label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-48 mt-2 bg-gray-800 rounded-lg shadow-xl border border-gray-700"
          >
            {options.map((option) => (
              <button
                key={option.value}
                className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 angular-cut transition-colors duration-200"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Component
const LeagueOfLegendsProfile = () => {
  const [filters, setFilters] = useState({
    bracket_type: '',
    status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

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
      // Check if tournament matches the search term
      const searchMatch =
        searchTerm.trim() === '' ||
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (tournament.description &&
          tournament.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tournament.game_name &&
          tournament.game_name.toLowerCase().includes(searchTerm.toLowerCase()));

      // Check if tournament matches the filters
      const matchesFilters =
        (filters.bracket_type === '' || tournament.bracket_type === filters.bracket_type) &&
        (filters.status === '' || tournament.status === filters.status);

      // Return true only if both conditions are met
      return searchMatch && matchesFilters;
    });

    setFilteredTournaments(filtered);
  }, [filters, tournaments, searchTerm]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex items-center text-primary">
        <TbTournament />
        <p className="mx-2 font-semibold uppercase tracking-wider">THE tournaments</p>
      </div>

      <h1 className="text-3xl flex items-center font-custom tracking-wider">
        EXPLOREZ TOUS LES TOURNOIS.
      </h1>
      <div className="space-y-8">
        {/* Header Section */}

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => setShowFilters(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-lg text-gray-300"
          >
            <Filter size={18} />
            Filtres
          </button>
        </div>

        {/* Search and Filters Section */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Rechercher un tournoi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-secondary text-white angular-cut pl-10 focus:outline-none"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>

          <div className="hidden md:flex gap-3">
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
          </div>
        </div>

        {/* Tournament Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800 rounded-xl h-[400px]" />
              </div>
            ))}
          </div>
        ) : filteredTournaments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <X className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Aucun tournoi trouvé</h3>
            <p className="text-gray-400 text-center">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredTournaments.map((tournament) => (
              <TournamentCard
                key={tournament.id}
                id={tournament.id}
                name={tournament.name}
                startDate={tournament.start_date}
                game={tournament.game}
                endDate={tournament.end_date}
                status={tournament.status}
                description={tournament.description}
                participationType={tournament.participation_type}
                maxParticipants={tournament.max_participants}
                bracketType={tournament.bracket_type}
                matchFormat={tournament.match_format}
                gameName={tournament.game.name}
                image={tournament.featured_image}
                prizePool={tournament.prize_pool}
                slug={tournament.slug}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Filters Dialog */}
      <Transition show={showFilters} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setShowFilters(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-800 shadow-xl rounded-2xl">
              <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white mb-4">
                Filtres
              </Dialog.Title>

              <div className="space-y-4">
                <Dropdown
                  label="Format"
                  options={filterOptions.bracket_type}
                  value={filters.bracket_type}
                  onChange={(value) => {
                    setFilters((prev) => ({ ...prev, bracket_type: value }));
                    setShowFilters(false);
                  }}
                  icon={Filter}
                />
                <Dropdown
                  label="Statut"
                  options={filterOptions.status}
                  value={filters.status}
                  onChange={(value) => {
                    setFilters((prev) => ({ ...prev, status: value }));
                    setShowFilters(false);
                  }}
                  icon={Star}
                />
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default LeagueOfLegendsProfile;
