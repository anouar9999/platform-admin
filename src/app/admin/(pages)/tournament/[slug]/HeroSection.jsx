/* eslint-disable @next/next/no-img-element */
import { useParams, useRouter } from 'next/navigation';
import { ArrowRight, Clock, Edit, Globe, Share2, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/utils/ToastProvider';
import LoadingOverlay from './Loading';
import TournamentStatus from './TournamentStatus';
import { formatDate } from './../../../../../utils/helpers';
import { motion } from 'framer-motion';
import ToastDemo from '@/app/admin/toast';

export const HeroSection = ({
  updateTournamentStatus,
  tournamentId,
  title,
  backgroundSrc,
  startDate,
  endDate,
  tournament,
  gameData,
}) => {
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const handleEdit = () => {
    router.push(`/admin/edit-tournament/${tournamentId}`);
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete this tournament? This action cannot be undone.',
      )
    ) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete_tournament.php`,
          { tournament_id: tournamentId },
        );

        if (response.data.success) {
          showToast(response.data.message, 'success', 1500);
          setTimeout(() => {
            router.push('/admin/tournaments');
          }, 1500);
        } else {
          showToast(response.data.message, 'error', 5000);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast(`An error occurred while deleting the tournament: ${error}`, 'error', 5000);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <LoadingOverlay />;
  }

  // Button animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };
  const getStatusColor = (status) => {
    switch (status) {
      case 'registration_open':
        return 'from-blue-500 to-blue-600';
      case 'registration_closed':
        return 'from-amber-500 to-amber-600';
      case 'ongoing':
        return 'from-green-500 to-green-600';
      case 'completed':
        return 'from-purple-500 to-purple-600';
      case 'cancelled':
        return 'from-red-500 to-red-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };
  const GameFont = (game_name) => {
    switch (game_name) {
      case 'Free Fire':
        return 'font-free-fire';
      case 'Valorant':
        return 'font-valorant';
      case 'Fc Football':
        return 'font-ea-football';
      case 'Street Fighter':
        return 'font-street-fighter';

      default:
        return 'custom';
    }
  };

  // Get next status text
  const getNextStatusAction = (status) => {
    switch (status) {
      case 'registration_open':
        return 'Close Registration';
      case 'registration_closed':
        return 'Start Tournament';
      case 'ongoing':
        return 'Complete Tournament';
      default:
        return '';
    }
  };

  // Handle button click based on status and bracket type
  const handleActionButtonClick = () => {
    if (tournament.status === 'registration_closed') {
      // Special handling for "Start Tournament" based on bracket type
      if (tournament.bracket_type === 'Battle Royale') {
        // Fetch the Battle Royale leaderboard data first to check if it's properly set up
        axios
          .get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_battle_royale_leaderboard.php?tournament_id=${tournamentId}`,
          )
          .then((response) => {
            if (response.data.success) {
            } else {
              // Handle error case
              toast.error('Failed to load Battle Royale data. Please try again.');
            }
          })
          .catch((error) => {
            console.error('Error fetching Battle Royale data:', error);
            toast.error('An error occurred while loading Battle Royale data.');
          });
      } else if (tournament.bracket_type === 'Round Robin') {
        // Navigate to Round Robin setup
        axios
          .post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournament_round_robin.php?tournament_id=${tournamentId}`,
          )
          .then((response) => {
            if (response.data.success) {
            } else {
              // Handle error case
              console.log('Failed to load Battle Royale data. Please try again.');
            }
          })
          .catch((error) => {
            console.error('Error fetching Battle Royale data:', error);
            console.log('An error occurred while loading Battle Royale data.');
          });
      } else {
        // For other bracket types, just update the status
        updateTournamentStatus('ongoing');
      }
    } else {
      // Standard status update for other statuses
      let nextStatus;
      if (tournament.status === 'registration_open') nextStatus = 'registration_closed';
      else if (tournament.status === 'ongoing') nextStatus = 'completed';

      if (nextStatus) updateTournamentStatus(nextStatus);
    }
  };
  return (
    <div className="relative w-full overflow-hidden rounded-lg">
      {/* Hero container with better proportions */}
      <div className="relative w-full h-48 md:h-52 overflow-hidden">
        {/* Background image with proper overlay */}
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${backgroundSrc}`}
          alt={`${title} tournament banner`}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />

        {/* Gradient overlay with stronger bottom fade for better text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-dark/85 to-transparent"></div>

        <div className="absolute inset-0 bg-gradient-to-b from-dark via-transparent to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-dark/85 to-transparent"></div>

        {/* Content container with flex layout */}
        <div className="absolute inset-0 z-10 flex flex-col h-full">
          {/* Top section - with status and action buttons */}
          <div className="p-6 md:p-8 flex justify-between items-start">
            {/* Tournament Status Badge */}
            {tournament && tournament.status && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                // className={`py-1.5 px-4 angular-cut bg-gradient-to-r ${getStatusColor(tournament.status)} shadow-lg`}
              >
                <span className="text-white font-semibold uppercase text-sm tracking-wider">
                  {/* {tournament.status.replace('_', ' ')} */}
                </span>
              </motion.div>
            )}

            {/* Action buttons */}
            <div className="flex space-x-2">
              <motion.button
                className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/20 transition-colors shadow-lg"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                aria-label="Share tournament"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/20 transition-colors shadow-lg"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={handleEdit}
                aria-label="Edit tournament"
              >
                <Edit className="w-5 h-5" />
              </motion.button>

              <motion.button
                className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white hover:bg-red-500/20 transition-colors shadow-lg"
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
                onClick={handleDelete}
                aria-label="Delete tournament"
              >
                <Trash2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Middle section - for spacing */}
          <div className="flex-grow"></div>

          {/* Bottom section with title, metadata, and action button */}
          <div className="p-6 md:p-8 flex items-end justify-between">
            {/* Left side: Title and metadata */}
            <div className="flex-1 mr-4">
              {/* Title at bottom left */}
              <motion.h1
                className={`${
                  gameData.game_name == 'Street Fighter' ? 'text-xl' : 'text-3xl md:text-5xl'
                } ${GameFont(
                  gameData.game_name,
                )} text-white drop-shadow-lg bg-gradient-to-r from-white to-white/70 text-transparent bg-clip-text mb-3`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
              >
                {title}
              </motion.h1>

              {/* Metadata section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {/* Secondary info row */}
                <div className="flex flex-wrap gap-4 text-white/80 text-xs">
                  {/* Registration Period */}
                  {tournament && tournament.registration_start && tournament.registration_end && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-300" />
                      <span className="text-primary font-semibold">
                        <span className="font-mono text-md text-white">Registration:</span>{' '}
                        {formatDate(tournament.registration_start)} -{' '}
                        {formatDate(tournament.registration_end)}
                      </span>
                    </div>
                  )}

                  {/* Stream URL */}
                  {tournament && tournament.stream_url && (
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-purple-300" />
                      <a
                        href={tournament.stream_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 transition-colors"
                      >
                        {tournament.stream_url}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right side: Action button for tournament flow */}
            <div className="flex items-end">
              {tournament && tournament.status && getNextStatusAction(tournament.status) && (
                <motion.button
                  className={`bg-primary angular-cut text-white px-4 py-2 font-medium flex items-center gap-2 shadow-lg`}
                  variants={buttonVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleActionButtonClick}
                >
                  {getNextStatusAction(tournament.status)}
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
