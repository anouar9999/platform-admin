import React from 'react';
import { Calendar } from 'lucide-react';


const CustomDateInput = ({ 
  value, 
  onClick, 
  label, 
  isRequired, 
  icon: Icon = Calendar,
  hasError = false,
  errorMessage = '',
  placeholder = 'Sélectionner une date'
}) => (
  <div className="group">
    <label className="block text-sm font-medium mb-2 group-hover:text-primary transition-colors">
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
    
    <div className={`
      relative overflow-hidden border border-transparent 
      ${hasError ? 'border-red-500' : 'group-hover:border-gray-700'} 
      rounded-xl transition-all duration-300
    `}>
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-10 bg-gradient-to-r from-primary/20 via-orange-mge/10 to-primary/20 transition-opacity duration-500"></div>
      
      {/* Date button with enhanced styling */}
      <button
        type="button"
        onClick={onClick}
        className={`
          w-full text-left bg-secondary text-white rounded-xl angular-cut px-6 py-3
          focus:outline-none focus:ring-2 focus:ring-primary/30 pl-12
          transition-all duration-300 ease-in-out 
          ${hasError ? 'ring-1 ring-red-500' : ''}
          ${value ? 'text-white' : 'text-gray-500'}
        `}
      >
        {value || placeholder}
        
        {/* Calendar icon with animated container */}
        <div className={`
          absolute left-3 top-1/2 transform -translate-y-1/2 
          w-8 h-8 flex items-center justify-center rounded-full
          ${hasError ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-gray-400'} 
          group-hover:text-primary group-hover:bg-primary/20 
          transition-all duration-300
        `}>
          <Icon className="w-4 h-4" />
        </div>
      </button>
      
      {/* Right icon indicator */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-primary transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
      
      {/* Subtle highlight effect on hover - animated gradient */}
      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-orange-mge group-hover:w-full transition-all duration-500"></div>
      
      {/* Pulse effect when clicking */}
      <div className="absolute inset-0 bg-primary/5 scale-90 opacity-0 group-active:opacity-100 group-active:scale-100 rounded-xl transition-all duration-300"></div>
    </div>
    
    {/* Error message */}
    {hasError && errorMessage && (
      <p className="text-xs text-red-500 mt-1 ml-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        {errorMessage}
      </p>
    )}
    
    {/* Selected date hint */}
    {value && !hasError && (
      <p className="text-xs text-gray-500 mt-1 ml-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1 text-primary">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        Date sélectionnée
      </p>
    )}
  </div>
);

export default CustomDateInput;