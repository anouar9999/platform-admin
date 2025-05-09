/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheck, FaSpinner, FaTimes, FaTrophy } from 'react-icons/fa';

const EditScoreModal = ({
  isOpen,
  onClose,
  match,
  editScores,
  setEditScores,
  onSave,
  isUpdating,
}) => {
  const [winner, setWinner] = useState(null);

  // Update winner when scores change
  useEffect(() => {
    if (editScores.score1 > editScores.score2) {
      setWinner(match?.participants?.[0]?.id);
    } else if (editScores.score2 > editScores.score1) {
      setWinner(match?.participants?.[1]?.id);
    } else {
      setWinner(null);
    }
  }, [editScores.score1, editScores.score2, match?.participants]);

  // Update local state when match prop changes
  useEffect(() => {
    if (match) {
      setEditScores({
        score1: match.score1 !== undefined ? match.score1 : 0,
        score2: match.score2 !== undefined ? match.score2 : 0
      });
    }
  }, [match, setEditScores]);

  if (!isOpen || !match) return null;

  // Handle score change
  const handleScoreChange = (team, value) => {
    if (value === '' || /^\d+$/.test(value)) {
      if (team === 'score1') {
        setEditScores({ ...editScores, score1: value === '' ? 0 : parseInt(value) });
      } else {
        setEditScores({ ...editScores, score2: value === '' ? 0 : parseInt(value) });
      }
    }
  };

  // Handle form submission
  const handleSave = () => {
    onSave();
  };

  // Reset scores
  const resetScores = () => {
    setEditScores({
      score1: 0,
      score2: 0,
    });
    setWinner(null);
  };

  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center z-[99999999] bg-black/80 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-dark w-[620px] overflow-hidden shadow-2xl"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            onClick={handleModalClick}
          >
            {/* Header */}
            <div className="relative bg-dark px-6 py-6">
              <h2 className="font-custom tracking-wider text-5xl text-center">
                Enter Match Score
              </h2>
              <div className="text-primary text-sm mt-1 text-center font-valorant">
                {match.name}
              </div>

              {/* Close button */}
              <button
                className="absolute right-4 top-4 text-primary hover:text-white p-1 rounded-full hover:bg-gray-700 transition-colors"
                onClick={onClose}
              >
                <FaTimes />
              </button>
            </div>

            <div className="w-full p-6">
              {/* Teams and Score Input */}
              <div className="flex justify-between items-center space-x-4 mb-8">
                {/* Team 1 */}
                <motion.div
                  className="flex-1 text-center"
                  animate={winner === match?.participants?.[0]?.id ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative inline-block">
                    {match.participants?.[0]?.picture && (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-700 border border-gray-600">
                        <img
                          src={match.participants[0].picture}
                          alt={match.participants[0].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <AnimatePresence>
                      {winner === match?.participants?.[0]?.id && (
                        <motion.div
                          className="absolute -top-4 -right-4 bg-yellow-500 rounded-full p-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <FaTrophy size={25} className="text-gray-800" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-sm font-mono text-gray-400 mt-2">TEAM A</p>
                  <p className="font-ea-football text-2xl">
                    {match.participants?.[0]?.name || 'TBD'}
                  </p>
                </motion.div>

                {/* Score Input */}
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={editScores.score1}
                    onChange={(e) => handleScoreChange('score1', e.target.value)}
                    className="w-24 h-20 rounded bg-dark text-primary text-center text-7xl font-free-fire"
                    placeholder="0"
                  />
                  <div className="text-white text-3xl font-bold mx-2">:</div>
                  <input
                    type="text"
                    value={editScores.score2}
                    onChange={(e) => handleScoreChange('score2', e.target.value)}
                    className="w-24 h-20 rounded bg-dark text-primary text-center text-7xl font-free-fire"
                    placeholder="0"
                  />
                </div>

                {/* Team 2 */}
                <motion.div
                  className="flex-1 text-center"
                  animate={winner === match?.participants?.[1]?.id ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative inline-block">
                    {match.participants?.[1]?.picture && (
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-700 border border-gray-600">
                        <img
                          src={match.participants[1].picture}
                          alt={match.participants[1].name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <AnimatePresence>
                      {winner === match?.participants?.[1]?.id && (
                        <motion.div
                          className="absolute -top-4 -right-4 bg-yellow-500 rounded-full p-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <FaTrophy size={25} className="text-gray-800" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <p className="text-sm font-mono text-gray-400 mt-2">TEAM B</p>
                  <p className="font-ea-football text-2xl">
                    {match.participants?.[1]?.name || 'TBD'}
                  </p>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center items-center gap-4 mt-8 pt-4">
                <button
                  onClick={resetScores}
                  className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                  disabled={isUpdating}
                >
                  Reset
                </button>

                <motion.button
                  onClick={handleSave}
                  className="px-8 py-3 bg-primary hover:bg-primary/70 text-white font-medium transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaCheck className="mr-2" />
                      Save Final Score
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditScoreModal;