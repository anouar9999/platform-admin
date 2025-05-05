'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Edit, Trash2, Eye, EyeOff, Loader2, Search, Users, Shield, Award, Trophy, Star, Zap, TrendingDown, Minus, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import EditTeamModal from './EditTeamModal';
import { useToast } from '@/utils/ToastProvider';
import LoadingScreen from '@/app/loading';
import { TbTournament } from 'react-icons/tb';


const TeamCard = ({ team, onEdit, onDelete }) => {
  const { 
    id,
    name, 
    total_members, 
    wins = 0,
    losses = 0,
    draws = 0, // Adding draws as a new stat (with default of 0)
    win_rate,
    tier = "professional",
    division = "diamond"
  } = team;
  
  const matches = wins + losses + draws;
  
  // Get primary color for team card (for Lomita ME style)
  const getCardColors = () => {
    // These are preset card colors matched to the example image
    // First one is yellow/amber like in your reference
    const cardThemes = [
      { 
        primary: '#FFD700', // Yellow/gold
        secondary: '#EB9B00', 
        textColor: '#000000',
        gradient: 'linear-gradient(to right, #FFD700, #EB9B00)'
      },
      { 
        primary: '#32CD32', // Green
        secondary: '#228B22', 
        textColor: '#FFFFFF',
        gradient: 'linear-gradient(to right, #32CD32, #228B22)' 
      },
      { 
        primary: '#00BFFF', // Blue
        secondary: '#0080FF', 
        textColor: '#FFFFFF',
        gradient: 'linear-gradient(to right, #00BFFF, #0080FF)' 
      },
      { 
        primary: '#FF6347', // Red/Tomato
        secondary: '#DC143C',
        textColor: '#FFFFFF',
        gradient: 'linear-gradient(to right, #FF6347, #DC143C)'
      },
      { 
        primary: '#9370DB', // Purple
        secondary: '#7B68EE',
        textColor: '#FFFFFF',
        gradient: 'linear-gradient(to right, #9370DB, #7B68EE)'
      },
      { 
        primary: '#20B2AA', // Teal
        secondary: '#008B8B',
        textColor: '#FFFFFF',
        gradient: 'linear-gradient(to right, #20B2AA, #008B8B)'
      },
      { 
        primary: '#F08080', // Light Coral
        secondary: '#CD5C5C',
        textColor: '#FFFFFF',
        gradient: 'linear-gradient(to right, #F08080, #CD5C5C)'
      }
    ];
    
    // Use team id to get consistent color for the same team
    const index = id % cardThemes.length;
    return cardThemes[index];
  };
  
  const cardColors = getCardColors();

  return (
    <motion.div 
      className="relative overflow-hidden rounded-lg h-36 shadow-md group"
      initial={{ opacity: 0.9, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Background Image with Enhanced Overlay Effects */}
      <div className="absolute inset-0 z-0">
        {team.banner ? (
          <img 
            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.banner}`} 
            alt={team.name} 
            className="w-full h-full object-cover opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
        )}
        
        {/* Multiple Overlay Layers for Enhanced Visual Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
        
        {/* Accent color overlay based on card theme */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{ 
            background: `linear-gradient(135deg, ${cardColors.primary}40, transparent 50%)` 
          }}
        ></div>
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
        
        {/* Top border glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-white opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-start p-2">
        {/* Left Circle Emblem with enhanced effects */}
        <div className="h-14 w-14 relative flex-shrink-0">
          <div 
            className="h-full w-full rounded-full flex items-center justify-center border-2 border-white border-opacity-60 overflow-hidden"
            style={{ 
              boxShadow: `0 0 10px rgba(0,0,0,0.3), 0 0 5px ${cardColors.primary}80`,
              background: 'rgba(0,0,0,0.3)'
            }}
          >
            {team.logo ? (
              <img 
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`} 
                alt={name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {name.substring(0, 2).toUpperCase()}
              </span>
            )}
            
            {/* Inner glow effect */}
            <div 
              className="absolute inset-0 rounded-full"
              style={{ 
                boxShadow: `inset 0 0 10px ${cardColors.primary}50`,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1), transparent 80%)'
              }}
            ></div>
          </div>
        </div>

        {/* Center Content */}
        <div className="flex-1 pl-2 overflow-hidden">
          <div className="flex flex-col">
            {/* Team name with multiple overlay effects */}
            <h3 className="text-xl font-custom tracking-wider uppercase mr-2 truncate relative">
              {/* Text glow container */}
              <span className="relative inline-block">
                {/* Actual visible text */}
                <span className="relative z-20 text-white" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
                  {name} 
                </span>
                
                {/* Text outline effect */}
                <span 
                  className="absolute inset-0 z-10" 
                  style={{ 
                    color: 'transparent',
                    WebkitTextStroke: `1px ${cardColors.primary}40`,
                    transform: 'translateY(1px)'
                  }}
                >
                  {name} 
                </span>
                
                {/* Text glow effect */}
                <span 
                  className="absolute inset-0 blur-[2px] z-0" 
                  style={{ 
                    color: cardColors.primary,
                    opacity: 0.4,
                    filter: 'blur(3px)',
                  }}
                >
                  {name} ME
                </span>
              
                {/* Bottom line accent */}
                <span 
                  className="absolute left-0 right-0 h-[2px] bottom-[-2px]"
                  style={{ 
                    background: `linear-gradient(to right, ${cardColors.primary}, transparent 85%)`,
                    opacity: 0.7
                  }}
                ></span>
              </span>
            </h3>
            
            {/* Small subtitle - adds depth */}
            <div className="flex items-center mt-[-2px]">
              <div 
                className="h-[2px] w-8 mr-2" 
                style={{ 
                  background: `linear-gradient(to right, ${cardColors.primary}70, transparent)`,
                }}
              ></div>
              <span className="text-[10px] uppercase tracking-wider text-white text-opacity-60">
                {division || "League"}
              </span>
            </div>
          </div>
          
          {/* Record Stats with Win/Loss/Draw Display */}
          <div className="mt-2 flex items-center space-x-4">
            {/* Total Matches */}
            <div className="text-xs text-white text-opacity-80">
              <span className="mr-1">{matches}</span>
              <span className="text-white text-opacity-60">MATCHES</span>
            </div>
            
            {/* Separator */}
            <div className="w-px h-3 bg-white bg-opacity-30"></div>
            
            {/* Win Rate if available */}
            {win_rate && (
              <div className="text-xs">
                <span 
                  className="font-medium" 
                  style={{ color: cardColors.primary }}
                >
                  {win_rate}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Admin Controls - Hidden by default, visible on hover */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(team)}
              className="p-1 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-colors"
            >
              <Edit className="h-4 w-4 text-white" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1 bg-black bg-opacity-50 rounded-lg hover:bg-opacity-70 transition-colors"
              style={{ color: '#ef4444' }}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Win/Loss/Draw Stats Display */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-4 px-2">
          {/* Wins */}
          <div className="flex items-center">
            <TrendingUp 
              className="h-3 w-3 mr-1" 
              style={{ color: '#4ade80' }} // Green color for wins
            />
            <span className="text-xs font-medium text-white">
              {wins || 0}
            </span>
          </div>
          
          {/* Losses */}
          <div className="flex items-center">
            <TrendingDown 
              className="h-3 w-3 mr-1" 
              style={{ color: '#f87171' }} // Red color for losses
            />
            <span className="text-xs font-medium text-white">
              {losses || 0}
            </span>
          </div>
          
          {/* Draws */}
          <div className="flex items-center">
            <Minus 
              className="h-3 w-3 mr-1" 
              style={{ color: '#94a3b8' }} // Slate color for draws
            />
            <span className="text-xs font-medium text-white">
              {draws || 0}
            </span>
          </div>
        </div>

        {/* Bottom Badge Area with Game Information */}
        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-between">
          {/* Left Badge - Using Background Image instead of gradient */}
          <div className="relative overflow-hidden h-5">
            <div 
              className="relative flex items-center h-full px-4 py-1"
              style={{ 
                clipPath: 'polygon(0 0, 100% 0, 90% 100%, 0% 100%)',
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                {team.game && team.game.image ? (
                  <img 
                    src={team.game.image} 
                    alt={team.game.name || "Game"} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div 
                    className="w-full h-full" 
                    style={{ 
                      backgroundImage: "url('https://curry.gg/uploads/703/64q9D5Bw2mASHeqoTlvoglqW7P7p1G-metaR29sZCAzLnBuZw==-.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center"
                    }}
                  ></div>
                )}
                
                {/* Multi-layer overlays for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-40"></div>
                
                {/* Subtle texture overlay */}
                <div 
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle at 10% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                    backgroundSize: '4px 4px'
                  }}
                ></div>
                
                {/* Top highlight */}
                <div className="absolute top-0 left-0 right-0 h-px bg-white opacity-30"></div>
              </div>
              
              {/* Game name text */}
              <span 
                className="relative z-10 text-xs font-medium text-white" 
                style={{ textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
              >
                {team.game && team.game.name ? team.game.name : "Game"}
              </span>
            </div>
          </div>
          
          {/* Right Badge */}
          <div className="px-3 py-1 flex items-center">
            <img className="w-6 h-6 mr-1" src="https://curry.gg/uploads/703/64q9D5Bw2mASHeqoTlvoglqW7P7p1G-metaR29sZCAzLnBuZw==-.png" alt="Icon" />
            <span 
              className="text-xs text-white font-medium"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
              {total_members} Members
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};



const TeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/get_teams.php`);
      if (response.data.success) {
        console.log(response.data)
        setTeams(response.data.data || []);
      } else {
        console.log(response)
        setError(response.data.error || 'Failed to fetch teams');
      }
    } catch (err) {
      
      setError('Error fetching teams: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

const handleEditTeam = async (formData) => {
    setLoading(true);
    try {
        // Ensure the form data contains the ID
        if (!formData.get('id') && editingTeam?.id) {
            formData.append('id', editingTeam.id);
        }

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/edit_team.php`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        );

        if (response.data.success) {
            // Refresh teams data instead of manually updating
            fetchTeams();
            showToast('Team updated successfully', 'success', 1500);
            setEditingTeam(null);
        } else {
            setError(response.data.message || 'Failed to update team');
            showToast(response.data.message || 'Failed to update team', 'error', 1500);
        }
    } catch (err) {
        setError('Error updating team: ' + err.message);
        showToast(`Error updating team: ${err.message}`, 'error', 1500);
        console.error('Update error:', err);
    } finally {
        setLoading(false);
    }
};

  const handleDeleteTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to delete this team?')) return;
    setLoading(true);

    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/delete_team.php`,
        { data: { team_id: teamId } }
      );
      if (response.data.success) {
        setTeams(teams.filter(team => team.id !== teamId));
        showToast('Team deleted successfully', 'success',1500);
      } else {
        setError(response.data.message || 'Failed to delete team');
        
      }
    } catch (err) {
      setError('Error deleting team: ' + err.message);
      showToast(`Error deleting team: ${err.message}`, 'error',1500);
    } finally {
      setLoading(false);}
  };

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.team_game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
     return (
     <LoadingScreen/>
     );
   }

  return (
    <div className="container mx-auto px-4 py-8  ">
       <div className="mb-6">
              <div className="flex items-center text-primary ">
                <TbTournament />
                <p className="mx-2 font-semibold uppercase tracking-wider"> Teams Management</p>
              </div>
      
              <h1 className="text-3xl flex items-center font-custom tracking-wider uppercase">
              Manage and monitor teams
              </h1>
            </div>
    

            <div className=" mb-8 gap-4 grid grid-cols-1 md:grid-cols-3">
            <div className="relative md:col-span-2">
      <input
            type="text"
            placeholder="Search teams by name or game"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-secondary text-white angular-cut pl-10 focus:outline-none"
          />
<Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTeams.map(team => (
          <>
          <TeamCard
            key={team.id}
            team={team}
            onEdit={setEditingTeam}
            onDelete={handleDeleteTeam}
          />
       
          </>
        ))}
      </div>

      {filteredTeams.length === 0 && !loading && (
        <div className="text-center text-gray-400 mt-8">
          <Users size={48} className="mx-auto mb-4" />
          <p>No teams found matching.</p>
        </div>
      )}

      {editingTeam && (
        <EditTeamModal
          isOpen={!!editingTeam}
          onClose={() => setEditingTeam(null)}
          team={editingTeam}
          onSave={handleEditTeam}
        />
      )}
    </div>
  );
};

export default TeamManagement;