import React, { useState, useEffect } from 'react';
import { Bracket } from '@sportsgram/brackets';
import { FaSpinner, FaTrophy, FaUndo } from 'react-icons/fa';
import BracketMatch from './BracketMatch';
import { motion } from 'framer-motion';

// Mock data generator for 32 participants
const generateMockData = () => {
  const participants = [
    'Team Alpha', 'Team Beta', 'Team Gamma', 'Team Delta',
    'Team Epsilon', 'Team Zeta', 'Team Eta', 'Team Theta',
    'Team Iota', 'Team Kappa', 'Team Lambda', 'Team Mu',
    'Team Nu', 'Team Xi', 'Team Omicron', 'Team Pi',
    'Team Rho', 'Team Sigma', 'Team Tau', 'Team Upsilon',
    'Team Phi', 'Team Chi', 'Team Psi', 'Team Omega',
    'Team Phoenix', 'Team Dragon', 'Team Tiger', 'Team Lion',
    'Team Eagle', 'Team Falcon', 'Team Hawk', 'Team Raven'
  ];

  const matches = [];
  let matchId = 1;

  // Round 1: 16 matches (32 participants)
  for (let i = 0; i < 16; i++) {
    matches.push({
      id: matchId++,
      round: 1,
      teams: [
        { id: i * 2 + 1, name: participants[i * 2], avatar: null, winner: false, score: 0 },
        { id: i * 2 + 2, name: participants[i * 2 + 1], avatar: null, winner: false, score: 0 }
      ],
      score1: 0,
      score2: 0,
      status: 'PENDING',
      start_time: 'TBD',
      nextMatchId: 17 + Math.floor(i / 2)
    });
  }

  // Round 2: 8 matches
  for (let i = 0; i < 8; i++) {
    matches.push({
      id: matchId++,
      round: 2,
      teams: [
        { id: null, name: 'TBD', avatar: null, winner: false, score: 0 },
        { id: null, name: 'TBD', avatar: null, winner: false, score: 0 }
      ],
      score1: 0,
      score2: 0,
      status: 'PENDING',
      start_time: 'TBD',
      nextMatchId: 25 + Math.floor(i / 2)
    });
  }

  // Round 3: 4 matches (Quarter-finals)
  for (let i = 0; i < 4; i++) {
    matches.push({
      id: matchId++,
      round: 3,
      teams: [
        { id: null, name: 'TBD', avatar: null, winner: false, score: 0 },
        { id: null, name: 'TBD', avatar: null, winner: false, score: 0 }
      ],
      score1: 0,
      score2: 0,
      status: 'PENDING',
      start_time: 'TBD',
      nextMatchId: 29 + Math.floor(i / 2)
    });
  }

  // Round 4: 2 matches (Semi-finals)
  for (let i = 0; i < 2; i++) {
    matches.push({
      id: matchId++,
      round: 4,
      teams: [
        { id: null, name: 'TBD', avatar: null, winner: false, score: 0 },
        { id: null, name: 'TBD', avatar: null, winner: false, score: 0 }
      ],
      score1: 0,
      score2: 0,
      status: 'PENDING',
      start_time: 'TBD',
      nextMatchId: 31
    });
  }

  // Round 5: 1 match (Final)
  matches.push({
    id: matchId++,
    round: 5,
    teams: [
      { id: null, name: 'TBD', avatar: null, winner: false, score: 0 },
      { id: null, name: 'TBD', avatar: null, winner: false, score: 0 }
    ],
    score1: 0,
    score2: 0,
    status: 'PENDING',
    start_time: 'TBD',
    nextMatchId: null
  });

  return {
    success: true,
    data: {
      matches,
      bracket_info: {
        total_rounds: 5,
        tournament_id: 20
      }
    }
  };
};

