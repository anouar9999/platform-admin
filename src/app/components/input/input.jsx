import React, { useState } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';

const FloatingLabelInput = ({ label, type = 'text', icon: Icon, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mb-4    text-white xl:ml-3">
      <input
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        value={value}
        color="white"
        placeholder={`Enter Your ${label}`}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(true)}
        className={` ${type === 'password' ? 'w-[90%]' : 'w-[90%]'}   bg-[#21324F] text-white ${
          type === 'password' ? 'ronded-l-lgu' : 'round-ldeg'
        }  text-sm text-[10pt] font-ea-football   tracking-wider px-6 py-3 font-medium focus:outline-none focus:ring-1 focus:ring-primary peer placeholder:font-ea-football placeholder-gray-500 `}
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

      {type === 'password' ? (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 bg-[#21324F] -mx-1  rounded-r-lg py-3 px-1"
        >
          {showPassword ? (
            <EyeOff className="text-white" size={20} />
          ) : (
            <Eye className="text-white" size={20} />
          )}
        </button>
      ) : Icon ? (
        <div></div>
      ) : null}
    </div>
  );
};

export default FloatingLabelInput;
