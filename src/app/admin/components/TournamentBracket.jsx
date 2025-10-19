import React from 'react';
import MultiGroupRoundRobinTournament from './brackets/round_robin';
import BattleRoyale from './brackets/BattleRoyal';

import SingleEliminationBracket from './brackets/SingleEliminationBracket';

const TournamentBracket = ({ bracketType, tournamentId }) => {
  // Render the appropriate bracket component based on the bracket type
  const renderBracket = () => {
    switch (bracketType?.toLowerCase()) {
      case 'single elimination':
        return <SingleEliminationBracket data={tournamentId}       tournamentId={17}  // Pass your tournament ID
 />;
      
      // case 'double elimination':
      //   return <DoubleEliminationBracket data={tournamentId} />;
      
      case 'round robin':
        return <MultiGroupRoundRobinTournament tournamentId={tournamentId} />;
      
  
      case 'battle royale':
        return <BattleRoyale tournamentId={tournamentId} />;
      
      default:
        return (
          <div className="text-center p-8">
            <p className="text-lg text-gray-400">
              Unsupported bracket type: {bracketType || 'Not specified'}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="tournament-bracket-container">
      {renderBracket()}
    </div>
  );
};

export default TournamentBracket;