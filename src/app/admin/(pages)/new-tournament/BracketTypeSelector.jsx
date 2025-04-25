import React from 'react';
import { Check } from 'lucide-react';

const BracketTypeSelector = ({ 
  value, 
  onChange, 
  name = 'bracket_type' 
}) => {
  const bracketTypes = [
    { 
      id: 'Single Elimination', 
      label: 'Simple Elimination', 
      description: 'Un seul match perdu = élimination' 
    },
    { 
      id: 'Double Elimination', 
      label: 'Double Elimination', 
      description: 'Deux chances avant l\'élimination' 
    },
    { 
      id: 'Round Robin', 
      label: 'Round Robin', 
      description: 'Tous les participants s\'affrontent' 
    },
    { 
      id: 'Battle Royale', 
      label: 'Battle Royale', 
      description: 'top 3' 
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
    <div className="relative">
      <label className={`absolute text-[14px] font-custom text-gray-300 leading-tight tracking-widest -translate-y-7 top-5 left-4 text-xs rounded-md bg-[#181818] px-2 z-10`}>
        Format du Tournoi
      </label>
      <div className="space-y-2 bg-secondary/40 rounded-xl angular-cut p-3 pt-5">
        {bracketTypes.map(({ id, label, description }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleChange(id)}
            className={`
              w-full text-left flex items-center angular-cut p-3 rounded-xl transition-all duration-200
              ${value === id 
                ? 'bg-black/35 border-l-4 border-primary' 
                : 'bg-secondary text-gray-300 hover:bg-secondary/20'}
            `}
          >
            <div>
              <div className="flex items-center">
                {value === id && <Check className="w-4 h-4 text-primary mr-2" />}
                <span className={`font-medium font-valorant ${value === id ? 'text-primary' : ''}`}>{label}</span>
              </div>
              <p className="text-xs font-mono text-gray-400 mt-1">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BracketTypeSelector;