// Main SingleEliminationBracket component
const SingleEliminationBracket = ({ tournamentId, onSaveResult, isEditable = true }) => {
  const [tournamentData, setTournamentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMatchId, setEditMatchId] = useState(null);
  const [champion, setChampion] = useState(null);
  const [mockMatches, setMockMatches] = useState(null);

  // Fetch tournament data from API or use mock data
  useEffect(() => {
    if (!tournamentId) {
      setError('Tournament ID is required');
      setLoading(false);
      return;
    }

    if (tournamentId === 20) {
      loadMockData();
    } else {
      fetchTournamentData();
    }
  }, [tournamentId]);

  const loadMockData = () => {
    setLoading(true);
    setError(null);

    try {
      const mockData = generateMockData();
      setMockMatches(mockData.data.matches);
      const transformedData = transformApiData(mockData.data);
      setTournamentData(transformedData);
    } catch (err) {
      console.error('Error loading mock data:', err);
      setError(err.message || 'Failed to load mock data');
    } finally {
      setLoading(false);
    }
  };

  const fetchTournamentData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fetch_matches_bracket.php?tournament_id=${tournamentId}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);

      if (!result.success) {
        throw new Error(result.message || 'Failed to load tournament data');
      }

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
    const matches = data.matches || [];
    const bracketInfo = data.bracket_info || data;

    console.log('Matches received:', matches);
    console.log('Bracket info:', bracketInfo);

    if (!matches || matches.length === 0) {
      throw new Error('No matches found for this tournament. Please generate matches first.');
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
    const totalRounds = bracketInfo.total_rounds || Math.max(...matches.map((m) => m.round));

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
          state:
            match.status === 'COMPLETED' || match.status === 'complete' ? 'SCORE_DONE' : 'PENDING',
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
    if (tournamentId === 20) {
      // Mock save for tournament 20
      setIsUpdating(true);
      setEditMatchId(matchId);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update mock data
        const updatedMatches = mockMatches.map(match => {
          if (match.id === matchId) {
            const winner = score1 > score2 ? 0 : 1;
            return {
              ...match,
              score1,
              score2,
              status: 'COMPLETED',
              teams: match.teams.map((team, idx) => ({
                ...team,
                score: idx === 0 ? score1 : score2,
                winner: idx === winner
              }))
            };
          }
          return match;
        });

        // Update next match with winner
        const currentMatch = updatedMatches.find(m => m.id === matchId);
        if (currentMatch && currentMatch.nextMatchId) {
          const winner = score1 > score2 ? currentMatch.teams[0] : currentMatch.teams[1];
          const nextMatchIndex = updatedMatches.findIndex(m => m.id === currentMatch.nextMatchId);
          
          if (nextMatchIndex !== -1) {
            const nextMatch = updatedMatches[nextMatchIndex];
            // Find empty slot in next match
            const emptySlot = nextMatch.teams.findIndex(t => t.id === null);
            if (emptySlot !== -1) {
              updatedMatches[nextMatchIndex] = {
                ...nextMatch,
                teams: nextMatch.teams.map((t, idx) => 
                  idx === emptySlot ? { ...winner, winner: false, score: 0 } : t
                )
              };
            }
          }
        }

        setMockMatches(updatedMatches);
        const transformedData = transformApiData({ 
          matches: updatedMatches, 
          bracket_info: { total_rounds: 5 } 
        });
        setTournamentData(transformedData);

        if (onSaveResult) {
          onSaveResult(matchId, score1, score2, null);
        }
      } catch (err) {
        console.error('Error saving match result:', err);
        alert('Failed to save match result. Please try again.');
      } finally {
        setIsUpdating(false);
        setEditMatchId(null);
      }
    } else {
      // Original API call for other tournaments
      setIsUpdating(true);
      setEditMatchId(matchId);

      try {
        const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/update_single_elimination_match.php`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            match_id: matchId,
            team1_score: score1,
            team2_score: score2,
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || !result || !result.success) {
          throw new Error((result && result.message) || 'Failed to save match result');
        }

        await fetchTournamentData();

        if (onSaveResult) {
          onSaveResult(matchId, score1, score2, result.data || null);
        }
      } catch (err) {
        console.error('Error saving match result:', err);
        alert('Failed to save match result. Please try again.');
      } finally {
        setIsUpdating(false);
        setEditMatchId(null);
      }
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
    if (!window.confirm('Are you sure you want to reload the bracket from the server?')) return;
    
    if (tournamentId === 20) {
      loadMockData();
    } else {
      await fetchTournamentData();
    }
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
      const totalRounds = tournamentData.rounds.length;

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
          title = `Round ${totalRounds - roundIndex}`;
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
            onClick={tournamentId === 20 ? loadMockData : fetchTournamentData}
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
      {/* Mock Tournament Badge */}
      {/* {tournamentId === 20 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-3 py-1 rounded text-sm z-10">
          🎮 Mock Tournament (ID: 20)
        </div>
      )} */}

      {/* Tournament Champion */}
      {champion && (
        <motion.div
          className="absolute top-4 right-4 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg p-4 z-10 shadow-lg border border-yellow-500/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: 1,
            y: 0,
            boxShadow: [
              '0 0 0px rgba(234, 179, 8, 0.2)',
              '0 0 15px rgba(234, 179, 8, 0.4)',
              '0 0 5px rgba(234, 179, 8, 0.2)',
            ],
          }}
          transition={{
            duration: 0.5,
            boxShadow: {
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            },
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
              <div className="text-xl font-bold text-white leading-tight">{champion.name}</div>

              {champion.result_text && (
                <div className="text-xs text-gray-400 mt-1">
                  Final Score: {champion.result_text}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Reset button */}
      {/* {isEditable && (
        <button
          onClick={resetBracket}
          className="absolute top-4 left-4 bg-blue-900/80 hover:bg-blue-800 text-white px-3 py-1.5 rounded flex items-center text-sm z-10"
        >
          <FaUndo className="mr-1" />
          Reload Bracket
        </button>
      )} */}

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
