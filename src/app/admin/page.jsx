"use client"
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Trophy, 
  CalendarDays, 
  UserCheck, 
  UserPlus, 
  Award, 
  DollarSign, 
  Shield, 
  Target, 
  Activity,
  BarChart3,
  PieChart,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { TbTournament } from 'react-icons/tb';

// StatCard component with hover effects
const StatCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-500/10',
    green: 'text-green-500 bg-green-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10',
    red: 'text-red-500 bg-red-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
    pink: 'text-pink-500 bg-pink-500/10'
  };
  
  const colorClass = colorClasses[color] || 'text-blue-500 bg-blue-500/10';
  const [iconColor, bgColor] = colorClass.split(' ');
  
  return (
    <div className="bg-secondary angular-cut p-6 
                   transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-lg ${bgColor} mr-3`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <h3 className="text-gray-400 text-sm font-valorant">{title}</h3>
          </div>
          
          <p className={`text-2xl font-bold ${iconColor}`}>{value}</p>
          
          {trend && (
            <div className="flex items-center mt-2 text-xs">
              {trend === 'up' ? (
                <div className="flex items-center text-green-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.5-11a.5.5 0 00-1 0v2.586l-2.293-2.293a.5.5 0 00-.707.708l3 3a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L10.5 9.586V7z" clipRule="evenodd" />
                  </svg>
                  {trendValue}
                </div>
              ) : (
                <div className="flex items-center text-red-400">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 mr-1">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.5-11a.5.5 0 00-1 0v2.586l-2.293-2.293a.5.5 0 00-.707.708l3 3a.5.5 0 00.708 0l3-3a.5.5 0 00-.708-.708L10.5 9.586V7z" clipRule="evenodd" transform="rotate(180 10 10)" />
                  </svg>
                  {trendValue}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Section header with title and subtitle
const SectionHeader = ({ title, subtitle }) => (
  <div className="mb-6">
    <div>
      <div className="flex items-center text-primary">
        {subtitle && (
          <>
            <div className="w-1 h-4 bg-primary rounded-full"></div>
            <p className="mx-2 font-mono uppercase tracking-wider flex items-center">
              <span className="mr-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 20 20" 
                  fill="currentColor" 
                  className="w-3.5 h-3.5"
                >
                  <path fillRule="evenodd" d="M4.606 12.97a.75.75 0 01-.134 1.051 2.494 2.494 0 00-.93 2.437 2.494 2.494 0 002.437-.93.75.75 0 111.186.918 3.995 3.995 0 01-4.482 1.332.75.75 0 01-.461-.461 3.994 3.994 0 011.332-4.482.75.75 0 011.052.134z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M5.752 12A13.07 13.07 0 008 14.248v4.002c0 .414.336.75.75.75a5 5 0 004.797-6.48 12.984 12.984 0 005.45-10.848.75.75 0 00-.735-.735 12.984 12.984 0 00-10.849 5.45A5 5 0 001.5 8.75a.75.75 0 00.75.75h4.002zM9.5 8a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
                </svg>
              </span>
              {subtitle}
            </p>
          </>
        )}
      </div>
      <h1 className="text-3xl flex items-center font-custom tracking-wider uppercase">
        {title}
      </h1>
    </div>
  </div>
);

// Game card for displaying game-specific stats
const GameCard = ({ game, count, color, icon: Icon }) => {
  const colorClasses = {
    blue: 'text-blue-500 bg-blue-500/10',
    green: 'text-green-500 bg-green-500/10',
    yellow: 'text-yellow-500 bg-yellow-500/10',
    red: 'text-red-500 bg-red-500/10',
    purple: 'text-purple-500 bg-purple-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
    orange: 'text-orange-500 bg-orange-500/10',
    pink: 'text-pink-500 bg-pink-500/10'
  };
  
  const colorClass = colorClasses[color] || 'text-blue-500 bg-blue-500/10';
  const [iconColor, bgColor] = colorClass.split(' ');
  
  return (
    <div className="bg-secondary rounded-lg p-5
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-custom ${iconColor}`}>{game}</h3>
          <p className="text-2xl text-white font-bold mt-1">{count}</p>
        </div>
        
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

const GeniusMoDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [error, setError] = useState(null);
  
  // Initialize stats state with default values
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTournaments: 0,
    recentLogins: 0,
    upcomingTournaments: 0,
    newUsers: 0,
    totalAdmins: 0,
    avgTournamentDuration: 0,
    totalPrizePool: 0,
    totalTeams: 0,
    activeTeams: 0,
    averageTeamSize: 0,
    pendingJoinRequests: 0,
    teamsPerGame: {
      valorant: 0,
      freeFire: 0,
      streetFighter: 0, 
      fcFootball: 0,
    },
    teamPrivacyDistribution: {
      public: 0,
      private: 0,
      invitationOnly: 0,
    },
    // These aren't in the API but we'll calculate them
    tournamentsByType: {
      singleElimination: 0,
      doubleElimination: 0,
      roundRobin: 0
    }
  });

  // Function to fetch stats from the API
  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Make the actual API call to your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard-stats.php`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Update stats with the data from the API
        setStats({
          ...data.data,
          // Add derived data that might not be in the API
          tournamentsByType: {
            // If these aren't provided directly by the API, you can set defaults
            singleElimination: 3,
            doubleElimination: 2,
            roundRobin: 1
          }
        });
      } else {
        throw new Error(data.error || 'Failed to fetch dashboard stats');
      }
      
      setLastRefreshed(new Date());
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error.message || 'Failed to load dashboard data');
      // Show error toast if you're using a toast library
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch stats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Calculate percentage of active teams
  const activeTeamPercentage = stats.totalTeams > 0 
    ? Math.round((stats.activeTeams / stats.totalTeams) * 100) 
    : 0;

  // Format prize pool with currency
  const formattedPrizePool = new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
    maximumFractionDigits: 0
  }).format(stats.totalPrizePool);

  // Handle refresh button click
  const handleRefresh = () => {
    fetchStats();
  };

  // Display loading spinner when first loading
  if (isLoading && !lastRefreshed) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-dark rounded-xl">
    
      
      {/* Error message if there's an error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg">
          <p className="font-medium">Error loading dashboard data:</p>
          <p>{error}</p>
        </div>
      )}
      
      {/* User Statistics */}
      <div>
        <SectionHeader 
          title="User Analytics" 
          subtitle="Overview of user activity and engagement"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={stats.totalUsers.toLocaleString()}
            icon={Users}
            color="blue"
            trend="up"
            trendValue={`+${stats.newUsers} new`}
          />
          <StatCard
            title="Recent Logins"
            value={stats.recentLogins.toLocaleString()}
            icon={Activity}
            color="green"
            trend="up"
            trendValue="Last 7 days"
          />
          <StatCard
            title="Admins"
            value={stats.totalAdmins.toLocaleString()}
            icon={UserCheck}
            color="purple"
          />
          <StatCard
            title="Upcoming Tournaments"
            value={stats.upcomingTournaments.toLocaleString()}
            icon={CalendarDays}
            color="yellow"
          />
        </div>
      </div>
      
      {/* Tournament Statistics */}
      <div>
        <SectionHeader 
          title="Tournament Data" 
          subtitle="Key metrics about tournaments"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Tournaments"
            value={stats.totalTournaments.toLocaleString()}
            icon={Trophy}
            color="orange"
          />
          <StatCard
            title="Prize Pool"
            value={formattedPrizePool}
            icon={DollarSign}
            color="green"
          />
          <StatCard
            title="Avg. Duration"
            value={`${stats.avgTournamentDuration} days`}
            icon={Award}
            color="indigo"
          />
          <StatCard
            title="Single Elimination"
            value={stats.tournamentsByType.singleElimination}
            icon={BarChart3}
            color="pink"
          />
        </div>
      </div>
      
      {/* Team Statistics */}
      <div>
        <SectionHeader 
          title="Team Analytics" 
          subtitle={`${activeTeamPercentage}% of teams are currently active`}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Teams"
            value={stats.totalTeams.toLocaleString()}
            icon={Shield}
            color="blue"
          />
          <StatCard
            title="Active Teams"
            value={stats.activeTeams.toLocaleString()}
            icon={Target}
            color="green"
          />
          <StatCard
            title="Avg Team Size"
            value={stats.averageTeamSize.toFixed(1)}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Pending Requests"
            value={stats.pendingJoinRequests.toLocaleString()}
            icon={UserPlus}
            color="orange"
            trend={stats.pendingJoinRequests > 0 ? "up" : "down"}
            trendValue={stats.pendingJoinRequests > 0 ? "Needs attention" : "All good"}
          />
        </div>
      </div>

      {/* Teams Per Game */}
      <div>
        <SectionHeader title="Teams By Game" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GameCard 
            game="VALORANT" 
            count={stats.teamsPerGame.valorant} 
            color="red" 
            icon={Activity} 
          />
          <GameCard 
            game="FREE FIRE" 
            count={stats.teamsPerGame.freeFire} 
            color="orange" 
            icon={Activity} 
          />
          <GameCard 
            game="FC FOOTBALL" 
            count={stats.teamsPerGame.fcFootball} 
            color="blue" 
            icon={Activity} 
          />
          <GameCard 
            game="STREET FIGHTER" 
            count={stats.teamsPerGame.streetFighter} 
            color="purple" 
            icon={Activity} 
          />
        </div>
      </div>
      
      {/* Team Privacy Distribution */}
      <div>
        <SectionHeader title="Team Privacy Distribution" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Public Teams"
            value={stats.teamPrivacyDistribution.public}
            icon={PieChart}
            color="blue"
          />
          <StatCard
            title="Private Teams"
            value={stats.teamPrivacyDistribution.private}
            icon={PieChart}
            color="purple"
          />
          <StatCard
            title="Invitation Only"
            value={stats.teamPrivacyDistribution.invitationOnly}
            icon={PieChart}
            color="indigo"
          />
        </div>
      </div>
      
 
    </div>
  );
};

export default GeniusMoDashboard;