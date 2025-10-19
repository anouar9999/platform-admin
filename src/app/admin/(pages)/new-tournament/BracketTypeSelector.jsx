import React from 'react';

const BracketTypeSelector = ({ 
  value, 
  onChange, 
  name = 'bracket_type',
  className = ''
}) => {
  const bracketTypes = [
    { 
      id: 'single_elimination', 
      label: 'Simple Elimination', 
      description: 'Un seul match perdu = élimination' 
    },
    { 
      id: 'double_elimination', 
      label: 'Double Elimination', 
      description: 'Deux chances avant l\'élimination' 
    },
    { 
      id: 'round_robin', 
      label: 'Round Robin', 
      description: 'Tous les participants s\'affrontent' 
    },
    { 
      id: 'battle_royale', 
      label: 'Battle Royale', 
      description: 'Dernier survivant gagne' 
    }
  ];

  const handleChange = (selectedValue) => {
    onChange({
      target: {
        name,
        value: selectedValue
      }
    });
  };

  return (
    <div className={`relative ${className}`}>
      <label className="absolute text-[14px] font-ea-football text-gray-300 leading-tight tracking-widest -translate-y-7 top-3 left-4 text-xs rounded-md px-2 z-20">
        Format du Tournoi
      </label>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {bracketTypes.map(({ id, label, description }) => (
          <label
            key={id}
            className={`relative group p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden
              ${value === id 
                ? 'border-blue-500 bg-gradient-to-br from-blue-500/10 to-purple-500/10 shadow-xl shadow-blue-500/20' 
                : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800/70 hover:shadow-lg'
              }`}
          >
            <input
              type="radio"
              name={name}
              value={id}
              checked={value === id}
              onChange={() => handleChange(id)}
              className="sr-only"
            />
            
            {/* Background Pattern */}
            <div className={`absolute inset-0 opacity-5 ${value === id ? 'opacity-10' : ''}`}>
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-current"></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full bg-current"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  value === id 
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/50' 
                    : 'bg-gray-500 group-hover:bg-gray-400'
                }`}></div>
                {value === id && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
              
              <div className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
                value === id ? 'text-blue-400' : 'text-white group-hover:text-gray-200'
              }`}>
                {label}
              </div>
              
              <div className={`text-sm transition-colors duration-300 ${
                value === id ? 'text-gray-300' : 'text-gray-400 group-hover:text-gray-300'
              }`}>
                {description}
              </div>
            </div>
            
            {/* Selection Overlay */}
            {value === id && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Hidden native select for form submission compatibility */}
      <select 
        name={name}
        value={value}
        onChange={onChange}
        className="sr-only"
        aria-hidden="true"
      >
        <option value="">Sélectionner le format</option>
        {bracketTypes.map(type => (
          <option key={type.id} value={type.id}>{type.label}</option>
        ))}
      </select>
    </div>
  );
};

export default BracketTypeSelector;