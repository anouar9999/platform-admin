import React, { useState, useEffect } from 'react';
import { Bracket } from '@sportsgram/brackets';
import { FaSpinner, FaTrophy, FaUndo } from 'react-icons/fa';
import BracketMatch from './BracketMatch';
import { motion } from 'framer-motion';

// Main SingleEliminationBracket component
const SingleEliminationBracket = ({ tournamentId, onSaveResult, isEditable = true }) => {
  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMatchId, setEditMatchId] = useState(null);
  const [champion, setChampion] = useState(null);

  // Fetch tournament data from API
  useEffect(() => {
    if (!tournamentId) {
      setError('Tournament ID is required');
      setLoading(false);
      return;
    }

    fetchTournamentData();
  }, [tournamentId]);

  const fetchTournamentData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.gnews.ma/api/fetch_matches_bracket.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tournament_id: tournamentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to load tournament data');
      }

      // Transform API data to component format
      const transformedData = transformApiData(result.data);
      setTournamentData(transformedData);
    } catch (err) {
      console.error('Error fetching tournament data:', err);
      setError(err.message || 'Failed to load tournament data');
    } finally {
      setLoading(false);
    }
  };

  // Transform API response to bracket format
  const transformApiData = (data) => {
    const { matches, bracket_info } = data;

    if (!matches || matches.length === 0) {
      throw new Error('No matches found for this tournament');
    }

    // Group matches by round (descending order for proper bracket display)
    const roundsMap = {};
    matches.forEach((match) => {
      const roundNum = match.round;
      if (!roundsMap[roundNum]) {
        roundsMap[roundNum] = [];
      }
      roundsMap[roundNum].push(match);
    });

    // Get the total number of rounds
    const totalRounds = bracket_info.total_rounds;

    // Convert to array and reverse (so final is first, round 1 is last)
    const rounds = [];
    for (let i = totalRounds; i >= 1; i--) {
      if (roundsMap[i]) {
        const formattedMatches = roundsMap[i].map((match) => ({
          id: match.id,
          name: `Match ${match.id}`,
          participants: match.teams.map((team) => ({
            id: team.id,
            name: team.name || 'TBD',
            seed: 0,
            picture: team.avatar || null,
            is_winner: team.winner || false,
            result_text: team.score ? `${team.score}` : '',
          })),
          score1: match.score1 || 0,
          score2: match.score2 || 0,
          state: match.status === 'complete' ? 'SCORE_DONE' : 'PENDING',
          nextMatchId: match.nextMatchId || null,
          datetime: match.start_time || 'TBD',
        }));

        rounds.push(formattedMatches);
      }
    }

    return { rounds };
  };

  // Find champion after data changes
  useEffect(() => {
    if (tournamentData?.rounds?.[0]?.[0]?.participants?.length > 0) {
      const finalMatch = tournamentData.rounds[0][0];
      const winner = finalMatch.participants.find((p) => p.is_winner);
      setChampion(winner || null);
    } else {
      setChampion(null);
    }
  }, [tournamentData]);

  // Handle saving a match result
  const handleSaveResult = async (matchId, score1, score2) => {
    setIsUpdating(true);
    setEditMatchId(matchId);

    try {
      // Call API to save match result
      const response = await fetch('https://api.gnews.ma/api/save_match_result.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          match_id: matchId,
          score1: score1,
          score2: score2,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save match result');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || 'Failed to save match result');
      }

      // Reload tournament data to get updated bracket
      await fetchTournamentData();

      // Call parent callback if provided
      if (onSaveResult) {
        onSaveResult(matchId, score1, score2);
      }
    } catch (err) {
      console.error('Error saving match result:', err);
      alert('Failed to save match result. Please try again.');
    } finally {
      setIsUpdating(false);
      setEditMatchId(null);
    }
  };

  // Helper to find a match by ID
  const findMatchById = (matchId, data = tournamentData) => {
    if (!data || !data.rounds) return null;

    for (let roundIndex = 0; roundIndex < data.rounds.length; roundIndex++) {
      const round = data.rounds[roundIndex];
      for (let matchIndex = 0; matchIndex < round.length; matchIndex++) {
        if (round[matchIndex].id === matchId) {
          return {
            match: round[matchIndex],
            roundIndex,
            matchIndex,
          };
        }
      }
    }
    return null;
  };

  // Reset bracket (reload from server)
  const resetBracket = async () => {
    if (!confirm('Are you sure you want to reload the bracket from the server?')) return;
    await fetchTournamentData();
  };

  // Custom render component for bracket matches
  const CustomSeedComponent = ({ seed, breakpoint, roundIndex, seedIndex }) => {
    const matchData = findMatchById(seed.id);
    if (!matchData) return null;

    const match = matchData.match;
    const isFinal = roundIndex === 0;
    const flowDirection = 'left-to-right';

    return (
      <BracketMatch
        match={match}
        onSave={handleSaveResult}
        isFinal={isFinal}
        hasParticipants={match.participants && match.participants.length > 0}
        isUpdating={isUpdating && editMatchId === match.id}
        flowDirection={flowDirection}
        isFirst={seedIndex === 0}
        isLast={seedIndex === tournamentData.rounds[roundIndex]?.length - 1}
        totalMatches={tournamentData.rounds[roundIndex]?.length || 1}
        matchIndex={seedIndex}
      />
    );
  };

  // Format rounds for display
  const formatRounds = () => {
    if (!tournamentData || !tournamentData.rounds) return [];

    const formattedRounds = tournamentData.rounds.map((round, roundIndex) => {
      let title;
      switch (roundIndex) {
        case 0:
          title = 'Final';
          break;
        case 1:
          title = 'Semi-Finals';
          break;
        case 2:
          title = 'Quarter-Finals';
          break;
        case 3:
          title = 'Round of 16';
          break;
        case 4:
          title = 'Round of 32';
          break;
        case 5:
          title = 'Round of 64';
          break;
        default:
          title = `Round ${tournamentData.rounds.length - roundIndex}`;
      }

      const seeds = round.map((match) => ({
        id: match.id,
        date: match.datetime || 'TBD',
      }));

      return { title, seeds };
    });

    return formattedRounds.reverse();
  };

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-gray-900/30 rounded-lg border border-red-800">
        <div className="text-center">
          <div className="text-red-500 mb-4 text-xl">⚠️</div>
          <p className="text-red-400 mb-2">Error loading tournament</p>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchTournamentData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading || !tournamentData) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-gray-900/30 rounded-lg border border-gray-800">
        <div className="text-center">
          <FaSpinner className="mx-auto text-4xl text-primary/50 mb-4 animate-spin" />
          <p className="text-gray-400">Loading bracket...</p>
        </div>
      </div>
    );
  }

  const rounds = formatRounds();

  return (
    <div className="w-full h-full bg-gray-900/30 rounded-lg p-4 relative">
      {/* Tournament Champion */}
      {champion && (
        <motion.div 
          className="absolute top-4 right-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 z-10 shadow-lg border border-yellow-500/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            boxShadow: ["0 0 0px rgba(234, 179, 8, 0.2)", "0 0 15px rgba(234, 179, 8, 0.4)", "0 0 5px rgba(234, 179, 8, 0.2)"]
          }}
          transition={{ 
            duration: 0.5,
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
        >
          <div className="flex items-center">
            <div className="relative mr-3">
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
              <div className="relative bg-yellow-500 rounded-full p-2.5">
                <FaTrophy className="text-yellow-900" size={24} />
              </div>
            </div>
            
            <div>
              <div className="text-xs uppercase tracking-wider text-yellow-500 font-semibold mb-1">
                Tournament Champion
              </div>
              <div className="text-xl font-bold text-white leading-tight">
                {champion.name}
              </div>
              
              {champion.result_text && (
                <div className="text-xs text-gray-400 mt-1">
                  Final Score: {champion.result_text}
                </div>
              )}
            </div>
          </div>
          
          {champion.picture && (
            <div className="mt-3 pt-3 border-t border-gray-700 flex items-center">
              <div className="w-8 h-8 rounded-full overflow-hidden mr-2 border border-yellow-500/50">
                <img 
                  src={champion.picture} 
                  alt={champion.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="text-sm text-gray-300">
                Congratulations!
              </div>
            </div>
          )}
        </motion.div>
      )}
      
      {/* Reset button */}
      {isEditable && (
        <button
          onClick={resetBracket}
          className="absolute top-4 left-4 bg-blue-900/80 hover:bg-blue-800 text-white px-3 py-1.5 rounded flex items-center text-sm z-10"
        >
          <FaUndo className="mr-1" />
          Reload Bracket
        </button>
      )}

      {/* Bracket container */}
      <div className="flex h-full overflow-auto pt-16">
        <Bracket
          rounds={rounds}
          renderSeedComponent={CustomSeedComponent}
          swipeableProps={{
            enableMouseEvents: true,
            animateHeight: true,
          }}
          options={{
            style: {
              roundHeader: {
                backgroundColor: '#1F2937',
                color: '#9CA3AF',
                padding: '8px 16px',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
              },
              connectorColor: '#006aff',
              connectorColorHighlight: '#3B82F6',
              width: 1000,
              height: 80,
              canvasPadding: 40,
              roundSeparatorWidth: 50,
              roundSeparatorColor: '#4B5563',
            },
          }}
        />
      </div>
    </div>
  );
};

export default SingleEliminationBracket;
