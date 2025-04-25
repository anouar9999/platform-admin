import { DollarSign } from 'lucide-react';
import React from 'react';

const PrizePoolInput = ({ value, onChange }) => {
  const handleInputChange = (e) => {
    let newValue = e.target.value;
    
    // Remove non-numeric characters and spaces
    newValue = newValue.replace(/[^0-9]/g, '');
    
    // Enforce maximum of 6 digits (999,999)
    if (newValue.length > 6) {
      newValue = newValue.slice(0, 6);
    }
    
    // Enforce minimum step of 1000
    if (newValue && Number(newValue) < 1000) {
      newValue = '1000';
    }
    
    // Round to nearest 1000
    if (newValue) {
      const numValue = Math.round(Number(newValue) / 1000) * 1000;
      newValue = numValue.toString();
    }

    onChange({
      target: {
        name: 'prize_pool',
        value: newValue
      }
    });
  };

  const formatDisplayValue = (val) => {
    if (!val) return '';
    return Number(val).toLocaleString('fr-FR');
  };

  // Common prize pool amounts
  const quickSelectAmounts = [1000, 5000, 10000, 25000, 50000];

  // Prize distribution tiers - for information only
  const distributionTiers = {
    small: [
      { position: '1er', percentage: 60, amount: value ? Math.round(Number(value) * 0.6) : 0 },
      { position: '2ème', percentage: 30, amount: value ? Math.round(Number(value) * 0.3) : 0 },
      { position: '3ème', percentage: 10, amount: value ? Math.round(Number(value) * 0.1) : 0 }
    ],
    large: [
      { position: '1er', percentage: 50, amount: value ? Math.round(Number(value) * 0.5) : 0 },
      { position: '2ème', percentage: 25, amount: value ? Math.round(Number(value) * 0.25) : 0 },
      { position: '3ème-4ème', percentage: 10, amount: value ? Math.round(Number(value) * 0.1) : 0 },
      { position: '5ème-8ème', percentage: 5, amount: value ? Math.round(Number(value) * 0.05) : 0 }
    ]
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">Prix du Tournoi</label>
      
      <div className="flex relative">
        <div className="flex-grow relative">
          <input
            type="text"
            name="prize_pool"
            value={formatDisplayValue(value)}
            onChange={handleInputChange}
            className="w-full bg-secondary pl-12 pr-24 py-3 angular-cut focus:ring-2 
                     focus:ring-blue-500 focus:outline-none text-xl font-bold"
            placeholder="1 000"
          />
          {/* Left Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary">
            <DollarSign className="w-5 h-5" />
          </div>
          {/* Right Text */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            MAD
          </div>
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="flex gap-2 mt-2 flex-wrap">
        {quickSelectAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handleInputChange({ target: { value: amount.toString() } })}
            className={`px-3 py-1 text-sm angular-cut transition-colors ${
              Number(value) === amount 
                ? 'bg-primary text-white' 
                : 'bg-secondary text-gray-300'
            }`}
          >
            {amount.toLocaleString('fr-FR')} MAD
          </button>
        ))}
      </div>

      {/* Show distribution preview if a value is selected */}
      {value && Number(value) > 0 && (
        <div className="mt-3 p-3 bg-gray-800/50 angular-cut">
          <div className="text-xs text-primary font-medium mb-2">
            Distribution suggérée des prix
          </div>
          <div className="space-y-1">
            {(Number(value) >= 10000 ? distributionTiers.large : distributionTiers.small).map((tier) => (
              <div key={tier.position} className="flex justify-between text-xs">
                <span className="text-gray-300">{tier.position} ({tier.percentage}%)</span>
                <span className="font-medium text-gray-100">
                  {tier.amount.toLocaleString('fr-FR')} MAD
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-400 italic">
            Cette distribution est indicative et peut être personnalisée.
          </div>
        </div>
      )}
    </div>
  );
};

export default PrizePoolInput;