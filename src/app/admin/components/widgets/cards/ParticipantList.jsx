import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Users,
  UserSearch,
  LayoutGrid,
  List,
  CheckCircle2,
  Badge,
  MapPin,
  Mail,
  Star,
  Clock,
  Check,
  X,
  Ban,
  User,
  Shield,
  AlertCircle,
  Trophy,
} from 'lucide-react';
import TransparentLoader from '@/app/admin/(pages)/tournament/[slug]/Loader';
import ProfileCard from './ParticipantsCard';

const ViewToggle = ({ view, onViewChange }) => (
  <div className="flex gap-2 bg-[#1a2332] rounded-lg p-1 border border-slate-700/50">
    <button
      onClick={() => onViewChange('grid')}
      className={`p-2 rounded-lg transition-colors ${
        view === 'grid' 
          ? 'bg-slate-700/50 text-white' 
          : 'text-slate-400 hover:text-white'
      }`}
    >
      <LayoutGrid className="w-5 h-5" />
    </button>
    <button
      onClick={() => onViewChange('list')}
      className={`p-2 rounded-lg transition-colors ${
        view === 'list' 
          ? 'bg-slate-700/50 text-white' 
          : 'text-slate-400 hover:text-white'
      }`}
    >
      <List className="w-5 h-5" />
    </button>
  </div>
);

const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-full p-8 mb-6 border border-slate-700/50">
      <UserSearch className="w-16 h-16 text-slate-400" />
    </div>
    <h3 className="text-2xl font-bold text-white mb-3 font-ea-football">
      Aucun participant pour le moment
    </h3>
    <p className="text-slate-400 text-center max-w-md">
      Les participants acceptés apparaîtront ici. Revenez plus tard pour voir les mises à jour.
    </p>
  </div>
);

const StatsCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-gradient-to-br from-[#1a2332] to-[#0f172a] p-6  transition-all">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg bg-gradient-to-br ${
        color === 'blue' ? 'from-blue-500/20 to-blue-600/20' :
        color === 'green' ? 'from-green-500/20 to-green-600/20' :
        color === 'purple' ? 'from-purple-500/20 to-purple-600/20' :
        'from-yellow-500/20 to-yellow-600/20'
      }`}>
        <Icon className={`w-6 h-6 ${
          color === 'blue' ? 'text-blue-400' :
          color === 'green' ? 'text-green-400' :
          color === 'purple' ? 'text-purple-400' :
          'text-yellow-400'
        }`} />
      </div>
      <div>
        <p className="text-slate-400 text-sm uppercase tracking-wider">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

const ParticipantCardGrid = ({ tournamentId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewType, setViewType] = useState('grid');
  const [selectedProfile, setSelectedProfile] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_accepted_participants.php?tournament_id=${tournamentId}`
        );
        const data = await response.json();
        
        if (data.success) {
          console.log(data);
          setParticipants(data.participants);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch participants. Please try again later.');
        console.error('Error fetching participants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [tournamentId]);

  const handleStatusUpdate = (id, newStatus) => {
    setParticipants((prev) =>
      prev.map((p) => (p.registration_id === id ? { ...p, status: newStatus } : p)),
    );
    setSelectedProfile((prev) => (prev ? { ...prev, status: newStatus } : null));
  };

  // Calculate stats
  const stats = {
    total: participants.length,
    verified: participants.filter(p => p.is_verified).length,
    teams: participants.filter(p => p.team_id).length,
    individuals: participants.filter(p => !p.team_id).length,
  };

  if (loading) {
    return (
      <TransparentLoader
        messages={[
          'Loading participants...',
          'Please wait while we retrieve the data...',
          'Almost there...',
        ]}
      />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="bg-gradient-to-br from-[#1a2332] to-[#0f172a] rounded-lg p-8 border border-red-500/50 max-w-md">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-lg bg-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">Une erreur est survenue</p>
              <p className="text-sm text-red-400">{error}</p>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors mt-4"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const ProfileModal = () => {
    if (!selectedProfile) return null;

    const profileSpecs = [
      {
        icon: <User className="w-5 h-5 text-slate-400" />,
        label: 'Username',
        value: selectedProfile.username,
        subValue: selectedProfile.status,
      },
      {
        icon: <Mail className="w-5 h-5 text-slate-400" />,
        label: 'Email',
        value: selectedProfile.email,
        subValue: 'Contact',
      },
      {
        icon: <Clock className="w-5 h-5 text-slate-400" />,
        label: 'Registration Date',
        value: new Date(selectedProfile.registration_date).toLocaleDateString(),
        subValue: 'Joined',
      },
      {
        icon: <Shield className="w-5 h-5 text-slate-400" />,
        label: 'Status',
        value: selectedProfile.is_verified ? 'Verified' : 'Unverified',
        subValue: 'Account Verification',
      },
      {
        icon: <Star className="w-5 h-5 text-slate-400" />,
        label: 'Points',
        value: selectedProfile.points || '0',
        subValue: 'Achievement Score',
      },
      {
        icon: <Users className="w-5 h-5 text-slate-400" />,
        label: 'Team',
        value: selectedProfile.team_id ? 'Team Member' : 'Individual',
        subValue: selectedProfile.team_id ? `${selectedProfile.member_count} members` : 'No Team',
      },
    ];

    const statusColors = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
      accepted: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
      rejected: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
    };

    const statusStyle = statusColors[selectedProfile.status] || statusColors.pending;

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm">
        <div className="min-h-screen px-4 text-center">
          <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-br from-[#1a2332] to-[#0f172a] shadow-2xl rounded-lg border border-slate-700/50">
            {/* Header with Background */}
            <div className="relative h-48">
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${selectedProfile.avatar || '/api/placeholder/800/400'})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-transparent" />
              </div>

              <button
                onClick={() => setSelectedProfile(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-800/80 backdrop-blur-sm text-white hover:bg-slate-700 transition-all border border-slate-700/50"
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Info */}
            <div className="relative px-6 pb-6 -mt-16">
              <div className="flex items-start gap-6">
                <div className="relative">
                  <img
                    src={selectedProfile.avatar || '/api/placeholder/128/128'}
                    alt={selectedProfile.name}
                    className="w-28 h-28 rounded-lg border-4 border-[#0f172a] object-cover shadow-xl"
                  />
                  {selectedProfile.is_verified && (
                    <div className="absolute -bottom-2 -right-2 p-1 rounded-full bg-blue-500 border-2 border-[#0f172a]">
                      <CheckCircle2 size={16} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="flex-1 pt-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-3xl font-bold text-white font-ea-football">{selectedProfile.name}</h3>
                      <p className="text-slate-400 mt-1">@{selectedProfile.username}</p>
                    </div>

                    <div className={`px-4 py-2 rounded-lg ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
                      <span className="text-sm font-medium capitalize">
                        {selectedProfile.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="mt-8 p-6 bg-black/30 rounded-lg border border-slate-700/50">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {profileSpecs.map((spec, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-slate-800/50">
                          {spec.icon}
                        </div>
                        <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">{spec.label}</h3>
                      </div>
                      <div className="space-y-1 ml-11">
                        <p className="text-base font-semibold text-white">{spec.value}</p>
                        <p className="text-xs text-slate-500">{spec.subValue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              {selectedProfile.status === 'pending' && (
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={() => handleStatusUpdate(selectedProfile.registration_id, 'accepted')}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors border border-green-500/30 font-medium"
                  >
                    <Check size={20} />
                    <span>Accept Participant</span>
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedProfile.registration_id, 'rejected')}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors border border-red-500/30 font-medium"
                  >
                    <X size={20} />
                    <span>Reject Participant</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!participants || participants.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Header */}
      <div className="  -mx-6 -mt-6 px-12 py-12 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold font-ea-football text-primary mb-2">
              Accepted Participants
            </h1>
            <div className="flex items-center text-slate-400">
              <Trophy className="mr-2" size={20} />
              <p className="text-sm uppercase tracking-wider">Manage and review tournament registrations</p>
            </div>
          </div>
          <ViewToggle view={viewType} onViewChange={setViewType} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={Users}
          label="Total Participants"
          value={stats.total}
          color="blue"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Verified"
          value={stats.verified}
          color="green"
        />
        <StatsCard
          icon={Users}
          label="Teams"
          value={stats.teams}
          color="purple"
        />
        <StatsCard
          icon={User}
          label="Individuals"
          value={stats.individuals}
          color="yellow"
        />
      </div>

      {/* Participants Grid/List */}
      <div
        className={
          viewType === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'flex flex-col space-y-4'
        }
      >
        {participants.map((participant) => (
          <ProfileCard
            key={participant.registration_id}
            profile={participant}
            viewType={viewType}
            onProfileSelect={() => setSelectedProfile(participant)}
          />
        ))}
      </div>

      {/* Profile Modal */}
      <ProfileModal />
    </>
  );
};

export default ParticipantCardGrid;