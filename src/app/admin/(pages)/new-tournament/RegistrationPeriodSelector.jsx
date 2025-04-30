import React from 'react';
import { Calendar } from 'lucide-react';

/**
 * Component for selecting registration period start and end dates
 * 
 * @param {Object} props Component props
 * @param {string} props.startDate Start date value
 * @param {string} props.endDate End date value
 * @param {Function} props.onChange Function called when dates change
 */
const RegistrationPeriodSelector = ({ startDate, endDate, onChange }) => {
  return (
    <div className="relative">
      <label className={`absolute text-[12pt] font-custom text-gray-300 leading-tight tracking-widest -translate-y-7 top-5 left-4 text-xs rounded-md bg-[#181818] px-2 z-10`}>
        Période d Inscription
      </label>
      <div className="grid grid-cols-2 gap-4 bg-secondary rounded-xl angular-cut p-3 pt-5">
        <div className="relative">
          <label className={`absolute text-[10pt] text-gray-400 -translate-y-5 top-2 left-8 text-xs`}>
            Début
          </label>
          <div className="relative mt-2">
            <input
              type="datetime-local"
              name="registration_start"
              value={startDate}
              onChange={onChange}
              className="w-full bg-gray-800 text-white rounded-xl angular-cut px-6 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
        <div className="relative">
          <label className={`absolute text-[10pt] text-gray-400 -translate-y-5 top-2 left-8 text-xs`}>
            Fin
          </label>
          <div className="relative mt-2">
            <input
              type="datetime-local"
              name="registration_end"
              value={endDate}
              onChange={onChange}
              className="w-full bg-gray-800 text-white rounded-xl angular-cut px-6 py-3 focus:outline-none focus:ring-2 focus:ring-black/20 pl-10"
            />
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-1 px-2">
        Les inscriptions doivent se terminer avant le début du tournoi
      </p>
    </div>
  );
};

export default RegistrationPeriodSelector;