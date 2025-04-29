'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircleIcon } from 'lucide-react';
import axios from 'axios';
import { HeroSection } from './HeroSection';
import TransparentLoader from './Loader';
import { useToast } from '@/utils/ToastProvider';
import TabComponent from './TabComponent';
import { formatDate } from '@/utils/helpers';

const TournamentPage = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [tournament, setTournament] = useState(null);
  const [gameData, setGameData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [gameLoading, setGameLoading] = useState(false);
  const [load, setLoad] = useState(false);

  const [error, setError] = useState(null);
  const [showGlow, setShowGlow] = useState(false);
  const [glowColor, setGlowColor] = useState('green');
  const { showToast } = useToast();

  const { slug } = useParams();
  const router = useRouter();
  // Calculate days remaining until end date
  function calculateDaysRemaining(endDate) {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = Math.max(0, end - today);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Calculate total days between start and end date
  function calculateTotalDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    return diffDays;
  }

  // Calculate total rounds based on tournament format and participant count
  function calculateTotalRounds(participants, bracketType) {
    if (bracketType === 'Single Elimination') {
      return Math.ceil(Math.log2(participants));
    } else if (bracketType === 'Double Elimination') {
      return Math.ceil(Math.log2(participants)) * 2 - 1;
    } else if (bracketType === 'Round Robin') {
      return participants - 1;
    }
    // Default fallback
    return Math.ceil(Math.log2(participants));
  }
  // Fetch tournament data
  useEffect(() => {
    const fetchTournament = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/single_tournament.php?slug=${slug}`,
        );
        const data = await response.json();

        if (data.success) {
          setTournament(data.tournament);
          console.log('Tournament data loaded:', data.tournament);

          // Once we have the tournament, fetch the game data
          if (data.tournament && data.tournament.id) {
            await fetchGameData(data.tournament.id);
          }
        } else {
          setError(data.error || 'Failed to fetch tournament data');
        }
      } catch (error) {
        console.error('Error fetching tournament:', error);
        setError('An error occurred while fetching tournament data');
      } finally {
        setLoading(false);
      }
    };

    fetchTournament();
  }, [slug]);

  // Fetch game data based on tournament ID
  const fetchGameData = async (tournamentId) => {
    setGameLoading(true);
    try {
      console.log('Fetching game data for tournament ID:', tournamentId);
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/games.php?tournament_id=${tournamentId}`,
      );

      if (response.data.success && response.data.game) {
        setGameData(response.data.game);
      } else {
        console.warn('Game data not found:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching game data:', error);
    } finally {
      setGameLoading(false);
    }
  };

  useEffect(() => {
    let timer;
    if (showGlow) {
      timer = setTimeout(() => setShowGlow(false), 1200);
    }
    return () => clearTimeout(timer);
  }, [showGlow]);

  const generateInitialMatches = async (tournamentId) => {
    try {
      setLoad(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/generate_matches.php`,
        {
          tournament_id: tournamentId,
          isTeamTournament: tournament.participation_type === 'team',
        },
      );

      if (response.data.success) {
        const MAX_PARTICIPANTS = response.data.data[0]?.nombre_maximum || 8;
        const numRounds = Math.ceil(Math.log2(MAX_PARTICIPANTS));
        const matches = response.data.data;

        const formattedMatches = matches.map((match) => ({
          id: match.id,
          round: parseInt(match.round),
          player1: {
            id: match.player1_id,
            name: match.player1_name || 'TBD',
            avatar: match.player1_avatar,
          },
          player2: {
            id: match.player2_id,
            name: match.player2_name || 'TBD',
            avatar: match.player2_avatar,
          },
          score1: parseInt(match.score1) || 0,
          score2: parseInt(match.score2) || 0,
          status: match.status,
          match_date: match.match_date,
        }));

        return {
          success: true,
          data: formattedMatches,
          rounds: numRounds,
        };
      }

      return {
        success: false,
        error: 'Failed to generate matches',
      };
    } catch (error) {
      console.error('Error generating matches:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Error generating matches',
      };
    } finally {
      setLoad(false);
    }
  };

  const updateTournamentStatus = async (newStatus) => {
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_tournament_status.php`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tournament_id: tournament.id,
            new_status: newStatus,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        await generateInitialMatches(tournament.id);

        setGlowColor(newStatus === 'ongoing' ? 'green' : 'red');
        setShowGlow(true);
        setTournament({ ...tournament, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating tournament status:', error);
    } finally {
      setLoad(false);
    }
  };

  // Check if data is ready to display
  const isDataReady = !loading && tournament;

  if (load) {
    return (
      <TransparentLoader
        messages={[
          'Loading your content...',
          'Generating matches...',
          'Creating bracket...',
          'Almost there...',
        ]}
      />
    );
  }

  if (loading) {
    return (
      <div className="text-white">
        <TransparentLoader messages={['Loading your tournament...']} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center">
        <AlertCircleIcon /> Error: {error}
      </div>
    );
  }

  if (!tournament) {
    return <div className="text-white">No tournament found.</div>;
  }

  console.log('Rendering with game data:', gameData);

  return (
    <div className="relative flex flex-col gap-8 text-white p-2 rounded-lg">
      {/* Glow Effect */}
      <div
        className={`fixed inset-0 z-[999] pointer-events-none transition-opacity duration-1000 ${
          showGlow ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 h-24 bg-gradient-to-b ${
            glowColor === 'green'
              ? 'from-green-500 via-green-500/20'
              : 'from-red-500 via-red-500/20'
          } to-transparent`}
        />
        <div
          className={`absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t ${
            glowColor === 'green'
              ? 'from-green-500 via-green-500/20'
              : 'from-red-500 via-red-500/20'
          } to-transparent`}
        />
        <div
          className={`absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r ${
            glowColor === 'green'
              ? 'from-green-500 via-green-500/20'
              : 'from-red-500 via-red-500/20'
          } to-transparent`}
        />
        <div
          className={`absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l ${
            glowColor === 'green'
              ? 'from-green-500 via-green-500/20'
              : 'from-red-500 via-red-500/20'
          } to-transparent`}
        />
      </div>

      {/* Tournament Content */}
      <div
        className={`transition-all duration-300 gap-2 ease-in-out ${
          activeTab !== 'Overview'
            ? 'lg:w-full lg:opacity-0 lg:overflow-hidden'
            : 'lg:w-full lg:opacity-100'
        }`}
      >
        {activeTab === 'Overview' && isDataReady && (
          <HeroSection
            spots_remaining={tournament.spots_remaining}
            tournamentId={tournament.id}
            title={tournament.name}
            backgroundSrc={tournament.featured_image}
            startDate={tournament.start_date}
            endDate={tournament.end_date}
            tournament={tournament}
            updateTournamentStatus={updateTournamentStatus}
            gameData={gameData}
            gameLoading={gameLoading}
          />
        )}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          activeTab !== 'Overview' ? 'lg:w-full' : 'lg:w-full'
        }`}
      >
        <TabComponent activeTab={activeTab} onTabChange={setActiveTab} tournament={tournament}  gameData={gameData}/>
      </div>
    </div>
  );
};

export default TournamentPage;
