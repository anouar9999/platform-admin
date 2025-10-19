// Custom dropdown component with e-sports styling
import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const CustomDropdown = ({ 
  options, 
  selected, 
  onSelect, 
  placeholder = "Select an option", 
  className = "",
  label = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Handle selection
  const handleOptionSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };
  
  // Find the selected option's label
  const selectedOption = options.find(opt => opt.value === selected);
  
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-1">
          {label}
        </label>
      )}
      
      {/* Dropdown button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="relative w-full flex items-center justify-between px-4 py-2 bg-secondary/80 hover:bg-secondary-800 
          text-white focus:outline-none focus:ring-1 focus:ring-primary transition duration-300 ease-in-out
          border border-gray-700 hover:border-primary rounded shadow-lg overflow-hidden"
        style={{
          clipPath: isOpen 
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)" 
            : "polygon(0 0, 95% 0, 100% 100%, 5% 100%)",
        }}
      >
        {/* Background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/10 to-transparent opacity-30"
             style={{ transform: 'skewX(-20deg)'}}></div>
        
        {/* Button content */}
        <div className="flex items-center justify-between w-full relative z-10">
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="ml-2 text-primary">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </span>
        </div>
      </button>
      
      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-gray-900 border border-gray-700 shadow-xl rounded-md 
          max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-primary scrollbar-track-gray-800">
          <ul className="py-1">
            {options.map((option) => (
              <li 
                key={option.value} 
                onClick={() => handleOptionSelect(option.value)}
                className={`px-4 py-2 hover:bg-gray-800 cursor-pointer transition-all duration-200
                  ${selected === option.value ? 'bg-gray-800/50 text-primary font-bold' : 'text-white'}`}
              >
                <div className="flex items-center">
                  {option.icon && <span className="mr-2">{option.icon}</span>}
                  <span>{option.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;