import React, { useEffect, useState } from 'react';
import {
  CircleUserRound,
  Gamepad2,
  ChevronDown,
  AlertCircle,
  Loader,
  DollarSign,
  Users,
  Monitor,
  Trophy,
} from 'lucide-react';
import WaitingList from '@/app/admin/components/widgets/cards/WaitingList';
import ParticipantList from '@/app/admin/components/widgets/cards/ParticipantList';
import TournamentBracket from '../../../components/TournamentBracket';
import DoubleEliminationBracket from '@/app/admin/components/DoubleElminationBracket';
import InfoCard from './InfoCard';
import BattleRoyale from '@/app/admin/components/brackets/BattleRoyal';
import { FaTrophy } from 'react-icons/fa';

const TabComponent = ({ activeTab, onTabChange, tournament,gameData }) => {
  const tabs = ['Overview', 'Waiting List', 'Participants', 'Bracket'];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const renderTabContent = () => {
    if (
      tournament.status === 'En cours' &&
      activeTab !== 'Overview' &&
      activeTab !== 'Participants' &&
      activeTab !== 'Bracket'
    ) {
      return (
        <div className="p-4 md:p-6 rounded-lg text-center">
          <Loader className="mx-auto w-8 h-8 md:w-12 md:h-12 mb-4" />
          <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">Tournament In Progress</h3>
          <p className="text-xs md:text-sm">
            The tournament is currently in progress. Some features may be limited until the
            tournament ends.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case 'Overview':
        return (
          // Updated layout to match the design in the image
          <div className="space-y-4 md:space-y-6">
            {/* Modified layout to make About section full width with proper styling */}
            <div className="flex flex-col gap-4 md:gap-6">
              {/* Tournament Info Grid - Adjusted to improve layout */}
              {/* Outer container with fade effect */}
              <div className="relative w-full">
                {/* Fade effect overlay for the outer container */}

                {/* The actual content */}
                <div className="w-full rounded-lg p-3 md:p-4">
                  {/* Tournament Info with Game Background */}
                  <div className="w-full rounded-lg overflow-hidden">
                    {/* This is the container with relative positioning */}
                    <div className="relative w-full">
                      {/* Background Game Image Layer */}
                      <div className="absolute inset-0 z-0">
                        <img
                          src={tournament.game_image}
                          alt={tournament.game_name || 'Tournament Game'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/api/placeholder/400/225';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332] via-[#1a2332]/85 to-[#1a2332]/50"></div>

                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332] via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-[#1a2332]/85 to-transparent"></div>

                        <div className="absolute inset-0 bg-gradient-to-b from-[#1a2332] via-transparent to-transparent"></div>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-[#1a2332]/85 to-transparent"></div>

                        <div className="absolute inset-0 bg-gradient-to-r from-[#1a2332] via-transparent to-transparent"></div>
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-[#1a2332]/85 to-transparent"></div>

                        {/* Right side fade effect */}
                        <div className="absolute inset-0 bg-gradient-to-l from-[#1a2332] via-transparent to-transparent"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-[#1a2332]/85 to-transparent"></div>
                      </div>

                      {/* Content Layer */}
                      <div className="relative z-10 p-4 md:p-6">
                        <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-start">
                          {/* Left side - Tournament Info */}
                          <div className="w-full md:w-full">
                            {/* Info Cards */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-10">
                              <InfoCard
                                icon={<DollarSign className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                                value={`${tournament.prize_pool} DH`}
                                label="Prize Pool"
                              />
                              <InfoCard
                                icon={<Gamepad2 className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                                value={tournament.match_format || 'Standard'}
                                label="Format"
                              />
                              <InfoCard
                                icon={<Users className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                                value={tournament.max_participants}
                                label={tournament.participation_type}
                              />
                              <InfoCard
                                icon={<Monitor className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                                value={tournament.bracket_type}
                                label="Bracket Type"
                              />
                              <InfoCard
                                icon={<Trophy className="w-4 h-4 md:w-5 md:h-5 text-primary" />}
                                value={tournament.participation_type}
                                label="Participation type"
                              />
                              <InfoCard
                                icon={<img src={gameData.game_image} width={'50'} />}
                                value={gameData.game_name}
                                label="Tournament Game"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
            </div>

         <div className="relative z-10 flex items-center gap-4 mb-8 pb-4 border-b-2 border-primary/30">
            <div className="w-12 h-12 bg-primary flex items-center justify-center transform -skew-x-12">
              <AlertCircle className="w-6 h-6 text-black transform skew-x-12" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-zentry text-white uppercase tracking-wider">
                Tournament Rules
              </h3>
              <div className="h-0.5 w-20 bg-primary mt-2"></div>
            </div>
          </div>
          
          {/* Rules List */}
          <div className="relative z-10 space-y-4">
            {tournament.rules.split('\n').map((rule, index) => (
              rule.trim() && (
                <div key={index} className="flex items-start gap-4 group/rule pl-4 border-l-2 border-transparent hover:border-primary/50 transition-all duration-300">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/20 border border-primary/40 flex items-center justify-center transform -skew-x-6 group-hover/rule:bg-primary group-hover/rule:scale-110 transition-all duration-300">
                    <span className="text-sm font-bold text-primary group-hover/rule:text-black transform skew-x-6">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed pt-1 group-hover/rule:text-white transition-colors duration-300 font-mono">
                    {rule}
                  </p>
                </div>
              )
            ))}
          </div>
          </div>
        );
      case 'Waiting List':
        return <WaitingList tournamentId={tournament.id} />;
      case 'Participants':
        return <ParticipantList tournamentId={tournament.id} />;
        case 'Bracket':
          if (tournament.status ==='ongoing') {
            return <TournamentBracket 
              bracketType={tournament.bracket_type} 
              tournamentId={tournament.id}
            />;
          } else {
            return (
              <div className="flex flex-col items-center justify-center p-8 ">
                <div className="text-3xl text-gray-400 mb-4">
                  <FaTrophy className="mx-auto opacity-25" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Tournament Bracket Not Available
                </h3>
                <p className="text-gray-400 text-center max-w-md">
                  {tournament.status === "registration_open" 
                    ? "Registration is still open. The bracket will be generated once the tournament begins."
                    : tournament.status === "registration_closed"
                      ? "Registration has closed. The bracket will be generated when the tournament starts."
                      : tournament.status === "completed"
                        ? "This tournament has concluded. The bracket view is no longer available."
                        : "The tournament bracket has not been generated yet."}
                </p>
              </div>
            );
          }
      default:
        return <p className="text-center text-gray-400">Content for {activeTab}</p>;
    }
  };

  const TabButton = ({ tab }) => (
    <div className="relative  inline-block px-4 md:px-4">
      <svg
        width="120"
        height="32"
        viewBox="0 0 100 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <path
          d="M6 0H87C90.5 0 93.5 1 95.5 3L100 7.5V27.5C100 30 98 32 95.5 32H13C9.5 32 6.5 31 4.5 29L0 24.5V4.5C0 2 2 0 4.5 0H6Z"
          fill={activeTab === tab ? '#ff3d08' : 'transparent'}
        />
      </svg>
      <button
        onClick={() => onTabChange(tab)}
        className={`absolute inset-0 flex items-center justify-center text-lg md:text-lg px-2 
          ${activeTab === tab ? 'text-white' : 'text-white/55'}`}
      >
        <span className='font-free-fire tracking-widest'>{tab}</span>
      </button>
    </div>
  );

  return (
    <div className="text-gray-300">
      {/* Desktop navigation */}
      <div className=" hidden ml-8  md:flex space-x-10 lg:space-x-6 mb-6">
        {tabs.map((tab) => (
          <TabButton key={tab} tab={tab} />
        ))}
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden mb-4 relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full p-2 rounded-lg flex justify-between items-center text-sm"
        >
          <span>{activeTab}</span>
          <ChevronDown
            className={`w-4 h-4 transform transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        {isDropdownOpen && (
          <div className="absolute top-full left-0 right-0  mt-1 rounded-lg overflow-hidden z-10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  onTabChange(tab);
                  setIsDropdownOpen(false);
                }}
                className={`w-full p-2 text-left text-sm ${
                  activeTab === tab ? 'bg-primary text-white' : 'hover:bg-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="  rounded-lg">{renderTabContent()}</div>
    </div>
  );
};

export default TabComponent;
