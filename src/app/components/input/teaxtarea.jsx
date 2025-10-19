import React, { useState } from 'react';

const FloatingLabelTextarea = ({ label, icon: Icon, value, onChange, rows = 4 }) => {
  const [isFocused, setIsFocused] = useState(true);

  return (
    <div className="relative mb-4 text-white">
      <textarea
        value={value}
        placeholder={`Enter Your ${label}`}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(true)}
        rows={rows}
        className="w-[90%] bg-[#21324F] rounded-lg text-white text-sm text-[10pt] font-ea-football   tracking-wider px-6 py-3 focus:outline-none focus:ring-1 focus:ring-primary peer placeholder:font-ea-football placeholder-gray-500 "
      />
     <label
        className={`absolute transition-all text-[14px] font-ea-football  leading-tight tracking-wide duration-200 pointer-events-none text-gray-400
          ${
            isFocused || value
              ? '-translate-y-7 top-3 left-0 text-xs rounded  px-2'
              : 'text-base left-6 top-1/2 -translate-y-1/2'
          }`}
      >
        {label}
      </label>

      {Icon && (
        <Icon size={20} className="absolute right-4 top-6 text-gray-400" />
      )}
    </div>
  );
};

export default FloatingLabelTextarea;