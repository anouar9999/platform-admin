import React, { useState, useEffect } from 'react';
import { FaTrophy, FaMedal, FaUserFriends, FaRegClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

// Helper function to generate playoff bracket matches from qualified teams
const generatePlayoffBracket = (qualifiedTeams) => {
  // Sort teams by points/standings
  const sortedTeams = [...qualifiedTeams].sort((a, b) => b.points - a.points);
  
  // Determine bracket size (next power of 2)
  const numTeams = sortedTeams.length;
  let bracketSize = 1;
  while (bracketSize < numTeams) bracketSize *= 2;
  
  // Create initial round matches with seeded teams
  const rounds = [];
  const firstRound = [];
  
  // Generate first round matches with proper seeding
  // Common seeding pattern for tournaments (1 vs 8, 4 vs 5, 2 vs 7, 3 vs 6)
  for (let i = 0; i < bracketSize / 2; i++) {
    const team1Idx = i;
    const team2Idx = bracketSize - 1 - i;
    
    const match = {
      id: `R1M${i+1}`,
      team1: team1Idx < numTeams ? sortedTeams[team1Idx] : null,
      team2: team2Idx < numTeams ? sortedTeams[team2Idx] : null,
      winner: null,
      score1: null,
      score2: null,
      nextMatchId: `R2M${Math.floor(i/2) + 1}`
    };
    
    // If one team is missing, the other advances automatically
    if (match.team1 && !match.team2) {
      match.winner = match.team1;
      match.score1 = 1;
      match.score2 = 0;
    } else if (!match.team1 && match.team2) {
      match.winner = match.team2;
      match.score1 = 0;
      match.score2 = 1;
    }
    
    firstRound.push(match);
  }
  
  rounds.push(firstRound);
  
  // Generate subsequent rounds (empty brackets to be filled as tournament progresses)
  let matchesInRound = bracketSize / 4;
  let roundNumber = 2;
  
  while (matchesInRound >= 1) {
    const round = [];
    for (let i = 0; i < matchesInRound; i++) {
      let nextMatchId = null;
      if (matchesInRound > 1) {
        nextMatchId = `R${roundNumber+1}M${Math.floor(i/2) + 1}`;
      }
      
      round.push({
        id: `R${roundNumber}M${i+1}`,
        team1: null,
        team2: null,
        winner: null,
        score1: null,
        score2: null,
        nextMatchId
      });
    }
    rounds.push(round);
    matchesInRound /= 2;
    roundNumber++;
  }
  
  return rounds;
};

// Helper to advance teams in the bracket based on match results
const advanceTeamsInBracket = (bracketRounds) => {
  const updatedRounds = [...bracketRounds];
  
  // For each round except the final
  for (let roundIndex = 0; roundIndex < updatedRounds.length - 1; roundIndex++) {
    const currentRound = updatedRounds[roundIndex];
    
    // For each match in the round
    for (const match of currentRound) {
      // If there's a winner and a next match ID
      if (match.winner && match.nextMatchId) {
        // Find the next match
        const [nextRoundStr, nextMatchStr] = match.nextMatchId.match(/R(\d+)M(\d+)/).slice(1);
        const nextRoundIndex = parseInt(nextRoundStr) - 1;
        const nextMatchIndex = parseInt(nextMatchStr) - 1;
        
        if (nextRoundIndex < updatedRounds.length) {
          const nextMatch = updatedRounds[nextRoundIndex][nextMatchIndex];
          
          // Determine if this winner should be team1 or team2 in the next match
          // In standard brackets, even-indexed matches feed into team1 positions,
          // and odd-indexed matches feed into team2 positions
          const matchIndexInRound = currentRound.findIndex(m => m.id === match.id);
          if (matchIndexInRound % 2 === 0) {
            nextMatch.team1 = match.winner;
          } else {
            nextMatch.team2 = match.winner;
          }
        }
      }
    }
  }
  
  return updatedRounds;
};

// Helper to get top teams from each group as qualified teams
const getQualifiedTeamsFromGroups = (groups, teamsPerGroup = 2) => {
  const qualifiedTeams = [];
  
  groups.forEach(group => {
    // Sort by points (descending)
    const sortedTeams = [...group.standings]
      .sort((a, b) => {
        // First sort by points
        if (b.points !== a.points) return b.points - a.points;
        
        // If tied on points, sort by goal difference
        const aGoalDiff = a.goalsFor - a.goalsAgainst;
        const bGoalDiff = b.goalsFor - b.goalsAgainst;
        if (bGoalDiff !== aGoalDiff) return bGoalDiff - aGoalDiff;
        
        // If still tied, sort by goals for
        return b.goalsFor - a.goalsFor;
      });
    
    // Take top teams from each group
    sortedTeams.slice(0, teamsPerGroup).forEach(team => {
      qualifiedTeams.push({
        ...team,
        groupName: group.name,
        groupId: group.id
      });
    });
  });
  
  return qualifiedTeams;
};

// Main PlayoffsBracket component
const PlayoffsBracket = ({ groups, matchResults = [], onSaveResult = () => {} }) => {
  const [bracketRounds, setBracketRounds] = useState([]);
  const [editMatchId, setEditMatchId] = useState(null);
  const [editScores, setEditScores] = useState({ score1: 0, score2: 0 });
  
  // Generate playoff bracket when groups data changes
  useEffect(() => {
    if (groups && groups.length > 0) {
      // Get top 2 teams from each group
      const qualifiedTeams = getQualifiedTeamsFromGroups(groups, 2);
      
      // Generate the initial bracket
      const initialBracket = generatePlayoffBracket(qualifiedTeams);
      
      // Apply any existing results and advance teams
      const updatedBracket = advanceTeamsInBracket(initialBracket);
      
      setBracketRounds(updatedBracket);
    }
  }, [groups]);
  
  // Handle editing a match
  const handleEditMatch = (match) => {
    setEditMatchId(match.id);
    setEditScores({
      score1: match.score1 || 0,
      score2: match.score2 || 0
    });
  };
  
  // Handle saving a match result
  const handleSaveResult = (matchId) => {
    const updatedBracket = [...bracketRounds];
    
    // Find and update the match
    let matchFound = false;
    for (let i = 0; i < updatedBracket.length; i++) {
      const matchIndex = updatedBracket[i].findIndex(m => m.id === matchId);
      if (matchIndex !== -1) {
        const match = updatedBracket[i][matchIndex];
        match.score1 = editScores.score1;
        match.score2 = editScores.score2;
        
        // Determine winner
        if (editScores.score1 > editScores.score2) {
          match.winner = match.team1;
        } else if (editScores.score2 > editScores.score1) {
          match.winner = match.team2;
        } else {
          // In case of a tie, we could handle penalties or other tiebreakers
          // For now, we'll just clear the winner
          match.winner = null;
        }
        
        matchFound = true;
        break;
      }
    }
    
    if (matchFound) {
      // Advance winners through the bracket
      const finalBracket = advanceTeamsInBracket(updatedBracket);
      setBracketRounds(finalBracket);
      
      // Call parent callback if needed
      onSaveResult({
        matchId,
        ...editScores,
        winner: finalBracket.find(round => round.some(m => m.id === matchId))
          ?.find(m => m.id === matchId)?.winner
      });
      
      setEditMatchId(null);
    }
  };
  
  const cancelEdit = () => {
    setEditMatchId(null);
  };
  
  // Check if we have bracket data to show
  if (!bracketRounds.length) {
    return (
      <div className="flex items-center justify-center h-64 w-full bg-gray-900/30 rounded-lg border border-gray-800">
        <div className="text-center">
          <FaTrophy className="mx-auto text-4xl text-primary/50 mb-4" />
          <p className="text-gray-400">Waiting for group stage to complete...</p>
          <p className="text-sm text-gray-500 mt-2">Top 2 teams from each group will advance to playoffs</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-2xl font-custom tracking-widest text-white flex items-center">
          <FaTrophy className="mr-2 text-primary" />
          Knockout Stage
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Top teams from the group stage compete in a single elimination bracket
        </p>
      </div>
      
      <div className="overflow-x-auto pb-6">
        <div className="flex min-w-max space-x-8 p-4">
          {bracketRounds.map((round, roundIndex) => (
            <div 
              key={`round-${roundIndex}`} 
              className="flex flex-col justify-around"
              style={{ minHeight: round.length * 180 + (round.length - 1) * 40 }}
            >
              <div className="mb-4 text-center">
                <span className="px-4 py-1 rounded-full bg-gray-800 text-primary text-sm font-bold">
                  {roundIndex === bracketRounds.length - 1 
                    ? "Final" 
                    : roundIndex === bracketRounds.length - 2 
                      ? "Semi-Finals" 
                      : roundIndex === bracketRounds.length - 3 
                        ? "Quarter-Finals"
                        : `Round ${roundIndex + 1}`}
                </span>
              </div>
              
              <div className="flex flex-col justify-around h-full">
                {round.map((match, matchIndex) => (
                  <BracketMatch
                    key={match.id}
                    match={match}
                    isEditing={editMatchId === match.id}
                    editScores={editScores}
                    setEditScores={setEditScores}
                    onEdit={() => handleEditMatch(match)}
                    onSave={() => handleSaveResult(match.id)}
                    onCancel={cancelEdit}
                    isFinal={roundIndex === bracketRounds.length - 1}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="mt-8 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
        <h3 className="text-lg font-semibold mb-2 text-primary">Playoffs Information</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500/40 mr-2"></div>
            <p className="text-sm">Winners advance to next round</p>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-yellow-500/40 mr-2"></div>
            <p className="text-sm">Final match determines tournament champion</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          All matches are played as single elimination. In case of a tie, additional rules may apply based on tournament settings.
        </p>
      </div>
    </div>
  );
};

// Match card component for bracket visualization
const BracketMatch = ({ 
  match, 
  isEditing, 
  editScores, 
  setEditScores, 
  onEdit, 
  onSave, 
  onCancel,
  isFinal 
}) => {
  // Helper for background styling
  const getBackgroundStyle = (team) => {
    if (!team) return {};
    
    return {
      backgroundImage: team.teamImage ? `url(${team.teamImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.2,
    };
  };
  
  // Handle score changes
  const handleScoreChange = (team, value) => {
    if (isEditing) {
      setEditScores(prev => ({
        ...prev,
        [team]: Math.max(0, value)
      }));
    }
  };
  
  return (
    <motion.div 
      className="w-64 h-auto rounded-lg overflow-hidden bg-gray-900/30 border border-gray-800 relative mb-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Highlight for final match */}
      {isFinal && (
        <motion.div 
          className="absolute inset-0 border-2 border-yellow-500/50 rounded-lg pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 0 rgba(234, 179, 8, 0)',
              '0 0 8px rgba(234, 179, 8, 0.6)',
              '0 0 0 rgba(234, 179, 8, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    
      {/* Champion badge for final winner */}
      {isFinal && match.winner && (
        <div className="absolute -top-3 -right-3 bg-yellow-500 rounded-full p-2 z-10 shadow-lg">
          <FaTrophy className="text-gray-900" />
        </div>
      )}
      
      {/* Match content */}
      <div className="p-3">
        {/* Match header */}
        <div className="flex justify-between items-center mb-2 text-xs text-gray-400">
          <span className="font-mono">{match.id}</span>
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="bg-primary/20 hover:bg-primary/40 px-2 py-1 rounded text-primary text-xs transition-colors"
              disabled={!match.team1 || !match.team2}
            >
              {match.score1 !== null ? 'Edit' : 'Set Score'}
            </button>
          ) : (
            <div className="flex space-x-1">
              <button
                onClick={onSave}
                className="bg-green-600/20 hover:bg-green-600/40 px-2 py-0.5 rounded text-green-500 text-xs transition-colors"
              >
                Save
              </button>
              <button
                onClick={onCancel}
                className="bg-red-600/20 hover:bg-red-600/40 px-2 py-0.5 rounded text-red-500 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
        
        {/* Teams */}
        <div className="space-y-2">
          {/* Team 1 */}
          <div className={`relative rounded-md overflow-hidden transition-all ${
            match.winner === match.team1 ? 'border-l-4 border-green-500' : ''
          }`}>
            <div className="absolute inset-0 z-0">
              <div
                className="absolute inset-0"
                style={getBackgroundStyle(match.team1)}
              ></div>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
                }}
              ></div>
            </div>
            
            <div className="p-2 flex justify-between items-center relative z-10">
              <div className="flex items-center">
                {match.team1 && match.team1.teamImage && (
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800 mr-2 border border-gray-700">
                    <img src={match.team1.teamImage} alt={match.team1.teamName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <span className="text-xs text-gray-400">
                    {match.team1 && match.team1.groupName ? match.team1.groupName : "TBD"}
                  </span>
                  <div className={`font-valorant ${match.team1 ? 'text-white' : 'text-gray-500'}`}>
                    {match.team1 ? match.team1.teamName : "To Be Determined"}
                  </div>
                </div>
              </div>
              
              <div className="w-10 text-center">
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    value={editScores.score1}
                    onChange={(e) => handleScoreChange('score1', parseInt(e.target.value))}
                    className="w-10 bg-gray-800 border border-gray-700 rounded text-center text-white"
                  />
                ) : (
                  <span className="text-xl font-bold text-primary">
                    {match.score1 !== null ? match.score1 : "-"}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Versus divider */}
          <div className="flex items-center justify-center">
            <div className="h-px flex-grow bg-gray-800"></div>
            <span className="px-2 text-gray-500 text-xs">VS</span>
            <div className="h-px flex-grow bg-gray-800"></div>
          </div>
          
          {/* Team 2 */}
          <div className={`relative rounded-md overflow-hidden transition-all ${
            match.winner === match.team2 ? 'border-l-4 border-green-500' : ''
          }`}>
            <div className="absolute inset-0 z-0">
              <div
                className="absolute inset-0"
                style={getBackgroundStyle(match.team2)}
              ></div>
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)',
                }}
              ></div>
            </div>
            
            <div className="p-2 flex justify-between items-center relative z-10">
              <div className="flex items-center">
                {match.team2 && match.team2.teamImage && (
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800 mr-2 border border-gray-700">
                    <img src={match.team2.teamImage} alt={match.team2.teamName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <span className="text-xs text-gray-400">
                    {match.team2 && match.team2.groupName ? match.team2.groupName : "TBD"}
                  </span>
                  <div className={`font-valorant ${match.team2 ? 'text-white' : 'text-gray-500'}`}>
                    {match.team2 ? match.team2.teamName : "To Be Determined"}
                  </div>
                </div>
              </div>
              
              <div className="w-10 text-center">
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    value={editScores.score2}
                    onChange={(e) => handleScoreChange('score2', parseInt(e.target.value))}
                    className="w-10 bg-gray-800 border border-gray-700 rounded text-center text-white"
                  />
                ) : (
                  <span className="text-xl font-bold text-primary">
                    {match.score2 !== null ? match.score2 : "-"}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Match bottom info */}
      <div className="bg-gray-900 p-2 text-xs text-gray-400 flex justify-between">
        <div className="flex items-center">
          <FaRegClock className="mr-1" />
          <span>TBD</span>
        </div>
        <div className="flex items-center">
          {match.winner && (
            <>
              <FaMedal className="mr-1 text-yellow-500" />
              <span className="text-yellow-500">
                {match.winner.teamName}
              </span>
            </>
          )}
        </div>
      </div>
      
      {/* Connector lines for bracket visualization */}
      {match.nextMatchId && (
        <div className="absolute right-0 top-1/2 w-8 border-t-2 border-gray-700"></div>
      )}
    </motion.div>
  );
};

export default PlayoffsBracket;