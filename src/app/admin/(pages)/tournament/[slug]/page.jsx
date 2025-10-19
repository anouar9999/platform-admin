'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircleIcon, DollarSign, Gamepad2, Users, Monitor, Trophy } from 'lucide-react';
import axios from 'axios';
import { HeroSection } from './HeroSection';
import TransparentLoader from './Loader';
import { useToast } from '@/utils/ToastProvider';
import TabComponent from './TabComponent';
export const runtime = 'edge';

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
      <div className="text-red-500 text-center flex items-center justify-center gap-2">
        <AlertCircleIcon /> Error: {error}
      </div>
    );
  }

  if (!tournament) {
    return <div className="text-white">No tournament found.</div>;
  }

  console.log('Rendering with game data:', gameData);

  return (
    <div className="relative flex flex-col gap-8 text-white rounded-lg p-6">
      {/* Tournament Content */}
      <div
        className={`transition-all duration-300 gap-2 ease-in-out ${
          activeTab !== 'Overview'
            ? 'lg:w-full lg:opacity-0 lg:overflow-hidden fixed'
            : 'lg:w-full lg:opacity-100'
        }`}
      >
        {activeTab === 'Overview' && isDataReady && (
          <>
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
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </>
        )}
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          activeTab !== 'Overview' ? 'lg:w-full' : 'lg:w-full'
        }`}
      >
        <TabComponent
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tournament={tournament}
          gameData={gameData}
        />
      </div>
    </div>
  );
};

export default TournamentPage;
