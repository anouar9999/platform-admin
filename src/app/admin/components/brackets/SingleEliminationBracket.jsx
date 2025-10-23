import React, { useState, useEffect } from 'react';
import { Bracket } from '@sportsgram/brackets';
import { FaSpinner, FaTrophy, FaUndo, FaTimes, FaSave } from 'react-icons/fa';
import BracketMatch from './BracketMatch';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data generator for 32 participants
const generateMockData = () => {
  const participants = [
    { name: 'Team Alpha', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=alpha' },
    { name: 'Team Beta', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=beta' },
    { name: 'Team Gamma', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=gamma' },
    { name: 'Team Delta', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=delta' },
    { name: 'Team Epsilon', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=epsilon' },
    { name: 'Team Zeta', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=zeta' },
    { name: 'Team Eta', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=eta' },
    { name: 'Team Theta', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=theta' },
    { name: 'Team Iota', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=iota' },
    { name: 'Team Kappa', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kappa' },
    { name: 'Team Lambda', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=lambda' },
    { name: 'Team Mu', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=mu' },
    { name: 'Team Nu', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=nu' },
    { name: 'Team Xi', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=xi' },
    { name: 'Team Omicron', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=omicron' },
    { name: 'Team Pi', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=pi' },
    { name: 'Team Rho', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=rho' },
    { name: 'Team Sigma', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=sigma' },
    { name: 'Team Tau', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tau' },
    { name: 'Team Upsilon', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=upsilon' },
    { name: 'Team Phi', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=phi' },
    { name: 'Team Chi', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=chi' },
    { name: 'Team Psi', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=psi' },
    { name: 'Team Omega', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=omega' },
    { name: 'Team Phoenix', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=phoenix' },
    { name: 'Team Dragon', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=dragon' },
    { name: 'Team Tiger', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=tiger' },
    { name: 'Team Lion', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=lion' },
    { name: 'Team Eagle', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=eagle' },
    { name: 'Team Falcon', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=falcon' },
    { name: 'Team Hawk', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=hawk' },
    { name: 'Team Raven', avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=raven' }
  ];

  const matches = [];
  let matchId = 1;

  // Round 1: 16 matches (32 participants)
  for (let i = 0; i < 16; i++) {
    matches.push({
      id: matchId++,
      round: 1,
      teams: [
        { 
          id: i * 2 + 1, 
          name: participants[i * 2].name, 
          avatar: participants[i * 2].avatar, 
          winner: false, 
          score: 0 
        },
        { 
          id: i * 2 + 2, 
          name: participants[i * 2 + 1].name, 
          avatar: participants[i * 2 + 1].avatar, 
          winner: false, 
          score: 0 
        }
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

// Modal Component for editing match scores
const MatchEditModal = ({ match, onClose, onSave, isUpdating }) => {
  const [score1, setScore1] = useState(match.participants?.[0]?.score || 0);
  const [score2, setScore2] = useState(match.participants?.[1]?.score || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(match.id, parseInt(score1), parseInt(score2));
  };

  const team1 = match.participants?.[0];
  const team2 = match.participants?.[1];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-700"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h3 className="text-xl font-bold text-white">Edit Match Result</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Team 1 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {team1?.name || 'Team 1'}
              </label>
              <div className="flex items-center space-x-3">
                {team1?.avatar && (
                  <img
                    src={team1.avatar}
                    alt={team1.name}
                    className="w-10 h-10 rounded-full bg-gray-700"
                  />
                )}
                <input
                  type="number"
                  min="0"
                  value={score1}
                  onChange={(e) => setScore1(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Score"
                />
              </div>
            </div>

            {/* VS Divider */}
            <div className="flex items-center justify-center">
              <div className="bg-gray-700 text-gray-400 text-sm font-bold px-4 py-1 rounded-full">
                VS
              </div>
            </div>

            {/* Team 2 */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                {team2?.name || 'Team 2'}
              </label>
              <div className="flex items-center space-x-3">
                {team2?.avatar && (
                  <img
                    src={team2.avatar}
                    alt={team2.name}
                    className="w-10 h-10 rounded-full bg-gray-700"
                  />
                )}
                <input
                  type="number"
                  min="0"
                  value={score2}
                  onChange={(e) => setScore2(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Score"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
                disabled={isUpdating}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUpdating ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    Save Result
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
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
  const [selectedMatch, setSelectedMatch] = useState(null);

  // Fetch tournament data from API or use mock data
  useEffect(() => {
    if (!tournamentId) {
      setError('Tournament ID is required');
      setLoading(false);
      return;
    }

    // Always use mock data for all tournaments
    loadMockData();
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

  // Transform API response to bracket format
  const transformApiData = (data) => {
    const matches = data.matches || [];
    const bracketInfo = data.bracket_info || data;

    console.log('Matches received:', matches);
    console.log('Bracket info:', bracketInfo);

    if (!matches || matches.length === 0) {
      throw new Error('No matches found for this tournament. Please generate matches first.');
    }

    const totalRounds = bracketInfo.total_rounds || 5;
    const rounds = Array.from({ length: totalRounds }, () => []);

    matches.forEach((match) => {
      const roundIndex = totalRounds - match.round;
      if (roundIndex >= 0 && roundIndex < totalRounds) {
        const participants = match.teams.map((team) => ({
          id: team.id,
          name: team.name || 'TBD',
          avatar: team.avatar,
          isWinner: team.winner,
          score: team.score || 0,
          resultText: team.score !== undefined ? `${team.score}` : '',
        }));

        rounds[roundIndex].push({
          id: match.id,
          participants,
          datetime: match.start_time,
          status: match.status,
          nextMatchId: match.nextMatchId,
        });
      }
    });

    // Find champion if exists
    const finalMatch = rounds[0]?.[0];
    if (finalMatch && finalMatch.participants.some((p) => p.isWinner)) {
      const winner = finalMatch.participants.find((p) => p.isWinner);
      if (winner && winner.name !== 'TBD') {
        setChampion({
          name: winner.name,
          result_text: finalMatch.participants
            .map((p) => p.score)
            .filter((s) => s !== undefined)
            .join('-'),
        });
      }
    }

    return {
      rounds,
      totalRounds,
      bracketInfo,
    };
  };

  // Handle saving match result
  const handleSaveResult = async (matchId, score1, score2) => {
    setIsUpdating(true);
    setEditMatchId(matchId);

    try {
      // Find the match in mockMatches
      const matchIndex = mockMatches.findIndex((m) => m.id === matchId);
      if (matchIndex === -1) {
        throw new Error('Match not found');
      }

      const match = mockMatches[matchIndex];
      const updatedMatches = [...mockMatches];

      // Update the current match
      updatedMatches[matchIndex] = {
        ...match,
        score1,
        score2,
        status: 'COMPLETED',
        teams: match.teams.map((team, idx) => ({
          ...team,
          score: idx === 0 ? score1 : score2,
          winner: idx === 0 ? score1 > score2 : score2 > score1,
        })),
      };

      // Determine winner
      const winnerId = score1 > score2 ? match.teams[0].id : match.teams[1].id;
      const winnerName = score1 > score2 ? match.teams[0].name : match.teams[1].name;
      const winnerAvatar = score1 > score2 ? match.teams[0].avatar : match.teams[1].avatar;

      // Update next match if exists
      if (match.nextMatchId) {
        const nextMatchIndex = updatedMatches.findIndex((m) => m.id === match.nextMatchId);
        if (nextMatchIndex !== -1) {
          const nextMatch = updatedMatches[nextMatchIndex];
          const teamSlot = Math.floor((matchIndex - (match.round === 1 ? 0 : 16)) / 2) % 2;
          
          const newTeams = [...nextMatch.teams];
          newTeams[teamSlot] = {
            id: winnerId,
            name: winnerName,
            avatar: winnerAvatar,
            winner: false,
            score: 0,
          };

          updatedMatches[nextMatchIndex] = {
            ...nextMatch,
            teams: newTeams,
          };
        }
      }

      setMockMatches(updatedMatches);
      const transformedData = transformApiData({
        matches: updatedMatches,
        bracket_info: { total_rounds: 5, tournament_id: tournamentId },
      });
      setTournamentData(transformedData);
      setSelectedMatch(null);

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
    if (!window.confirm('Are you sure you want to reload the bracket?')) return;
    loadMockData();
  };

  // Handle match click to open modal
  const handleMatchClick = (match) => {
    if (isEditable && match.participants.every(p => p.name !== 'TBD')) {
      setSelectedMatch(match);
    }
  };

  // Custom render component for bracket matches
  const CustomSeedComponent = ({ seed, breakpoint, roundIndex, seedIndex }) => {
    const matchData = findMatchById(seed.id);
    if (!matchData) return null;

    const match = matchData.match;
    const isFinal = roundIndex === 0;

    return (
      <div 
        onClick={() => handleMatchClick(match)}
        className={`${isEditable && match.participants.every(p => p.name !== 'TBD') ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <BracketMatch
          match={match}
          onSave={handleSaveResult}
          isFinal={isFinal}
          hasParticipants={match.participants && match.participants.length > 0}
          isUpdating={isUpdating && editMatchId === match.id}
          flowDirection="left-to-right"
          isFirst={seedIndex === 0}
          isLast={seedIndex === tournamentData.rounds[roundIndex]?.length - 1}
          totalMatches={tournamentData.rounds[roundIndex]?.length || 1}
          matchIndex={seedIndex}
        />
      </div>
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
            onClick={loadMockData}
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

      {/* Edit Match Modal */}
      {selectedMatch && (
        <MatchEditModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
          onSave={handleSaveResult}
          isUpdating={isUpdating}
        />
      )}
    </div>
  );
};

export default SingleEliminationBracket;