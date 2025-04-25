import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaEdit,
  FaTrophy,
  FaFilter,
  FaCalendarAlt,
  FaUserFriends,
  FaCheck,
} from 'react-icons/fa';
import { ChevronDown, ChevronUp, Trophy, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomDropdown from './CustomDropdown';
import { Dialog } from '@headlessui/react';

// Score Input Dialog Component


// Improved Modal component for showing matches in a group with filtering options
const GroupModal = ({
  isOpen,
  onClose,
  group,
  mockResults,
  onSaveResult,
}) => {
  const [currentRound, setCurrentRound] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [generatedMatches, setGeneratedMatches] = useState([]);
  
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentMatchData, setCurrentMatchData] = useState({
    roundIndex: null,
    matchIndex: null,
    teamA: null,
    teamB: null,
  });
console.log()
  // Use existing match data instead of generating it
  useEffect(() => {
    if (group && group.matches) {
      // Group matches are already in the correct structure
      const matches = group.matches;
      
      // Apply any existing results to the matches
      if (mockResults && mockResults.length > 0) {
        const updatedMatches = matches.map((round, roundIndex) => 
          round.map((match, matchIndex) => {
            const result = mockResults.find(
              r => r.groupId === group.id && r.round === roundIndex && r.matchIndex === matchIndex
            );
            
            if (result) {
              return {
                ...match,
                team1_score: result.team1Score,
                team2_score: result.team2Score,
                played: result.team1Score !== '-' && result.team2Score !== '-'
              };
            }
            return match;
          })
        );
        setGeneratedMatches(updatedMatches);
      } else {
        setGeneratedMatches(matches);
      }
    }
  }, [group, mockResults]);

  if (!isOpen || !group) return null;

  // Options for filters
  const statusOptions = [
    { value: 'all', label: 'All Matches' },
    { value: 'played', label: 'Played Matches', icon: <FaTrophy className="text-green-500" /> },
    {
      value: 'upcoming',
      label: 'Upcoming Matches',
      icon: <FaCalendarAlt className="text-blue-500" />,
    },
  ];

  // Check if a match is played
  const isMatchPlayed = (match) => {
    return match.team1_score !== '-' && match.team2_score !== '-';
  };

  // Handle opening score editor dialog
  const handleOpenScoreEditor = (roundIndex, matchIndex, match) => {
    setCurrentMatchData({
      roundIndex,
      matchIndex,
      teamA: {
        name: match.team1_name,
        logo: match.team1_logo,
        id: match.team1_id,
      },
      teamB: {
        name: match.team2_name,
        logo: match.team2_logo,
        id: match.team2_id,
      },
    });
    setEditDialogOpen(true);
  };

  // Handle saving match result
  const handleSaveScores = (scoreA, scoreB) => {
    const { roundIndex, matchIndex } = currentMatchData;
      console.log(currentMatchData)
    const updatedResult = {
      groupId: group.id,
      round: roundIndex,
      matchIndex: matchIndex,
      team1Score: scoreA,
      team2Score: scoreB,
    };

    onSaveResult(updatedResult);
    
    // Update our local state for immediate UI refresh
    const updatedMatches = [...generatedMatches];
    if (updatedMatches[roundIndex] && updatedMatches[roundIndex][matchIndex]) {
      updatedMatches[roundIndex][matchIndex] = {
        ...updatedMatches[roundIndex][matchIndex],
        team1_score: scoreA,
        team2_score: scoreB,
        played: true
      };
      setGeneratedMatches(updatedMatches);
    }
  };

  // Get matches for the current round with filters applied
  const getProcessedMatches = () => {
    if (!generatedMatches || !generatedMatches[currentRound]) return [];

    // Get matches for this round
    return generatedMatches[currentRound].filter(match => {
      // Apply status filter
      if (statusFilter === 'all') return true;
      return statusFilter === 'played' ? isMatchPlayed(match) : !isMatchPlayed(match);
    });
  };

  const processedMatches = getProcessedMatches();
  const totalRounds = generatedMatches.length;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75">
      <div className="w-full max-w-7xl h-[90vh] overflow-hidden bg-secondary shadow-xl angular-cut">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-secondary flex justify-between items-center">
          <h2 className="text-2xl font-custom tracking-widest text-primary flex items-center">
            <FaTrophy className="mr-2" />
            {group.name} - Round {currentRound + 1}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Close"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Filter and Round Selection Section */}
        <div className="px-6 py-3 border-b border-secondary bg-dark/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter section */}
            {/* <div className="flex flex-col md:flex-row gap-3">
              <div className="text-xs uppercase tracking-wider text-gray-500 md:self-center">
                <FaFilter className="inline mr-1" /> Filters:
              </div>

              <CustomDropdown
                options={statusOptions}
                selected={statusFilter}
                onSelect={setStatusFilter}
                placeholder="Match Status"
                className="w-full md:w-40"
              />
            </div> */}

            {/* Round Selection */}
            <div className="flex items-center ml-auto">
              <div className="text-xs uppercase tracking-wider text-gray-400 mr-3 px-2 py-1 rounded-lg">
                <FaCalendarAlt className="inline mr-1" /> ROUND
              </div>
              <div className="flex rounded-lg bg-secondary p-1">
                {Array.from({ length: totalRounds }, (_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentRound(index)}
                    className={`px-4 py-1.5 text-sm rounded-md transition-all duration-200 ${
                      currentRound === index
                        ? 'bg-gradient-to-r from-primary to-primary/85 text-white font-medium shadow-lg'
                        : 'bg-transparent text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: currentRound === index ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {index + 1}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body - Scrollable Content */}
        <div className="overflow-y-auto h-[calc(90vh-130px)]">
          <div className="p-6 space-y-6">
            {processedMatches.length > 0 ? (
              processedMatches.map((match, idx) => (
                <InteractiveMatchCard
                  key={`match-${currentRound}-${idx}`}
                  match={match}
                  currentRound={currentRound}
                  matchIndex={match.id}
                  groupId={group.id}
                  onEditClick={() => handleOpenScoreEditor(currentRound, idx, match)}
                  onSaveResult={onSaveResult}
                />
              ))
            ) : (
              <div className="text-center py-8 bg-gray-900/20 rounded-lg border border-gray-800">
                <p className="text-gray-400">No matches found for this round with the current filter</p>
              </div>
            )}
          </div>
        </div>
        
      </div>

      
    </div>
  );
};

// Interactive Match Card Component
const InteractiveMatchCard = ({ match, currentRound, matchIndex, groupId, onEditClick, onSaveResult }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [scores, setScores] = useState({
    team1: match.team1_score === "-" ? 0 : parseInt(match.team1_score) || 0,
    team2: match.team2_score === "-" ? 0 : parseInt(match.team2_score) || 0,
  });
  const [animation, setAnimation] = useState({ team: null, direction: null });
  // Add local state to track displayed scores
  const [displayedScores, setDisplayedScores] = useState({
    team1: match.team1_score,
    team2: match.team2_score
  });

  // Update scores when match prop changes
  useEffect(() => {
    setScores({
      team1: match.team1_score === "-" ? 0 : parseInt(match.team1_score) || 0,
      team2: match.team2_score === "-" ? 0 : parseInt(match.team2_score) || 0,
    });
    setDisplayedScores({
      team1: match.team1_score,
      team2: match.team2_score
    });
  }, [match.team1_score, match.team2_score]);

  // Update score function
  const updateScore = (team, increment) => {
    const newScore = Math.max(0, scores[team] + increment);
    setScores((prev) => ({ ...prev, [team]: newScore }));

    // Trigger animation
    setAnimation({ team, direction: increment > 0 ? 'up' : 'down' });
    setTimeout(() => setAnimation({ team: null, direction: null }), 500);
  };

  // Save the score
  const handleSaveScores = () => {
    const updatedResult = {
      groupId: groupId,
      round: currentRound,
      matchIndex: matchIndex,
      team1Score: scores.team1,
      team2Score: scores.team2,
    };

    // Update displayed scores immediately
    setDisplayedScores({
      team1: scores.team1.toString(),
      team2: scores.team2.toString()
    });
    
    onSaveResult(updatedResult);
    setIsEditing(false);
  };

  // Winner determination
  const getWinner = () => {
    if (scores.team1 > scores.team2) return 'team1';
    if (scores.team2 > scores.team1) return 'team2';
    return null;
  };

  const winner = getWinner();
  const isPlayed = match.team1_score !== '-' && match.team2_score !== '-';

  return (
    <div className="w-full overflow-hidden mb-4">
      {/* Match Card */}
      <div className="relative shadow-lg">
        {/* Background image containers */}
        <div className="absolute inset-0 m-0 p-0 border-none z-0 overflow-hidden">
          {/* Left side background (Team A) */}
          <div className={`absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-all duration-500 ${winner === 'team1' && !isEditing ? 'bg-gradient-to-r from-yellow-900/10 to-transparent' : ''}`}>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: match.team1_logo ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${match.team1_logo})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'left center',
                opacity: winner === 'team1' && !isEditing ? 0.45 : 0.35,
              }}
            ></div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.9) 100%)',
              }}
            ></div>
          </div>

          {/* Right side background (Team B) */}
          <div className={`absolute inset-y-0 right-0 w-1/2 rounded-r-lg overflow-hidden transition-all duration-500 ${winner === 'team2' && !isEditing ? 'bg-gradient-to-l from-yellow-900/10 to-transparent' : ''}`}>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: match.team2_logo ? `url(${process.env.NEXT_PUBLIC_BACKEND_URL}${match.team2_logo})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'right center',
                opacity: winner === 'team2' && !isEditing ? 0.45 : 0.35,
              }}
            ></div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  'linear-gradient(to left, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.5) 80%, rgba(0,0,0,0.9) 100%)',
              }}
            ></div>
          </div>

          {/* Center divider gradient */}
          <div
            className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-16"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.9), rgba(0,0,0,0.8))',
            }}
          ></div>
        </div>

        {/* Match Content */}
        <div className="w-full py-6 px-8 flex items-center relative z-10">
          <div className="flex items-center justify-between w-full">
            {/* Team A */}
            <div className="flex flex-col items-end text-right w-2/5">
              <motion.div
                className={`relative ${winner === 'team1' && !isEditing ? 'scale-105' : ''}`}
                animate={
                  winner === 'team1' && !isEditing
                    ? {
                        x: [0, 2, -2, 0],
                        transition: { repeat: Infinity, duration: 2 },
                      }
                    : {}
                }
              >
                <span className="text-xs font-mono font-semibold text-gray-400 tracking-wide uppercase">
                  TEAM A
                </span>
                <span className={`text-lg font-valorant hover:text-primary transition-all duration-300 truncate block ${winner === 'team1' && !isEditing ? 'text-yellow-400' : ''}`}>
                  {match.team1_name}
                </span>

                {/* Winner trophy - Enhanced */}
                {winner === 'team1' && !isEditing && isPlayed && (
                  <motion.div
                    className="absolute -top-4 -left-8 flex items-center"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      className="bg-yellow-500/20 rounded-full p-1.5"
                      animate={{ 
                        boxShadow: ['0 0 0px rgba(234, 179, 8, 0.5)', '0 0 15px rgba(234, 179, 8, 0.8)', '0 0 0px rgba(234, 179, 8, 0.5)'],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaTrophy className="text-yellow-500 text-xl" />
                    </motion.div>
                    <motion.span 
                      className="ml-1 text-xs font-bold text-yellow-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      WINNER
                    </motion.span>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Score Section */}
            <div className="flex items-center justify-center w-1/5 relative">
              {isEditing ? (
                /* Editing Mode - Score Controls */
                <div className="flex items-center space-x-4">
                  {/* Team A Score Controls */}
                  <div className="relative">
                    <div className="flex flex-col">
                      <motion.button
                        onClick={() => updateScore('team1', 1)}
                        className="bg-green-500/30 hover:bg-green-500/50 rounded-t w-10 h-8 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronUp size={18} className="text-green-300" />
                      </motion.button>

                      <div className="relative w-10 h-12 flex items-center justify-center bg-gray-800/80">
                        <AnimatePresence>
                          {animation.team === 'team1' && (
                            <motion.span
                              className={`absolute text-xl font-bold ${
                                animation.direction === 'up' ? 'text-green-400' : 'text-red-400'
                              }`}
                              initial={{ opacity: 1, y: animation.direction === 'up' ? 10 : -10 }}
                              animate={{ opacity: 0, y: animation.direction === 'up' ? -10 : 10 }}
                              exit={{ opacity: 0 }}
                            >
                              {animation.direction === 'up' ? '+1' : '-1'}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <span className="text-2xl font-bold text-white">{scores.team1}</span>
                      </div>

                      <motion.button
                        onClick={() => updateScore('team1', -1)}
                        className="bg-red-500/30 hover:bg-red-500/50 rounded-b w-10 h-8 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronDown size={18} className="text-red-300" />
                      </motion.button>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-lg font-extrabold text-gray-500 px-1">VS</div>

                  {/* Team B Score Controls */}
                  <div className="relative">
                    <div className="flex flex-col">
                      <motion.button
                        onClick={() => updateScore('team2', 1)}
                        className="bg-green-500/30 hover:bg-green-500/50 rounded-t w-10 h-8 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronUp size={18} className="text-green-300" />
                      </motion.button>

                      <div className="relative w-10 h-12 flex items-center justify-center bg-gray-800/80">
                        <AnimatePresence>
                          {animation.team === 'team2' && (
                            <motion.span
                              className={`absolute text-xl font-bold ${
                                animation.direction === 'up' ? 'text-green-400' : 'text-red-400'
                              }`}
                              initial={{ opacity: 1, y: animation.direction === 'up' ? 10 : -10 }}
                              animate={{ opacity: 0, y: animation.direction === 'up' ? -10 : 10 }}
                              exit={{ opacity: 0 }}
                            >
                              {animation.direction === 'up' ? '+1' : '-1'}
                            </motion.span>
                          )}
                        </AnimatePresence>
                        <span className="text-2xl font-bold text-white">{scores.team2}</span>
                      </div>

                      <motion.button
                        onClick={() => updateScore('team2', -1)}
                        className="bg-red-500/30 hover:bg-red-500/50 rounded-b w-10 h-8 flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ChevronDown size={18} className="text-red-300" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Display Mode - Score Display */
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-3xl font-free-fire ${
                      isPlayed ? 'text-primary' : 'text-gray-600'
                    }`}
                  >
                    {isPlayed ? displayedScores.team1 : '-'}
                  </span>

                  <div
                    className={`text-xl font-extrabold relative px-2 ${
                      isPlayed ? 'text-white' : 'text-gray-600'
                    }`}
                  >
                    VS
                    <span
                      className={`absolute -bottom-1 left-0 w-full h-0.5 ${
                        isPlayed ? 'bg-primary' : 'bg-gray-700'
                      }`}
                    ></span>
                  </div>

                  <span
                    className={`text-3xl font-free-fire ${
                      isPlayed ? 'text-primary' : 'text-gray-600'
                    }`}
                  >
                    {isPlayed ? displayedScores.team2 : '-'}
                  </span>
                </div>
              )}

              {/* Edit/Save Controls */}
              <div className="absolute -top-8">
                {isEditing ? (
                  <motion.button
                    onClick={handleSaveScores}
                    className="bg-green-600/80 hover:bg-green-500 text-white p-2 rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <FaCheck size={16} />
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600/50 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FaEdit size={16} />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Team B */}
            <div className="flex flex-col items-start text-left w-2/5">
              <motion.div
                className={`relative ${winner === 'team2' && !isEditing ? 'scale-105' : ''}`}
                animate={
                  winner === 'team2' && !isEditing
                    ? {
                        x: [0, 2, -2, 0],
                        transition: { repeat: Infinity, duration: 2 },
                      }
                    : {}
                }
              >
                <span className="text-xs font-mono font-semibold text-gray-400 tracking-wide uppercase">
                  TEAM B
                </span>
                <span className="text-lg font-valorant hover:text-primary transition-all duration-300 truncate block">
                  {match.team2_name}
                </span>

                {/* Winner trophy - Enhanced */}
                {winner === 'team2' && !isEditing && isPlayed && (
                  <motion.div
                    className="absolute -top-4 -right-8 flex items-center justify-end"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.span 
                      className="mr-1 text-xs font-bold text-yellow-500"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      WINNER
                    </motion.span>
                    <motion.div
                      className="bg-yellow-500/20 rounded-full p-1.5"
                      animate={{ 
                        boxShadow: ['0 0 0px rgba(234, 179, 8, 0.5)', '0 0 15px rgba(234, 179, 8, 0.8)', '0 0 0px rgba(234, 179, 8, 0.5)'],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <FaTrophy className="text-yellow-500 text-xl" />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Editing indicator - pulsing border */}
      {isEditing && (
        <motion.div
          className="absolute inset-0 rounded-lg border-2 border-primary pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 0 rgba(249, 115, 22, 0)',
              '0 0 8px rgba(249, 115, 22, 0.8)',
              '0 0 0 rgba(249, 115, 22, 0)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </div>);


};

export default GroupModal;