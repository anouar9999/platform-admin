import React from 'react';
import { Users } from 'lucide-react';

const ParticipantInput = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    let newValue = e.target.value;

    // Remove non-numeric characters
    newValue = newValue.replace(/[^0-9]/g, '');

    // Enforce maximum of 3 digits (999)
    if (newValue.length > 3) {
      newValue = newValue.slice(0, 3);
    }

    // Enforce minimum of 4 participants
    if (newValue && Number(newValue) < 4) {
      newValue = '4';
    }

    // Round to power of 2 (4, 8, 16, 32, 64, 128, 256)
    if (newValue) {
      const num = Number(newValue);
      const powers = [4, 8, 16, 32, 64, 128, 256];
      const nearestPower = powers.reduce((prev, curr) =>
        Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev,
      );
      newValue = nearestPower.toString();
    }

    onChange({
      target: {
        name: 'nombre_maximum',
        value: newValue,
      },
    });
  };

  // Calculate how many rounds based on participant count
  const calculateRounds = (participants) => {
    if (!participants) return 0;
    return Math.ceil(Math.log2(Number(participants)));
  };

  // Information about bracket structure
  const getBracketInfo = (participants) => {
    if (!participants) return null;

    const numParticipants = Number(participants);
    const rounds = calculateRounds(numParticipants);
    const perfectBracket = Math.pow(2, rounds) === numParticipants;

    return {
      rounds,
      perfectBracket,
      byes: perfectBracket ? 0 : Math.pow(2, rounds) - numParticipants,
      matches: numParticipants - 1,
    };
  };

  const bracketInfo = getBracketInfo(value);

  return (
    <div className="relative font-ea-football">
      <label className="block text-sm font-medium mb-1 text-gray-300">
        Nombre Maximum de Participants
      </label>

      <div className="flex relative">
        <div className="flex-grow relative">
          <input
            type="text"
            name="nombre_maximum"
            value={value}
            onChange={handleInputChange}
            className="w-[53%] bg-[#21324F] pl-12 pr-32 py-3 rounded-lg  
                      focus:outline-none text-xl   "
            placeholder="32"
          />
          {/* Left Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
            <Users className="w-5 h-5" />
          </div>
          {/* Right Text */}
          <div className="absolute right-1/2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            Participants
          </div>
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="flex gap-2 mt-2 flex-wrap">
        {[8, 16, 32, 64, 128].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleInputChange({ target: { value: num.toString() } })}
            className={`px-4 py-1 text-sm angular-cut transition-colors ${
              Number(value) === num
                ? 'bg-primary text-black'
                : 'bg-[#21324F] hover:bg-[#21324F]   text-gray-300'
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ParticipantInput;
