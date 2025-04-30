import React, { useState, useEffect } from 'react';
import { Check, Trophy, Gamepad, Users, Star, TrendingUp, Shield, Clock } from 'lucide-react';

const PremiumCompetitionTypeSelector = ({ competitionTypes = [], selectedType, onChange }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Set initial active index based on selectedType
  useEffect(() => {
    if (selectedType) {
      const index = competitionTypes.findIndex((data) => data.name === selectedType);
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [selectedType, competitionTypes]);

  // Handle selection
  const handleSelect = (e, index, name) => {
    // Prevent form submission
    e.preventDefault();

    if (activeIndex === index) return;

    setIsAnimating(true);
    setActiveIndex(index);

    // Delay the actual value change to allow for animation
    setTimeout(() => {
      // Check if onChange is a function and call it with just the name value
      if (typeof onChange === 'function') {
        onChange(name);
      }
      setIsAnimating(false);
    }, 400);
  };

  // Get attributes based on game type
  const getGameAttributes = (title) => {
    if (title?.includes('Valorant')) {
      return {
        playerCount: '5v5',
        difficulty: 'Élevé',
        style: 'Tactique FPS',
        color: '#fa4454',
        icon: Shield,
      };
    } else if (title?.includes('Free Fire')) {
      return {
        playerCount: 'Battle Royale',
        difficulty: 'Moyen',
        style: 'Survie',
        color: '#ff9c00',
        icon: Gamepad,
      };
    } else {
      return {
        playerCount: 'Divers',
        difficulty: 'Variable',
        style: 'Compétitif',
        color: '#38bdf8',
        icon: Gamepad,
      };
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        {/* Selection buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {competitionTypes?.length > 0 &&
            competitionTypes.map((data, index) => {
              const isActive = activeIndex === index;
              const { color, icon: GameIcon } = getGameAttributes(data.name);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => handleSelect(e, index, data.name)}
                  className={`
                  relative group overflow-hidden rounded-xl angular-cut p-4 transition-all duration-300
                  ${
                    isActive
                      ? 'r ring-offset-0 shadow-lg shadow-primary/10'
                      : 'bg-gray-900/60 ring-1 ring-gray-800/50 hover:ring-gray-700/70'
                  }
                  h-28 sm:h-32
                `}
                >
                  {/* Background Image with Overlay - Layer 1 */}
                  <div className="absolute inset-0 transition-transform duration-500 group-hover:scale-105 z-0">
                    <img
                      src={data.image}
                      alt={data.name}
                      className={`w-full h-full object-cover transition-opacity duration-300
                      ${isActive ? 'opacity-70' : 'opacity-40 group-hover:opacity-50'}`}
                    />

                    {/* Base gradient overlay - Layer 2 */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-300 z-1
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-black/40 to-gray-900/60'
                        : 'bg-gradient-to-br from-black/70 to-gray-900/80'
                    }
                  `}
                    ></div>
                  </div>

                  {/* Selection indicator - Layer 10 */}
                  {isActive && (
                    <div className="absolute top-2 right-2 z-20">
                      <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check size={10} className="text-white" />
                      </div>
                    </div>
                  )}

                  {/* Content container - ensures all content is above overlays */}
                  <div className="relative z-10 h-full flex items-end">
                    {/* Game name */}
                    <h3
                      className={`
                    text-lg font-custom tracking-wider font-medium transition-colors duration-300
                    ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}
                  `}
                    >
                      {data.name}
                    </h3>
                  </div>

                  {/* Colored accent bar instead of double border */}
                  <div
                    className={`
                    absolute bottom-0 left-0 right-0 h-1 transition-all duration-500 ease-out z-5
                    ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-70'}
                  `}
                    style={{ backgroundColor: color }}
                  ></div>

                  {/* Glow effect for active item */}
                  {isActive && (
                    <div
                      className="absolute inset-0 opacity-10 z-4 rounded-xl"
                      style={{
                        boxShadow: `inset 0 0 30px ${color}`,
                        background: `radial-gradient(circle at center, ${color}10 0%, transparent 70%)`,
                      }}
                    ></div>
                  )}
                </button>
              );
            })}
        </div>
      </div>

      <input type="hidden" name="competition_type" value={selectedType || ''} />
    </div>
  );
};

export default PremiumCompetitionTypeSelector;