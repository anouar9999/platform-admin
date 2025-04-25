import React, { useState } from 'react';

/**
 * Enhanced Match Format Selector component with improved UI/UX
 * 
 * @param {Object} props Component props
 * @param {string} props.value Current selected value
 * @param {Function} props.onChange Function called when selection changes
 * @param {string} props.game Game type to determine format options
 * @param {string} props.name Optional field name (defaults to 'match_format')
 * @param {string} props.className Optional additional CSS classes
 */
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
    
    'default': [
      { id: 'Bo1', label: 'Best of 1', description: 'Match unique', icon: '🎮' },
      { id: 'Bo3', label: 'Best of 3', description: 'Meilleur des trois matchs', icon: '🏅' },
      { id: 'Bo5', label: 'Best of 5', description: 'Meilleur des cinq matchs', icon: '🏆' }
    ]
  };

  // Use game-specific options if available, otherwise default
  const options = game && formatOptions[game] ? formatOptions[game] : formatOptions.default;
  
  // Find the currently selected option for display
  const selectedOption = options.find(option => option.id === value) || { label: 'Sélectionner un format', description: 'Choisissez un format de match' };

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
      <label className="absolute text-[14px] font-custom text-gray-300 leading-tight tracking-widest -translate-y-7 top-5 left-4 text-xs rounded-md bg-[#181818] px-2 z-20">
        Format de Match
      </label>
      
      {/* Custom select button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-secondary text-white rounded-xl angular-cut px-6 py-3 focus:outline-none focus:ring-2 focus:ring-primary/30 text-left relative pr-10 border border-transparent transition-all duration-200"
      >
        <div className="flex items-center">
          {selectedOption.icon && <span className="mr-2">{selectedOption.icon}</span>}
          <div>
            <div className="font-medium">{selectedOption.label}</div>
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
        <div className="absolute z-30 mt-1 w-full bg-secondary/95 backdrop-blur-sm rounded-xl angular-cut shadow-lg border border-gray-700 overflow-hidden">
          <div className="py-1 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleOptionClick(option.id)}
                className={`
                  w-full text-left px-6 py-2 hover:bg-primary/10 flex items-center
                  ${value === option.id ? 'bg-primary/20 text-primary border-l-4 border-primary' : 'border-l-4 border-transparent'}
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
        <option value="">Sélectionner un format</option>
        {options.map(option => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

export default MatchFormatSelector;