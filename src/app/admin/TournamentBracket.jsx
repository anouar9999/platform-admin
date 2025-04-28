import React from 'react';
import MultiGroupRoundRobinTournament from './components/brackets/round_robin';
import BattleRoyale from './components/brackets/BattleRoyal';


const TournamentBracket = ({ bracketType, tournamentId }) => {
  // Render the appropriate bracket component based on the bracket type
  const renderBracket = () => {
    switch (bracketType?.toLowerCase()) {
      // case 'single elimination':
      //   return <SingleEliminationBracket data={tournamentId} />;
      
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