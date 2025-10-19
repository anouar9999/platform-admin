import React, { useState } from 'react';

const MatchFormatSelector = ({ 
  value, 
  onChange, 
  game,
  name = 'match_format',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Different match format options based on game type
  const formatOptions = {
    'League of Legends': [
      { id: 'Bo1', label: 'Best of 1', description: 'Match unique', icon: '🎮' },
      { id: 'Bo3', label: 'Best of 3', description: 'Meilleur des trois matchs', icon: '🏅' },
      { id: 'Bo5', label: 'Best of 5', description: 'Meilleur des cinq matchs', icon: '🏆' }
    ],
    'Counter-Strike 2': [
      { id: 'Bo1', label: 'Best of 1', description: 'Match unique', icon: '🎮' },
      { id: 'Bo3', label: 'Best of 3', description: 'Meilleur des trois matchs', icon: '🏅' },
      { id: 'Bo5', label: 'Best of 5', description: 'Meilleur des cinq matchs', icon: '🏆' }
    ],
    'Valorant': [
      { id: 'Bo1', label: 'Best of 1', description: 'Match unique', icon: '🎮' },
      { id: 'Bo3', label: 'Best of 3', description: 'Meilleur des trois matchs', icon: '🏅' },
      { id: 'Bo5', label: 'Best of 5', description: 'Meilleur des cinq matchs', icon: '🏆' }
    ],
    'FIFA 24': [
      { id: 'Bo1', label: 'Best of 1', description: 'Match unique', icon: '⚽' },
      { id: 'Bo3', label: 'Best of 3', description: 'Meilleur des trois matchs', icon: '🏅' }
    ],
    'Rocket League': [
      { id: 'Bo1', label: 'Best of 1', description: 'Match unique', icon: '🚗' },
      { id: 'Bo3', label: 'Best of 3', description: 'Meilleur des trois matchs', icon: '🏅' },
      { id: 'Bo5', label: 'Best of 5', description: 'Meilleur des cinq matchs', icon: '🏆' },
      { id: 'Bo7', label: 'Best of 7', description: 'Meilleur des sept matchs', icon: '👑' }
    ],
    'default': [
      { id: 'Bo1', label: 'Best of 1', description: 'Match unique', icon: '🎮' },
      { id: 'Bo3', label: 'Best of 3', description: 'Meilleur des trois matchs', icon: '🏅' },
      { id: 'Bo5', label: 'Best of 5', description: 'Meilleur des cinq matchs', icon: '🏆' }
    ]
  };

  // Use game-specific options if available, otherwise default
  const options = (game && formatOptions[game]) ? formatOptions[game] : formatOptions.default;
  
  // Find the currently selected option for display
  const selectedOption = options.find(option => option.id === value) || { 
    label: 'Selectionner un format', 
    description: 'Choisissez un format de match',
    icon: '⚙️'
  };

  const handleOptionClick = (optionId) => {
    onChange({
      target: {
        name,
        value: optionId
      }
    });
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="absolute text-[14px] font-ea-football text-gray-300 leading-tight tracking-widest -translate-y-7 top-3 left-4 text-xs rounded-md px-2 z-20">
        Format de Match
      </label>
      
      {/* Custom select button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-[#21324F] text-gray-500 font-ea-football text-sm tracking-wider rounded-lg px-6 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 text-left relative pr-10 border border-transparent transition-all duration-200 hover:bg-[#21324F]/80"
      >
        <div className="flex items-center">
          {selectedOption.icon && <span className="mr-2">{selectedOption.icon}</span>}
          <div>
            <div className="text-gray-400">{selectedOption.label}</div>
            {selectedOption.description && (
              <div className="text-xs text-gray-500">{selectedOption.description}</div>
            )}
          </div>
        </div>
        
        {/* Dropdown arrow */}
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      </button>
      
      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute font-ea-football z-30 mt-1 w-full bg-[#21324F] backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option.id)}
                className={`
                  w-full text-left px-6 py-2 hover:bg-primary/10 flex items-center transition-colors duration-200
                  ${value === option.id ? 'bg-primary/20 text-primary border-l-4 border-primary' : 'border-l-4 border-transparent hover:border-l-4 hover:border-primary/50'}
                `}
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-400">{option.description}</div>
                </div>
                
                {/* Selected indicator */}
                {value === option.id && (
                  <div className="ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Hidden native select for form submission */}
      <select 
        name={name}
        value={value}
        onChange={onChange}
        className="sr-only"
        aria-hidden="true"
      >
        <option value="" className='text-gray-400'>Selectionner un format</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default MatchFormatSelector;