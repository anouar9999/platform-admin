import React from 'react';

/**
 * Participation type toggle component styled to match the tournament form styling
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
      label: 'Joueurs individuels',
      description: 'Inscription individuelle des joueurs',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12,12A6,6,0,1,0,6,6,6.006,6.006,0,0,0,12,12ZM12,2A4,4,0,1,1,8,6,4,4,0,0,1,12,2Z"/>
          <path d="M12,14a9.01,9.01,0,0,0-9,9,1,1,0,0,0,2,0,7,7,0,0,1,14,0,1,1,0,0,0,2,0A9.01,9.01,0,0,0,12,14Z"/>
        </svg>
      )
    },
    { 
      id: 'team', 
      label: 'Equipes',
      description: 'Inscription par equipes constituees',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M9,5c0-1.657,1.343-3,3-3s3,1.343,3,3-1.343,3-3,3-3-1.343-3-3Zm10,1c1.657,0,3-1.343,3-3s-1.343-3-3-3-3,1.343-3,3,1.343,3,3,3Zm-14,0c1.657,0,3-1.343,3-3S6.657,0,5,0,2,1.343,2,3s1.343,3,3,3Zm12,7.5v2c0,1.325-.586,2.505-1.5,3.33v3.67c0,.829-.671,1.5-1.5,1.5s-1.5-.671-1.5-1.5v-2.5h-1v2.5c0,.829-.671,1.5-1.5,1.5s-1.5-.671-1.5-1.5v-3.67c-.914-.824-1.5-2.005-1.5-3.33v-2c0-2.481,2.019-4.5,4.5-4.5h1c2.481,0,4.5,2.019,4.5,4.5Zm-3,0c0-.827-.673-1.5-1.5-1.5h-1c-.827,0-1.5,.673-1.5,1.5v2c0,.827,.673,1.5,1.5,1.5h1c.827,0,1.5-.673,1.5-1.5v-2Zm5.5-6.5h-1c-.829,0-1.5,.671-1.5,1.5s.671,1.5,1.5,1.5h1c.827,0,1.5,.673,1.5,1.5v2c0,.635-.402,1.204-1,1.415-.6,.212-1,.779-1,1.415v4.171c0,.829,.671,1.5,1.5,1.5s1.5-.671,1.5-1.5v-3.258c1.228-.822,2-2.219,2-3.742v-2c0-2.481-2.019-4.5-4.5-4.5Zm-14,0h-1C2.019,7,0,9.019,0,11.5v2c0,1.523,.772,2.92,2,3.742v3.258c0,.829,.671,1.5,1.5,1.5s1.5-.671,1.5-1.5v-4.171c0-.636-.401-1.203-1-1.415-.598-.211-1-.78-1-1.415v-2c0-.827,.673-1.5,1.5-1.5h1c.829,0,1.5-.671,1.5-1.5s-.671-1.5-1.5-1.5Z"/>
        </svg>
      )
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
    <div className={`relative font-ea-football  ${className}`}>
      <label className="absolute text-[14px]  font-ea-football text-gray-300 leading-tight tracking-widest -translate-y-7 top-3 left-1 text-xs rounded-md px-2 z-20">
        {label}
      </label>
      
      <div className="w-[90%] flex flex-col space-y-3 mt-4 ">
        {types.map(({ id, label, description, icon }) => (
          <label
            key={id}
            className={`relative flex items-center p-2 rounded-lg cursor-pointer transition-all duration-300 bg-gray-50 hover:bg-gray-100
              ${value === id 
                ? 'bg-primary border-2 border-primary' 
                : 'border-2 border-transparent hover:border-gray-200'
              }`}
          >
            <input
              type="radio"
              name={name}
              value={id}
              checked={value === id}
              onChange={() => handleChange(id)}
              className="w-5 h-5 text-primary border-2 border-gray-300 focus:ring-primary focus:ring-2 mr-4"
            />
            <div className="flex-1">
              <div className="text-md  text-gray-900 mb-1">
                {label}
              </div>
              <div className="text-xs text-gray-600">
                {description}
              </div>
            </div>
            {value === id && (
              <div className="ml-4 px-3 py-1 bg-primary text-black text-sm rounded-full font-medium">
                Rent Faster
              </div>
            )}
          </label>
        ))}
      </div>

      {/* Hidden native input for form submission compatibility */}
      <input 
        type="hidden"
        name={name}
        value={value || ''}
      />
    </div>
  );
};

export default ParticipationTypeToggle;