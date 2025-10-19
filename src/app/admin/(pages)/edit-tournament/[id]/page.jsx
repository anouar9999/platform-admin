'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Check, User, Users, ArrowLeft } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useToast } from '@/utils/ToastProvider';
import LoadingOverlay from '../../tournament/[slug]/Loading';
import CompetitionTypeSelector from './CompetitionType';
import ParticipantInput from '../../new-tournament/participantInput';
import TeamSizeInput from '../../new-tournament/TeamInput';
import PrizePoolInput from '../../new-tournament/numberInput';
export const runtime = 'edge';

const ParticipationTypeToggle = ({ value, onChange, disabled }) => {
  const types = [
    { id: 'participant', icon: User, label: 'Participant Individuel' },
    { id: 'team', icon: Users, label: 'Équipe' },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-2">Type de Participation</label>
      <div className="grid grid-cols-2 gap-4">
        {types.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onChange({ target: { name: 'participation_type', value: id } })}
            className={`
              relative flex items-center angular-cut p-3 rounded-lg bg-gray-800 transition-all duration-200
              ${value === id ? ' bg-primary/10 text-primary' : '  text-gray-300'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <div className="flex items-center space-x-2">
              <Icon className={`w-5 h-5 ${value === id ? 'text-primary' : 'text-gray-400'}`} />
              <span className="font-medium">{label}</span>
            </div>

            {value === id && (
              <div className="absolute top-2 right-2">
                <Check className="w-4 h-4 text-primary" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

const TournamentEdit = () => {
  const router = useRouter();
  const { id } = useParams();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [games, setGames] = useState([]);

  const [formData, setFormData] = useState({
    id: id,
    name: '',
    competition_type: '',
    participation_type: 'participant',
    nombre_maximum: '',
    start_date: '',
    end_date: '',
    status: '',
    description_des_qualifications: '',
    rules: '',
    prize_pool: '',
    format_des_qualifications: 'Single Elimination',
    type_de_match: '',
    type_de_jeu: '',
    image: '',
  });

  const statusOptions = ['registration_open', 'registration_closed', 'ongoing', 'completed', 'cancelled'];
  const bracketTypes = ['Single Elimination', 'Double Elimination', 'Round Robin', 'Battle Royale'];

  // Fetch tournament data
  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_tournament.php?id=${id}`,
        );
        if (!response.ok) {
          throw new Error('Failed to fetch tournament data');
        }
        const data = await response.json();
        if (data.success) {
          console.log("Tournament data:", data.data);
          
          // Map database fields to form fields
          const tournament = data.data;
          const formattedData = {
            id: tournament.id,
            name: tournament.name,
            competition_type: tournament.game_id,
            participation_type: tournament.participation_type || 'participant',
            nombre_maximum: tournament.max_participants,
            start_date: formatDate(tournament.start_date),
            end_date: formatDate(tournament.end_date),
            status: tournament.status,
            description_des_qualifications: tournament.description,
            rules: tournament.rules,
            prize_pool: tournament.prize_pool,
            format_des_qualifications: tournament.bracket_type,
            type_de_match: tournament.match_format,
            type_de_jeu: tournament.game_name || '',
          };
          
          setFormData(formattedData);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Error fetching tournament data:', error);
        showToast('Failed to load tournament data. Please try again.', 'error', 1500);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [id]);

  // Fetch available games
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/all_games.php`);
        const data = await response.json();
  
        if (data.success) {
          setGames(data.games);
          console.log("Available games:", data.games);
        } else {
          throw new Error(data.message || 'Failed to fetch games');
        }
      } catch (err) {
        console.error("Error fetching games:", err);
        setError(err.message);
      }
    };
   
    fetchGames();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target || {};

    // Handle direct value passed (for competition_type)
    if (typeof e === 'string') {
      setFormData(prev => ({ ...prev, competition_type: e }));
      return;
    }

    if (type === 'file') {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showToast("L'image ne doit pas dépasser 5MB", 'error', 5000);
          return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          showToast("Format d'image non supporté. Utilisez JPG, PNG ou GIF", 'error', 5000);
          return;
        }

        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name || 'competition_type']: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);

      // Log the data being sent
      console.log('Submitting tournament data:', formData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edit_tournament.php`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();
      console.log('Response:', data);

      if (data.success) {
        showToast(data.message || 'Tournament updated successfully', 'success', 3000);
        setTimeout(() => {
          router.push('/admin/tournaments');
        }, 1500);
      } else {
        showToast(data.message || 'Error updating tournament', 'error', 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      showToast('An error occurred while updating the tournament', 'error', 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = (data) => {
    showToast(data.message || 'Tournament has been reset successfully', 'success', 3000);
  };

  if (loading) return <LoadingOverlay text="Loading tournament data..." />;
  if (submitting) return <LoadingOverlay text="Submitting changes..." />;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  
  return (
    <div className="text-gray-300 min-h-screen p-4">
      <div className="mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl lg:text-5xl font-custom mb-2">MODIFIER LE TOURNOI</h1>
            <p className="text-gray-500">Modifiez les détails du tournoi #{id}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg angular-cut"
          >
            <ArrowLeft size={16} className="mr-2" />
            Retour
          </button>
        </div>

        <div className="space-y-8">
          {/* Competition Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Jeu</label>
            <CompetitionTypeSelector
              competitionTypes={games}
              selectedType={formData.competition_type}
              onChange={(value) => handleChange(value)}
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nom du Tournoi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                  required
                />
              </div>

              <ParticipationTypeToggle
                value={formData.participation_type}
                onChange={handleChange}
                disabled={false}
              />
            </div>

            {/* Dates and Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Date de Début</label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Date de Fin</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Statut</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.replace('_', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Participants and Prize Pool */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {formData.participation_type === 'team' ? (
                <TeamSizeInput value={formData.nombre_maximum} onChange={handleChange} />
              ) : (
                <ParticipantInput value={formData.nombre_maximum} onChange={handleChange} />
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Format du Tournoi</label>
                <select
                  name="format_des_qualifications"
                  value={formData.format_des_qualifications}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                >
                  {bracketTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <PrizePoolInput value={formData.prize_pool} onChange={handleChange} />
            </div>

            {/* Description and Rules */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description du Tournoi
                </label>
                <textarea
                  name="description_des_qualifications"
                  value={formData.description_des_qualifications}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                  rows="4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Règles du Tournoi</label>
                <textarea
                  name="rules"
                  value={formData.rules}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                  rows="4"
                />
              </div>
            </div>

            {/* Match Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Format des Matchs</label>
                <input
                  type="text"
                  name="type_de_match"
                  placeholder="Ex: Best of 3, Single Match, etc."
                  value={formData.type_de_match}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type de Jeu</label>
                <input
                  type="text"
                  name="type_de_jeu"
                  placeholder="Ex: 5v5, Battle Royale, etc."
                  value={formData.type_de_jeu}
                  onChange={handleChange}
                  className="w-full bg-gray-800 p-3 rounded-lg angular-cut"
                />
              </div>
            </div>

            {/* Tournament Management */}
            <div className=" pt-6 mt-6">
              
              <div className="flex justify-end items-end">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-3 bg-primary font-ea-football text-black  angular-cut hover:bg-primary/90 transition-colors"
                  >
                    METTRE A JOUR LE TOURNOI
                  </button>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TournamentEdit;