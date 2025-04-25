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
        className="w-full bg-secondary text-white rounded-xl text-sm text-[10pt] angular-cut px-6 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 peer resize-none"
      />
      <label
        className={`absolute transition-all text-[12pt] font-custom text-gray-300 leading-tight tracking-widest duration-200 pointer-events-none text-gray-400
          ${
            isFocused || value
              ? '-translate-y-7 top-5 left-4 text-xs rounded-md bg-[#181818] px-2'
              : 'text-base left-6 top-8 -translate-y-1/2'
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