import { DollarSign } from 'lucide-react';
import React from 'react';

const PrizePoolInput = ({ value, onChange, id = 'prize_pool', ...props }) => {
  const sanitizeAndFormat = (raw) => {
    let newValue = raw.replace(/[^0-9]/g, '');

    // Limit to 6 digits
    if (newValue.length > 6) {
      newValue = newValue.slice(0, 6);
    }

    // Enforce minimum
    if (newValue && Number(newValue) < 1000) {
      newValue = '1000';
    }

    // Round to nearest 1000
    if (newValue) {
      const numValue = Math.round(Number(newValue) / 1000) * 1000;
      return numValue.toString();
    }

    return '';
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    const cleaned = sanitizeAndFormat(raw);

    onChange({
      target: {
        name: 'prize_pool',
        value: cleaned,
      },
    });
  };

  const handleQuickSelect = (amount) => {
    const cleaned = sanitizeAndFormat(amount.toString());
    onChange({
      target: {
        name: 'prize_pool',
        value: cleaned,
      },
    });
  };

  const formatDisplayValue = (val) => {
    if (!val) return '';
    return Number(val).toLocaleString('fr-FR');
  };

  const quickSelectAmounts = [1000, 5000, 10000, 25000, 50000];

  return (
    <div className="relative ">
      {/* Label */}
      <label
        htmlFor={id} // ✅ linked properly
        className={`absolute left-3 text-gray-400  text-xs font-ea-football transition-all duration-200 pointer-events-none
          ${
            value
              ? '-translate-y-7 top-3 -left-2 text-xs rounded  px-2'
              : 'text-base left-6 -top-2 -translate-y-1/2'
          }
        `}
      >
        Prize Pool (MAD)
      </label>

      <div className="flex relative">
        <div className="flex-grow relative">
          <input
            id={id}
            placeholder="1000€, Trophy + Cash, Points & Rewards..."
            name="prize_pool"
            value={formatDisplayValue(value)}
            onChange={handleInputChange}
            {...props} // ✅ forward placeholder, className, etc.
          />
          {/* Icon */}

          <div className="absolute right-48 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            MAD
          </div>
        </div>
      </div>

      {/* Quick Select Buttons */}
      <div className="flex gap-2 mt-2 flex-wrap">
        {quickSelectAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => handleQuickSelect(amount)}
            className={`px-3 py-1 text-sm angular-cut transition-colors ${
              Number(value) === amount ? 'bg-primary text-black ' : 'bg-[#21324F] text-gray-300'
            }`}
          >
            {amount.toLocaleString('fr-FR')} MAD
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrizePoolInput;
