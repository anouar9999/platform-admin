import React, { useState, useEffect } from 'react';
import { Bracket } from '@sportsgram/brackets';
import { FaSpinner, FaTrophy, FaUndo } from 'react-icons/fa';
import BracketMatch from './BracketMatch';
import { motion } from 'framer-motion';

// Main SingleEliminationBracket component
const SingleEliminationBracket = ({ bracketData = null, onSaveResult, isEditable = true }) => {
  // Use state to manage bracket data, loading, and updates
  const [tournamentData, setTournamentData] = useState(bracketData || generateMockData());
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editMatchId, setEditMatchId] = useState(null);
  const [champion, setChampion] = useState(null);

  // Update local state when bracketData prop changes
  useEffect(() => {
    if (bracketData) {
      setTournamentData(bracketData);
    }
  }, [bracketData]);

  // Find champion after data changes
  useEffect(() => {
    // Find the champion (winner of final match)
    if (tournamentData?.rounds?.[0]?.[0]?.participants?.length > 0) {
      const finalMatch = tournamentData.rounds[0][0];
      const winner = finalMatch.participants.find(p => p.is_winner);
      setChampion(winner || null);
    } else {
      setChampion(null);
    }
  }, [tournamentData]);

  // Handle saving a match result
  const handleSaveResult = (matchId, score1, score2) => {
    setIsUpdating(true);
    setEditMatchId(matchId);

    // Clone the current tournament data to avoid mutation
    const updatedData = JSON.parse(JSON.stringify(tournamentData));

    // Find the match to update
    let matchToUpdate = null;
    let matchRoundIndex = -1;
    let matchIndex = -1;

    // Find the match in our data structure
    updatedData.rounds.forEach((round, roundIndex) => {
      round.forEach((match, index) => {
        if (match.id === matchId) {
          matchToUpdate = match;
          matchRoundIndex = roundIndex;
          matchIndex = index;
        }
      });
    });

    if (matchToUpdate) {
      // Update the match scores
      matchToUpdate.score1 = score1;
      matchToUpdate.score2 = score2;
      matchToUpdate.state = 'SCORE_DONE';

      // Determine the winner
      const winner = score1 > score2 ? matchToUpdate.participants[0] : 
                    score2 > score1 ? matchToUpdate.participants[1] : null;

      // Update winner status
      if (winner) {
        // Set winner in this match
        matchToUpdate.participants.forEach(participant => {
          if (participant.id === winner.id) {
            participant.is_winner = true;
            participant.result_text = score1 > score2 ? `${score1}-${score2}` : `${score2}-${score1}`;
          } else {
            participant.is_winner = false;
            participant.result_text = score1 > score2 ? `${score1}-${score2}` : `${score2}-${score1}`;
          }
        });

        // Propagate winner to next match if there is one
        if (matchToUpdate.nextMatchId) {
          const nextMatchData = findMatchById(matchToUpdate.nextMatchId, updatedData);
          if (nextMatchData) {
            const { match: nextMatch, roundIndex: nextRoundIndex, matchIndex: nextMatchIdx } = nextMatchData;
            
            // Determine if this winner should be placed in position 0 or 1 of the next match
            const isPositionZero = nextRoundIndex > 0 && 
                                  updatedData.rounds[nextRoundIndex - 1] && 
                                  matchIndex % 2 === 0;
            
            // Copy winner to next match in the correct position
            if (nextMatch.participants.length < 2) {
              nextMatch.participants.push({...winner, is_winner: false, result_text: ''});
            } else {
              const positionIndex = isPositionZero ? 0 : 1;
              nextMatch.participants[positionIndex] = {...winner, is_winner: false, result_text: ''};
            }
          }
        }
      }

      // Update the state with new data
      setTournamentData(updatedData);

      // Call the parent onSaveResult if provided
      if (onSaveResult) {
        onSaveResult(matchId, score1, score2, updatedData);
      }
    }

    // Simulate a short delay for API call
    setTimeout(() => {
      setIsUpdating(false);
      setEditMatchId(null);
    }, 800);
  };

  // Helper to find a match by ID in our data structure
  const findMatchById = (matchId, data = tournamentData) => {
    for (let roundIndex = 0; roundIndex < data.rounds.length; roundIndex++) {
      const round = data.rounds[roundIndex];
      for (let matchIndex = 0; matchIndex < round.length; matchIndex++) {
        if (round[matchIndex].id === matchId) {
          return { 
            match: round[matchIndex], 
            roundIndex, 
            matchIndex 
          };
        }
      }
    }
    return null;
  };

  // Reset all scores and winners (for testing)
  const resetBracket = () => {
    if (!confirm('Are you sure you want to reset all match scores? This cannot be undone.')) return;
    
    setLoading(true);
    
    // Clone the current data
    const resetData = JSON.parse(JSON.stringify(tournamentData));
    
    // Reset all matches
    resetData.rounds.forEach((round, roundIndex) => {
      round.forEach((match, matchIndex) => {
        // For matches beyond the first round, clear participants
        if (roundIndex < resetData.rounds.length - 1) {
          match.participants = [];
        }
        
        // Reset scores and state
        match.score1 = 0;
        match.score2 = 0;
        match.state = 'PENDING';
        
        // For first round matches, reset winner status
        if (roundIndex === resetData.rounds.length - 1) {
          if (match.participants && match.participants.length) {
            match.participants.forEach(p => {
              p.is_winner = false;
              p.result_text = '';
            });
          }
        }
      });
    });
    
    // Restore first round participants from mock data
    const mockData = generateMockData();
    resetData.rounds[resetData.rounds.length - 1] = mockData.rounds[mockData.rounds.length - 1];
    
    // Update state
    setTournamentData(resetData);
    setChampion(null);
    
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  // Custom render component for the bracket matches
  const CustomSeedComponent = ({ seed, breakpoint, roundIndex, seedIndex }) => {
    // Find the actual match from our data structure
    const matchData = findMatchById(seed.id);
    if (!matchData) return null;
    
    const match = matchData.match;
    
    // Determine if this is a final match
    const isFinal = roundIndex === 0;

    // Determine flow direction based on round index
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

  // Format the data for the Bracket component
  const formatRounds = () => {
    const formattedRounds = tournamentData.rounds.map((round, roundIndex) => {
      // For a tournament (with up to 6 rounds)
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

      return {
        title,
        seeds,
      };
    });

    // Reverse the order so the final is on the right
    return formattedRounds.reverse();
  };

  // Loading state
  if (loading || !tournamentData || !tournamentData.rounds || !tournamentData.rounds.length) {
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
      {/* Tournament Champion (if one exists) */}
      {/* {champion && (
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
)} */}
      
      {/* Reset button (for testing) */}
      {isEditable && (
        <button 
          onClick={resetBracket}
          className="absolute top-4 left-4 bg-red-900/80 hover:bg-red-800 text-white px-3 py-1.5 rounded flex items-center text-sm z-10"
        >
          <FaUndo className="mr-1" />
          Reset Bracket
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

// Define the mock data outside the component so it can be used as default prop
const generateMockData = () => {
  // Team name templates for generating team names
  const teamPrefixes = ['Alpha', 'Beta', 'Delta', 'Omega', 'Crimson', 'Azure', 'Emerald', 'Golden'];
  const teamSuffixes = [
    'Wolves',
    'Dragons',
    'Knights',
    'Eagles',
    'Tigers',
    'Vipers',
    'Hawks',
    'Mages',
  ];

  // Generate a team name
  const generateTeamName = (index) => {
    if (index < teamPrefixes.length * teamSuffixes.length) {
      const prefixIndex = index % teamPrefixes.length;
      const suffixIndex = index % teamSuffixes.length;
      return `${teamPrefixes[prefixIndex]} ${teamSuffixes[suffixIndex]}`;
    } else {
      return `Team ${index + 1}`;
    }
  };

  // Generate a team
  const generateTeam = (index) => {
    return {
      id: `team-${index + 1}`,
      name: generateTeamName(index),
      seed: index + 1,
      picture:
        index % 2 === 0
          ? 'https://i.pinimg.com/736x/6e/d3/fb/6ed3fbc4555f0f46755079601f8af91b.jpg'
          : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFVPcHGroySXhQpz_2eB-C9pmYwLtDQ4e6lQ&s',
    };
  };

  // Generate 8 teams
  const teams = Array.from({ length: 8 }, (_, i) => generateTeam(i));

  // Create rounds structure (3 rounds total for 8 teams)
  // Round 1: 4 matches (8 teams) - Quarter Finals
  // Round 2: 2 matches (4 teams) - Semi Finals
  // Round 3: 1 match (2 teams) - Final

  const rounds = [
    // Final (Round 3)
    [
      {
        id: 'match-final',
        name: 'Grand Final',
        participants: [],
        score1: null,
        score2: null,
        state: 'PENDING',
        nextMatchId: null,
      },
    ],

    // Semi Finals (Round 2)
    [
      {
        id: 'match-sf-1',
        name: 'Semi Final 1',
        participants: [],
        score1: null,
        score2: null,
        state: 'PENDING',
        nextMatchId: 'match-final',
      },
      {
        id: 'match-sf-2',
        name: 'Semi Final 2',
        participants: [],
        score1: null,
        score2: null,
        state: 'PENDING',
        nextMatchId: 'match-final',
      },
    ],

    // Quarter Finals (Round 1)
    [
      {
        id: 'match-qf-1',
        name: 'Quarter Final 1',
        participants: [
          { ...teams[0], is_winner: false, result_text: '' },
          { ...teams[7], is_winner: false, result_text: '' },
        ],
        score1: null,
        score2: null,
        state: 'PENDING',
        nextMatchId: 'match-sf-1',
      },
      {
        id: 'match-qf-2',
        name: 'Quarter Final 2',
        participants: [
          { ...teams[3], is_winner: false, result_text: '' },
          { ...teams[4], is_winner: false, result_text: '' },
        ],
        score1: null,
        score2: null,
        state: 'PENDING',
        nextMatchId: 'match-sf-1',
      },
      {
        id: 'match-qf-3',
        name: 'Quarter Final 3',
        participants: [
          { ...teams[2], is_winner: false, result_text: '' },
          { ...teams[5], is_winner: false, result_text: '' },
        ],
        score1: null,
        score2: null,
        state: 'PENDING',
        nextMatchId: 'match-sf-2',
      },
      {
        id: 'match-qf-4',
        name: 'Quarter Final 4',
        participants: [
          { ...teams[1], is_winner: false, result_text: '' },
          { ...teams[6], is_winner: false, result_text: '' },
        ],
        score1: null,
        score2: null,
        state: 'PENDING',
        nextMatchId: 'match-sf-2',
      },
    ],
  ];

  return { rounds };
};

export default SingleEliminationBracket;