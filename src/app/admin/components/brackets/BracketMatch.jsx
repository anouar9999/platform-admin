import React, { useState, useEffect } from 'react';
import { FaSpinner, FaTimes, FaTrophy, FaEdit } from 'react-icons/fa';
import { motion } from 'framer-motion';
import EditScoreModal from './EditScoreModal';
import { Seed, SeedItem } from '@sportsgram/brackets';

const BracketMatch = ({ 
  match, 
  onSave, 
  isFinal,
  hasParticipants,
  isUpdating,
  flowDirection = "right-to-left",
  isFirst = false,
  isLast = false,
  totalMatches = 1,
  matchIndex = 0
}) => {
  // State for modal and scores
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editScores, setEditScores] = useState({
    score1: match.score1 !== undefined ? match.score1 : 0,
    score2: match.score2 !== undefined ? match.score2 : 0
  });
  
  // Update local state when match prop changes
  useEffect(() => {
    setEditScores({
      score1: match.score1 !== undefined ? match.score1 : 0,
      score2: match.score2 !== undefined ? match.score2 : 0
    });
  }, [match.score1, match.score2]);
  
  // Helper for background styling
  const getBackgroundStyle = (team) => {
    if (!team) return {};
    
    return {
      backgroundImage: team.picture ? `url(${team.picture})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.2,
    };
  };
  
  // Determine match winner
  const getWinner = () => {
    if (!match.participants || match.participants.length === 0) return null;
    
    // Check if there's a participant marked as winner
    const winner = match.participants.find(p => p.is_winner);
    if (winner) return winner;
    
    // Or use scores to determine winner
    if (match.score1 !== undefined && match.score2 !== undefined) {
      if (match.score1 > match.score2 && match.participants[0]) {
        return match.participants[0];
      } else if (match.score2 > match.score1 && match.participants[1]) {
        return match.participants[1];
      }
    }
    
    return null;
  };
  
  const winner = getWinner();
  
  // Open modal for editing
  const handleOpenModal = () => {
    setEditScores({
      score1: match.score1 !== undefined ? match.score1 : 0,
      score2: match.score2 !== undefined ? match.score2 : 0
    });
    setIsModalOpen(true);
  };
  
  // Handle save from modal
  const handleSaveScores = () => {
    onSave(match.id, editScores.score1, editScores.score2);
    setIsModalOpen(false);
  };
  
  // Determine match status display
  const getMatchStatusDisplay = () => {
    if (match.state === 'SCORE_DONE' && winner) {
      return (
        <div className="text-xs text-green-500 mt-1 flex items-center justify-center">
          <FaTrophy className="mr-1" size={10} />
          <span>Completed</span>
        </div>
      );
    } else if (match.participants && match.participants.length > 0) {
      return (
        <div className="text-xs text-blue-400 mt-1 flex items-center justify-center">
          <span>Scheduled</span>
        </div>
      );
    }
    return null;
  };
  
  return (
    <>
      <Seed style={{ fontSize: 12 }}>
        <motion.div 
          className="w-60 h-auto overflow-hidden relative group"  
          initial={{ opacity: 0, x: flowDirection === "left-to-right" ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        > 
          {/* Highlight for final match */}
          {isFinal && (
            <motion.div 
              className="absolute inset-0 rounded-lg pointer-events-none"
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
          {isFinal && winner && (
            <div className="absolute -top-3 -right-3 bg-yellow-500 rounded-full p-2 z-10 shadow-lg">
              <FaTrophy className="text-gray-900" />
            </div>
          )}
          
          {/* Edit button - shows on hover */}
          <button 
            onClick={handleOpenModal}
            className="absolute top-2 right-2 bg-primary/80 hover:bg-primary text-white p-1 rounded-full z-20 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <FaEdit size={14} />
          </button>
          
          {/* Match content */}
          <div className="p-3 transition-colors rounded-md">
            {/* Match status display */}
            {getMatchStatusDisplay()}
            
            {/* Teams */}
            <div className="relative hover:cursor-pointer" onClick={handleOpenModal}>
              {/* Team 1 */}
              <div className={`relative overflow-hidden transition-all mt-2 ${
                winner && match.participants?.[0]?.id === winner.id ? 'border-l-4 border-green-500' : ''
              }`}>
                <div className="absolute inset-0 z-0">
                  {match.participants?.[0]?.picture && (
                    <div
                      className="absolute inset-0"
                      style={getBackgroundStyle(match.participants[0])}
                    ></div>
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to right, rgba(0, 0, 0, 0.0) 0%, transparent 100%)',
                    }}
                  ></div>
                </div>
                
                <div className="p-0.5 flex justify-between items-center relative z-10">
                  <div className="flex items-center">
                    {match.participants?.[0]?.picture && (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800 mr-2 border border-gray-700">
                        <img 
                          src={match.participants[0].picture} 
                          alt={match.participants[0].name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <div>
                      <div className={`font-valorant ${match.participants?.[0] ? 'text-white' : 'text-gray-500'}`}>
                        {match.participants?.[0]?.name || "TBD"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-10 text-center">
                    <span className={`text-xl font-ea-football ${
                      winner && match.participants?.[0]?.id === winner.id 
                        ? 'text-green-500' 
                        : 'text-primary'
                    }`}>
                      {match.score1 !== null && match.score1 !== undefined ? match.score1 : "-"}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-700/50 my-1"></div>
              
              {/* Team 2 */}
              <div className={`relative overflow-hidden transition-all ${
                winner && match.participants?.[1]?.id === winner.id ? 'border-l-4 border-green-500' : ''
              }`}>
                <div className="absolute inset-0 z-0">
                  {match.participants?.[1]?.picture && (
                    <div
                      className="absolute inset-0"
                      style={getBackgroundStyle(match.participants[1])}
                    ></div>
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.5) 100%)',
                    }}
                  ></div>
                </div>
                
                <div className="p-0.5 flex justify-between items-center relative z-10">
                  <div className="flex items-center">
                    {match.participants?.[1]?.picture && (
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800 mr-2 border border-gray-700">
                        <img 
                          src={match.participants[1].picture}
                          alt={match.participants[1].name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    )}
                    <div>
                      <div className={`font-valorant ${match.participants?.[1] ? 'text-white' : 'text-gray-500'}`}>
                        {match.participants?.[1]?.name || "TBD"}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-10 text-center">
                    <span className={`text-xl font-ea-football ${
                      winner && match.participants?.[1]?.id === winner.id 
                        ? 'text-green-500' 
                        : 'text-primary'
                    }`}>
                      {match.score2 !== null && match.score2 !== undefined ? match.score2 : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Connector lines for bracket visualization */}
          {match.nextMatchId && (
            <div 
              className={`absolute ${flowDirection === "left-to-right" ? "-right-8" : "-left-8"} top-1/2 transform -translate-y-1/2 w-8 h-px bg-gray-600 z-0`}
            ></div>
          )}
          
          {/* Loading overlay when updating */}
          {isUpdating && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
              <FaSpinner className="animate-spin text-2xl text-primary" />
            </div>
          )}
        </motion.div>  
      </Seed>
      
      <EditScoreModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        match={match}
        editScores={editScores}
        setEditScores={setEditScores}
        onSave={handleSaveScores}
        isUpdating={isUpdating}
      />
    </>
  );
};

export default BracketMatch;