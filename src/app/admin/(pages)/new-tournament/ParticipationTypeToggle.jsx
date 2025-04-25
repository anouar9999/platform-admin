import React from 'react';

/**
 * Participation type toggle component styled to match the original input styling
 * 
 * @param {Object} props Component props
 * @param {string} props.value Current selected value ('participant' or 'team')
 * @param {Function} props.onChange Function called when selection changes
 * @param {string} props.name Optional field name (defaults to 'participation_type')
 * @param {string} props.label Optional custom label (defaults to 'Type de Participation')
 * @param {string} props.className Optional additional CSS classes
 */
const ParticipationTypeToggle = ({ 
  value, 
  onChange, 
  name = 'participation_type',
  label = 'Type de Participation',
  className = ''
}) => {
  const types = [
    { 
      id: 'participant', 
      label: 'Solo',
      description: 'Joueurs individuels',
      emoji: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
              <path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z"/>
              <path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z"/>
            </svg>
    },
    { 
      id: 'team', 
      label: 'Équipe',
      description: 'Plusieurs joueurs',
      emoji: <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
              <path d="M9,5c0-1.657,1.343-3,3-3s3,1.343,3,3-1.343,3-3,3-3-1.343-3-3Zm10,1c1.657,0,3-1.343,3-3s-1.343-3-3-3-3,1.343-3,3,1.343,3,3,3Zm-14,0c1.657,0,3-1.343,3-3S6.657,0,5,0,2,1.343,2,3s1.343,3,3,3Zm12,7.5v2c0,1.325-.586,2.505-1.5,3.33v3.67c0,.829-.671,1.5-1.5,1.5s-1.5-.671-1.5-1.5v-2.5h-1v2.5c0,.829-.671,1.5-1.5,1.5s-1.5-.671-1.5-1.5v-3.67c-.914-.824-1.5-2.005-1.5-3.33v-2c0-2.481,2.019-4.5,4.5-4.5h1c2.481,0,4.5,2.019,4.5,4.5Zm-3,0c0-.827-.673-1.5-1.5-1.5h-1c-.827,0-1.5,.673-1.5,1.5v2c0,.827,.673,1.5,1.5,1.5h1c.827,0,1.5-.673,1.5-1.5v-2Zm5.5-6.5h-1c-.829,0-1.5,.671-1.5,1.5s.671,1.5,1.5,1.5h1c.827,0,1.5,.673,1.5,1.5v2c0,.635-.402,1.204-1,1.415-.6,.212-1,.779-1,1.415v4.171c0,.829,.671,1.5,1.5,1.5s1.5-.671,1.5-1.5v-3.258c1.228-.822,2-2.219,2-3.742v-2c0-2.481-2.019-4.5-4.5-4.5Zm-14,0h-1C2.019,7,0,9.019,0,11.5v2c0,1.523,.772,2.92,2,3.742v3.258c0,.829,.671,1.5,1.5,1.5s1.5-.671,1.5-1.5v-4.171c0-.636-.401-1.203-1-1.415-.598-.211-1-.78-1-1.415v-2c0-.827,.673-1.5,1.5-1.5h1c.829,0,1.5-.671,1.5-1.5s-.671-1.5-1.5-1.5Z"/>
            </svg> 
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
      <label className="absolute text-[14px] font-custom text-gray-300 leading-tight tracking-widest -translate-y-7 top-5 left-4 text-xs rounded-md bg-[#181818] px-2 z-10">
        {label}
      </label>
      <div className="flex flex-col space-y-3 bg-secondary rounded-xl angular-cut p-3 pt-6">
        {types.map(({ id, label, description, emoji }) => (
          <button
            key={id}
            type="button"
            onClick={() => handleChange(id)}
            className={`
              flex items-center py-2 px-2 rounded-xl angular-cut transition-all duration-200
              ${value === id 
                ? 'bg-primary/20 text-primary border-l-4 border-primary' 
                : 'bg-secondary text-gray-300 border-l-4 border-transparent'}
            `}
          >
            <span className="mr-3 flex items-center justify-center w-12 h-12 text-gray-300">
              {emoji}
            </span>
            <div className="text-left">
              <div className="font-valorant text-md">{label}</div>
              <div className="text-xs text-gray-400 mt-1 font-mono">{description}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ParticipationTypeToggle;