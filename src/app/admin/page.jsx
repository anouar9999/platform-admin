'use client';
import React, { useState, useEffect } from 'react';
import {
  Users,
  Trophy,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Gamepad2,
  Shield,
  Target,
  FileCheck,
  PlayCircle,
  Award,
  RefreshCw,
} from 'lucide-react';

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, change, trend, color, subtext, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-gradient-to-br from-[#1a2332] to-[#0f172a] p-6 rounded-xl transition-all duration-300 hover:shadow-xl group ${
      onClick ? 'cursor-pointer' : ''
    }`}
  >
    <div className="flex items-start justify-between mb-4">
      <div className={`p-3 rounded-lg `}>
        <Icon
          className={`w-6 h-6 ${
            color === 'blue'
              ? 'text-blue-400'
              : color === 'green'
              ? 'text-green-400'
              : color === 'purple'
              ? 'text-purple-400'
              : color === 'orange'
              ? 'text-orange-400'
              : color === 'red'
              ? 'text-red-400'
              : 'text-yellow-400'
          }`}
        />
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-circular-web mb-2 uppercase tracking-wider">
      {label}
    </h3>
    <p className="text-white text-3xl font-zentry mb-1">{value}</p>
    {subtext && <p className="text-slate-500 text-xs">{subtext}</p>}
  </div>
);

// Mini Stat Card
const MiniStatCard = ({ icon: Icon, label, value, color = 'blue', subtitle }) => (
  <div className="bg-[#1a2332] p-5 rounded-lg hover:border-slate-600 transition-all">
    <div className="flex items-center justify-between mb-3">
      <h3 className="text-white font-circular-web text-sm">{label}</h3>
      <Icon
        className={`
        ${
          color === 'blue'
            ? 'text-blue-400'
            : color === 'green'
            ? 'text-green-400'
            : color === 'purple'
            ? 'text-purple-400'
            : color === 'orange'
            ? 'text-orange-400'
            : color === 'yellow'
            ? 'text-yellow-400'
            : color === 'red'
            ? 'text-red-400'
            : 'text-slate-400'
        }
      `}
        size={20}
      />
    </div>
    <p className="text-2xl font-zentry text-white mb-1">{value}</p>
    {subtitle && <p className="text-slate-400 text-xs">{subtitle}</p>}
  </div>
);

// Game Stats Component
const GameStats = ({ games }) => (
  <div className="space-y-4">
    {games.list.map((game) => {
      const tournamentCount =
        games.tournamentsPerGame[game.slug.toLowerCase().replace(/\s+/g, '')] || 0;
      const teamCount = games.teamsPerGame[game.slug.toLowerCase().replace(/\s+/g, '')] || 0;

      return (
        <div key={game.id} className="p-4 bg-secondary/30 ">
          <div className="flex  items-center justify-between mb-3">
            <h4 className="text-primary font-zentry font-3xl">{game.name}</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-slate-400 text-xs font-circular-web mb-1">Tournaments</p>
              <p className="text-white font-bold text-lg">{tournamentCount}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-circular-web mb-1">Teams</p>
              <p className="text-white font-bold text-lg">{teamCount}</p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

// Main Dashboard Component
const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard-stats.php`,
        );
        const data = await response.json();

        if (data.success) {
          setStats(data.data);
          setError(null);
        } else {
          setError(data.error || 'Failed to load dashboard statistics');
        }
      } catch (err) {
        setError('Network error: Unable to fetch dashboard data');
        console.error('Dashboard fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen ">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-slate-400 font-zentry text-3xl">Loading STATS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f172a]">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#1a2332] text-white rounded-lg hover:bg-slate-700/50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const getTrend = (value) => {
    if (value > 0) return 'up';
    if (value < 0) return 'down';
    return 'neutral';
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between"></div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            icon={Trophy}
            label="Total Tournaments"
            value={stats.coreMetrics.tournaments.total}
            change={stats.trends.tournamentGrowth}
            trend={getTrend(stats.trends.tournamentGrowth)}
            color="blue"
            subtext={`${stats.coreMetrics.tournaments.live} live • ${stats.coreMetrics.tournaments.upcoming} upcoming`}
          />
          <StatsCard
            icon={Users}
            label="Total Users"
            value={stats.coreMetrics.users.total.toLocaleString()}
            change={stats.trends.userGrowth}
            trend={getTrend(stats.trends.userGrowth)}
            color="green"
            subtext={`${stats.coreMetrics.users.verified} verified • ${stats.coreMetrics.users.newThisMonth} new`}
          />
          <StatsCard
            icon={Target}
            label="Active Teams"
            value={stats.coreMetrics.teams.active}
            change={stats.trends.teamGrowth}
            trend={getTrend(stats.trends.teamGrowth)}
            color="purple"
            subtext={`${stats.coreMetrics.teams.total} total • Avg ${stats.coreMetrics.teams.averageSize} members`}
          />
          <StatsCard
            icon={DollarSign}
            label="Total Prize Pool"
            value={`${stats.summary.totalPrizePool.toLocaleString()} DH`}
            color="yellow"
            subtext={`${stats.coreMetrics.financial.activePrizePool.toLocaleString()} DH active`}
          />
        </div>

        {/* Engagement Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MiniStatCard
            icon={FileCheck}
            label="Registrations"
            value={stats.engagement.registrations.accepted}
            subtitle={`${stats.engagement.registrations.pending} pending`}
            color="green"
          />
          <MiniStatCard
            icon={Clock}
            label="Pending Requests"
            value={stats.engagement.registrations.pending + stats.engagement.teamRequests.pending}
            subtitle="Awaiting approval"
            color="yellow"
          />
          <MiniStatCard
            icon={PlayCircle}
            label="Live Matches"
            value={stats.matches.live}
            subtitle={`${stats.matches.today} today`}
            color="orange"
          />
          <MiniStatCard
            icon={Activity}
            label="Active Users"
            value={stats.engagement.activity.weeklyActiveUsers}
            subtitle="Last 7 days"
            color="blue"
          />
          <MiniStatCard
            icon={Award}
            label="Completion Rate"
            value={`${stats.quality.tournamentCompletionRate}%`}
            subtitle="Tournament success"
            color="purple"
          />
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#1a2332] p-6 ">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-circular-web">Match Stats</h3>
              <Gamepad2 className="text-blue-400" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400 ">Total</span>
                <span className="text-white  text-xl font-zentry">{stats.matches.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Completed</span>
                <span className="text-green-400  text-xl font-zentry">
                  {stats.matches.completed}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Scheduled</span>
                <span className="text-blue-400  text-xl font-zentry">
                  {stats.matches.scheduled}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2332] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Quality Metrics</h3>
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Fill Rate</span>
                <span className="text-white text-xl font-zentry">
                  {stats.quality.tournamentFillRate}%
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Avg Participants</span>
                <span className="text-white  text-xl font-zentry">
                  {stats.quality.avgParticipantsPerTournament}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Return Players</span>
                <span className="text-white  text-xl font-zentry">
                  {stats.quality.returnPlayerCount}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2332] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-circular-web">Team Tiers</h3>
              <Users className="text-purple-400" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Professional</span>
                <span className="text-white  text-xl font-zentry">
                  {stats.coreMetrics.teams.professional}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Semi-Pro</span>
                <span className="text-white  text-xl font-zentry">
                  {stats.coreMetrics.teams.semiPro}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Amateur</span>
                <span className="text-white  text-xl font-zentry">
                  {stats.coreMetrics.teams.amateur}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2332] p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">System Health</h3>
              <Shield className="text-blue-400" size={20} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Admins</span>
                <span className="text-white  text-xl font-zentry">{stats.admin.totalAdmins}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Failed Logins</span>
                <span
                  className={`font-zentry  text-xl ${
                    stats.admin.systemHealth.failedLoginAttempts > 10
                      ? 'text-red-400'
                      : 'text-white'
                  }`}
                >
                  {stats.admin.systemHealth.failedLoginAttempts}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Unread Notifications</span>
                <span className="text-white font-zentry  text-xl">
                  {stats.admin.content.unreadNotifications}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tournament Types */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a2332] p-6 rounded-lg">
            <h3 className="text-white font-circular-web mb-4">By Bracket Type</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Single Elimination</span>
                <span className="text-white font-zentry  text-xl">
                  {stats.tournamentTypes.byBracketType.singleElimination}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Double Elimination</span>
                <span className="text-white font-zentry  text-xl">
                  {stats.tournamentTypes.byBracketType.doubleElimination}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Round Robin</span>
                <span className="text-white font-zentry  text-xl">
                  {stats.tournamentTypes.byBracketType.roundRobin}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Battle Royale</span>
                <span className="text-white font-zentry  text-xl">
                  {stats.tournamentTypes.byBracketType.battleRoyale}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2332] p-6 rounded-lg">
            <h3 className="text-white font-circular-web mb-4">By Participation</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Individual</span>
                <span className="text-white font-zentry  text-xl">
                  {stats.tournamentTypes.byParticipationType.individual}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Team</span>
                <span className="text-white font-zentry  text-xl">
                  {stats.tournamentTypes.byParticipationType.team}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-[#1a2332] p-6 rounded-lg">
            <h3 className="text-white font-circular-web mb-4">By Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Draft</span>
                <span className="text-white font-zentry  text-xl">
                  {stats.tournamentTypes.byStatus.draft}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Registration Open</span>
                <span className="text-green-400 font-zentry  text-xl">
                  {stats.tournamentTypes.byStatus.registration_open}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Ongoing</span>
                <span className="text-blue-400 font-zentry  text-xl">
                  {stats.tournamentTypes.byStatus.ongoing}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Completed</span>
                <span className="text-slate-400 font-zentry  text-xl">
                  {stats.tournamentTypes.byStatus.completed}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Games and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
          <div className="bg-[#1a2332] p-6 rounded-lg">
            {/* <h2 className="text-2xl font-zentry text-white mb-4 flex items-center gap-2">
              <Gamepad2 size={24} />
              Games Overview
            </h2> */}
            <GameStats games={stats.games} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
