import React from 'react';
import { Users } from 'lucide-react';

const TeamSizeInput = React.forwardRef(({ value, onChange, name, competitionType, className, ...props }, ref) => {
  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    // Remove non-numeric characters
    newValue = newValue.replace(/[^0-9]/g, '');
    
    // Enforce maximum of 3 digits (999)
    if (newValue.length > 3) {
      newValue = newValue.slice(0, 3);
    }
    
    // Enforce minimum of 2 teams
    if (newValue && Number(newValue) < 2) {
      newValue = '2';
    }
    
    // Common tournament bracket sizes
    if (newValue) {
      const num = Number(newValue);
      const bracketSizes = [2, 4, 8, 16, 32, 64, 128];
      const nearestSize = bracketSizes.reduce((prev, curr) => 
        Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev
      );
      newValue = nearestSize.toString();
    }

    // Call onChange with the expected format for react-hook-form
    if (onChange) {
      onChange(newValue);
    }
  };

  const recommendedSlots = {
    'League of Legends': {
      sizes: [8, 16, 32],
      description: 'MOBA 5v5',
      teamSize: 5
    },
    'Valorant': {
      sizes: [8, 16, 32],
      description: 'Tournoi tactique 5v5',
      teamSize: 5
    },
    'Counter-Strike 2': {
      sizes: [8, 16, 32],
      description: 'FPS tactique 5v5',
      teamSize: 5
    },
    'Rocket League': {
      sizes: [8, 16, 32],
      description: 'Football automobile 3v3',
      teamSize: 3
    },
    'Call of Duty': {
      sizes: [16, 32, 64],
      description: 'FPS compétitif',
      teamSize: 4
    },
    'Apex Legends': {
      sizes: [12, 24, 48],
      description: 'Battle Royale 3v3',
      teamSize: 3
    },
    'Fortnite': {
      sizes: [12, 24, 48],
      description: 'Battle Royale',
      teamSize: 1
    },
    'FIFA 24': {
      sizes: [8, 16, 32],
      description: 'Football simulation 1v1',
      teamSize: 1
    }
  };

  const getRecommendedSizes = (type) => {
    return recommendedSlots[type]?.sizes || [8, 16, 32];
  };

  const defaultSizes = [8, 16, 32, 64];
  const sizesToShow = competitionType ? getRecommendedSizes(competitionType) : defaultSizes;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-300 ">
        Nombre Maximum d Équipes <span className="text-red-500">*</span>
      </label>
      
      <div className="relative">
        <input
          ref={ref}
          type="text"
          name={name}
          value={value || ''}
          onChange={handleInputChange}
          className={`w-[53%] bg-[#21324F] text-white  rounded-lg py-3 px-12 text-lg font-medium
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            transition-all duration-300 ${className || ''}`}
          placeholder={sizesToShow[0]?.toString() || '16'}
          {...props}
        />
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
          <Users className="w-5 h-5" />
        </div>
        <div className="absolute right-1/2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-sm">
          equipes
        </div>
      </div>

      {/* Quick select buttons for common bracket sizes */}
      <div className="flex flex-wrap gap-2">
        {sizesToShow.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleInputChange({ target: { value: num.toString() } })}
            className={`px-4 py-1 text-sm  angular-cut font-ea-football transition-all duration-200 ${
              Number(value) === num 
                ? 'bg-primary text-black shadow-lg' 
                : 'bg-[#21324F] hover:bg-gray-600 text-gray-300 '
            }`}
          >
            {num} équipes
          </button>
        ))}
      </div>

      {/* Game-specific recommendations */}
      {competitionType && recommendedSlots[competitionType] && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400 font-medium text-sm">
              {competitionType}:
            </span>
            <span className="text-sm text-gray-400">
              {recommendedSlots[competitionType].description}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            <p className="mb-2 font-medium">Tailles de tournoi recommandées:</p>
            <div className="space-y-1">
              {recommendedSlots[competitionType].sizes.map((size, index) => (
                <div key={size} className="flex justify-between">
                  <span>
                    {size} équipes - {index === 0 ? 'Petit' : index === 1 ? 'Moyen' : 'Grand'} tournoi
                  </span>
                  <span className="text-blue-400">
                    ({size * (recommendedSlots[competitionType].teamSize || 1)} joueurs)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

TeamSizeInput.displayName = 'TeamSizeInput';

export default TeamSizeInput;