'use client';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { X, Edit, Trash2, Eye, EyeOff, Loader2, Search, Users, Shield, Award, Trophy, Star, Zap } from 'lucide-react';
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
    owner_username,
    wins ,
    losses,
    win_rate,
    tier = "professional",
    division = "diamond"
  } = team;
  
  const matches = wins + losses;
  
  
  
  // Division styling with modern aesthetics
  const getDivisionData = (div) => {
    switch(div?.toLowerCase()) {
      case 'diamond': 
        return {
          color: '#00CFFF',
          gradient: 'linear-gradient(135deg, #00CFFF20, #00CFFF00)',
          border: 'border-[#00CFFF60]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#00CFFF" />
        };
      case 'platinum': 
        return {
          color: '#E5E4E2',
          gradient: 'linear-gradient(135deg, #E5E4E220, #E5E4E200)',
          border: 'border-[#E5E4E260]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#E5E4E2" />
        };
      case 'gold': 
        return {
          color: '#FFD700',
          gradient: 'linear-gradient(135deg, #FFD70020, #FFD70000)',
          border: 'border-[#FFD70060]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#FFD700" />
        };
      case 'silver': 
        return {
          color: '#C0C0C0',
          gradient: 'linear-gradient(135deg, #C0C0C020, #C0C0C000)',
          border: 'border-[#C0C0C060]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#C0C0C0" />
        };
      case 'bronze': 
        return {
          color: '#CD7F32',
          gradient: 'linear-gradient(135deg, #CD7F3220, #CD7F3200)',
          border: 'border-[#CD7F3260]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#CD7F32" />
        };
      default: 
        return {
          color: '#FFFFFF',
          gradient: 'linear-gradient(135deg, #FFFFFF20, #FFFFFF00)',
          border: 'border-[#FFFFFF60]',
          icon: <Shield className="w-3.5 h-3.5" stroke="#FFFFFF" />
        };
    }
  };
  
  const divisionData = getDivisionData(division);
  
  // Tier icons with matching aesthetic
  const getTierData = (tier) => {
    switch(tier?.toLowerCase()) {
      case 'professional': 
        return {
          icon: <Trophy className="w-3.5 h-3.5" />,
          label: 'PRO',
          color: '#FFD700'
        };
      case 'semi-pro': 
        return {
          icon: <Star className="w-3.5 h-3.5" />,
          label: 'SEMI-PRO',
          color: '#C0C0C0'
        };
      case 'amateur': 
        return {
          icon: <Zap className="w-3.5 h-3.5" />,
          label: 'AMATEUR',
          color: '#CD7F32'
        };
      default: 
        return {
          icon: <Zap className="w-3.5 h-3.5" />,
          label: 'AMATEUR',
          color: '#FFFFFF'
        };
    }
  };
  


  return (
    <motion.div 
      className={`angular-cut overflow-hidden relative bg-secondary`}
      initial={{ opacity: 0.9, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
     
      
    >
 
      

      {/* Banner with game image */}
      <div className="h-24 relative overflow-hidden">
        <img 
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.banner}`} 
          alt={team.name} 
          className="w-full h-full object-cover opacity-60"
        />
      
        
        {/* Game badge */}
        <div 
  className="absolute bottom-0 right-0 px-2.5 py-1 text-xs font-medium flex items-center  overflow-hidden "
  style={{ 
    backgroundImage: `url(${team.game.image})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backdropFilter: 'blur(8px)'
  }}
>
  {/* Dark overlay */}
  <div 
    className="absolute inset-0 bg-black/50 z-0"
    style={{ mixBlendMode: 'multiply' }}
  ></div>
  
  {/* Content (on top of the overlay) */}
  <span className="relative z-10 text-white">
    {team.game.name}
  </span>
</div>
        
        {/* Action buttons - MOVED TO TOP RIGHT */}
        <div className="absolute top-2 right-2 flex gap-2 z-10">
          <motion.button
            onClick={() => onEdit(team)}
            className="p-1.5 rounded-lg backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            
          >
            <Edit className="h-4 w-4" />
          </motion.button>
          <motion.button
            onClick={() => onDelete(id)}
            className="p-1.5 rounded-lg backdrop-blur-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ 
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#ef4444'
            }}
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      </div>

      {/* Team info area */}
      <div className="px-4 pt-4 pb-3 relative">
        {/* Team logo */}
        <div className="flex items-start">
          <motion.div 
            className="w-16 h-16 rounded-lg overflow-hidden shadow-lg -mt-12 mr-3 flex-shrink-0"
            whileHover={{ scale: 1.05 }}
           
          >
            {team.logo ? (
              <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${team.logo}`} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-dark">
                <span className="text-xl font-bold" >{name.charAt(0).toUpperCase()}</span>
              </div>
            )}
          </motion.div>

          {/* Team name and badges */}
          <div className="flex-1">
            <h3 className="text-lg font-custom tracking-widest text-white leading-tight truncate">{name}bb</h3>
            
            {/* Tier and division badges */}
            <div className="flex items-center mt-1.5 gap-2">
              <div 
                className={`flex items-center px-2  rounded text-xs ${divisionData.border}`}
                style={{ 
                  background: divisionData.gradient,
                  color: divisionData.color
                }}
              >
                <img className="w-10 h-10" src="https://curry.gg/uploads/703/64q9D5Bw2mASHeqoTlvoglqW7P7p1G-metaR29sZCAzLnBuZw==-.png" />

                <span className="ml-1 font-medium">{division ? division.toUpperCase() : 'UNRANKED'}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* User info and details */}
        <div className="mt-3 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="30" viewBox="0 0 26 30" fill="none" class="svg replaced-svg">
<path d="M12.1387 4.11158C12.8226 3.71671 13.6653 3.71671 14.3492 4.11158L22.9412 9.07218C23.6251 9.46705 24.0465 10.1968 24.0465 10.9866V20.9077C24.0465 21.6975 23.6251 22.4272 22.9412 22.8221L14.3492 27.7827C13.6653 28.1776 12.8226 28.1776 12.1387 27.7827L3.54667 22.8221C2.86273 22.4272 2.44141 21.6975 2.44141 20.9077V10.9865C2.44141 10.1968 2.86273 9.46705 3.54667 9.07218L12.1387 4.11158Z" fill="#0C1E2D" class="color"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M21.4415 10.5388L13.8283 6.14339C13.4666 5.93452 13.0209 5.93452 12.6591 6.14339L5.04596 10.5388C4.6842 10.7477 4.46135 11.1337 4.46135 11.5514V20.3424C4.46135 20.7601 4.6842 21.1461 5.04596 21.3549L12.6591 25.7504C13.0209 25.9592 13.4666 25.9592 13.8283 25.7504L21.4415 21.3549C21.8033 21.1461 22.0261 20.7601 22.0261 20.3424V11.5514C22.0261 11.1337 21.8033 10.7477 21.4415 10.5388ZM14.2231 5.45968C13.6171 5.10979 12.8704 5.10979 12.2644 5.45968L4.65122 9.85514C4.0452 10.205 3.67188 10.8516 3.67188 11.5514V20.3424C3.67188 21.0421 4.0452 21.6887 4.65122 22.0386L12.2644 26.4341C12.8704 26.784 13.6171 26.784 14.2231 26.4341L21.8362 22.0386C22.4423 21.6887 22.8156 21.0421 22.8156 20.3424V11.5514C22.8156 10.8516 22.4423 10.205 21.8362 9.85514L14.2231 5.45968Z" fill="url(#paint0_linear_3418_418236)"></path>
<path d="M17.2897 7.45176C14.7538 3.6203 9.63499 2.39403 5.61827 4.74031C1.45779 7.17057 0.0551616 12.5134 2.48543 16.6739C4.91569 20.8344 10.2586 22.237 14.419 19.8068C18.1673 17.6173 19.6771 13.0638 18.1624 9.14069C18.2067 9.12742 18.2506 9.11081 18.2937 9.09075L24.1923 6.34796C24.6767 6.12272 24.8868 5.54745 24.6615 5.06305C24.4363 4.57866 23.861 4.36857 23.3766 4.59381L17.4781 7.33661C17.4096 7.36842 17.3467 7.40722 17.2897 7.45176Z" fill="url(#paint1_linear_3418_418236)"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.13623 3.91329C9.34255 1.45625 14.6372 2.52922 17.5862 6.23055L22.9739 3.72532C23.938 3.27699 25.0831 3.69516 25.5315 4.65934C25.9798 5.62352 25.5616 6.76859 24.5974 7.21693L19.3447 9.65939C20.5087 13.8011 18.7917 18.3631 14.9035 20.6343C10.2861 23.3314 4.35649 21.7748 1.65935 17.1574C-1.0378 12.54 0.518853 6.61043 5.13623 3.91329ZM18.2949 9.09099L24.1935 6.3482C24.6779 6.12296 24.888 5.54769 24.6627 5.06329C24.4375 4.5789 23.8622 4.36882 23.3778 4.59405L17.4792 7.33685C17.4579 7.34677 17.4371 7.35737 17.4168 7.36861C17.3721 7.39342 17.3301 7.42135 17.2909 7.452C17.1126 7.1827 16.9216 6.92628 16.7191 6.68305C14.0408 3.46581 9.35385 2.55918 5.61945 4.74055C1.45897 7.17082 0.0563425 12.5137 2.48661 16.6742C4.91687 20.8347 10.2597 22.2373 14.4202 19.807C17.8813 17.7853 19.4338 13.748 18.4589 10.0525C18.378 9.74583 18.2797 9.44153 18.1636 9.14093C18.2079 9.12766 18.2518 9.11105 18.2949 9.09099Z" fill="#0C1E2D" class="color"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.15857 3.95256C9.75392 1.26828 15.6552 2.81751 18.3395 7.41285C21.0238 12.0082 19.4746 17.9095 14.8792 20.5938C10.2839 23.2781 4.38256 21.7288 1.69828 17.1335C-0.986002 12.5381 0.563225 6.63684 5.15857 3.95256ZM17.3756 7.97591C15.0023 3.91291 9.78462 2.54316 5.72162 4.91647C1.65863 7.28979 0.288878 12.5074 2.66219 16.5704C5.03551 20.6334 10.2532 22.0032 14.3162 19.6299C18.3791 17.2566 19.7489 12.0389 17.3756 7.97591Z" fill="#0C1E2D" class="color"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.59798 4.70728C9.77677 2.26632 15.1431 3.67511 17.5841 7.85391C20.0251 12.0327 18.6163 17.3991 14.4375 19.84C10.2587 22.281 4.89231 20.8722 2.45135 16.6934C0.0103941 12.5146 1.41919 7.14823 5.59798 4.70728ZM17.0292 8.17804C14.7673 4.30571 9.79444 3.00023 5.92211 5.26218C2.04978 7.52412 0.744307 12.4969 3.00625 16.3693C5.26819 20.2416 10.241 21.5471 14.1133 19.2851C17.9857 17.0232 19.2911 12.0504 17.0292 8.17804Z" fill="url(#paint2_linear_3418_418236)"></path>
<path fill-rule="evenodd" clip-rule="evenodd" d="M5.89889 5.21854C9.79518 2.9426 14.7988 4.25616 17.0747 8.15245C19.3506 12.0487 18.0371 17.0523 14.1408 19.3283C10.2445 21.6042 5.24092 20.2906 2.96498 16.3944C0.689043 12.4981 2.0026 7.49448 5.89889 5.21854ZM16.2471 8.63586C14.2382 5.19663 9.82154 4.03716 6.3823 6.04612C2.94307 8.05508 1.7836 12.4717 3.79256 15.9109C5.80152 19.3502 10.2182 20.5096 13.6574 18.5007C17.0966 16.4917 18.2561 12.0751 16.2471 8.63586Z" fill="#0C1E2D" class="color"></path>
<path d="M9.7979 11.6846C13.4591 11.6846 13.4591 16.2611 13.4591 16.2611C13.4591 16.2611 11.6285 16.2611 9.7979 16.2611C7.96731 16.2611 6.13672 16.2611 6.13672 16.2611C6.13672 16.2611 6.13672 11.6846 9.7979 11.6846Z" fill="#0C1E2D" class="color"></path>
<circle r="2.08134" transform="matrix(-1 0 0 1 9.8796 9.81864)" fill="#0C1E2D" class="color"></circle>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.88423 19.4671C9.11045 19.154 9.32161 18.9433 9.6575 18.6612L9.97536 18.4303L10.3133 18.2197L11.2818 17.8794C11.5052 17.8282 11.9064 17.7619 12.1963 17.725C12.6093 17.6724 12.8654 17.6187 12.9843 17.5824C13.002 17.5742 13.0271 17.5622 13.0591 17.5466C13.1337 17.5101 13.2349 17.4587 13.3482 17.3978C13.5833 17.2715 13.8325 17.1247 14.0051 16.9987C14.2264 16.837 14.4817 16.6036 14.7009 16.3805C14.8079 16.2716 14.8983 16.1733 14.9636 16.0982C14.9992 16.0573 15.0196 16.032 15.0292 16.0201C15.038 16.0039 15.049 15.9835 15.0618 15.9595C15.0912 15.9046 15.1269 15.8369 15.1619 15.7699C15.197 15.7027 15.2298 15.6391 15.2536 15.5922C15.2616 15.5763 15.2679 15.5638 15.2724 15.5547C15.2792 15.5389 15.2852 15.5258 15.2887 15.5184C15.2964 15.5018 15.3043 15.4857 15.3103 15.4735C15.3231 15.4477 15.3389 15.4167 15.3553 15.3846C15.3888 15.3195 15.432 15.2366 15.4754 15.1543C15.5446 15.023 15.661 14.8027 15.7099 14.726L15.7105 14.725L15.7131 14.7208L15.7236 14.7036C15.732 14.6897 15.7406 14.6751 15.7471 14.664C15.8858 14.4256 16.1429 14.0988 16.3386 13.9037C16.6826 13.5606 17.2453 13.2058 17.7042 13.0207C18.4609 12.7155 19.2035 12.6624 19.993 12.8624C20.7236 13.0476 21.3001 13.4514 21.8287 14.0356C21.8659 14.0768 21.9958 14.2252 22.1053 14.3505C22.1625 14.416 22.2178 14.4794 22.2587 14.5263L22.3262 14.6037L22.3265 14.6041L22.3281 14.6059C22.6965 15.0306 22.859 15.2177 23.3739 15.8106L23.7526 16.2467C23.8219 16.3266 23.9518 16.4758 24.0409 16.5779C24.1318 16.682 24.3379 16.9194 24.4993 17.1058C24.6605 17.292 24.8448 17.5041 24.9088 17.5771C25.314 18.0395 25.5963 18.5216 25.7459 19.0954C25.8887 19.6431 25.8883 20.2391 25.7377 20.7846C25.5793 21.3585 25.3068 21.8782 24.9011 22.3014C24.7098 22.5009 24.3406 22.7817 24.1021 22.9165C23.6603 23.1664 23.168 23.3451 22.6794 23.4074C22.2937 23.4566 21.9619 23.4405 21.554 23.3746C21.1756 23.3134 21.0838 23.2889 20.3911 23.0952C19.5925 22.8719 19.3817 22.8419 19.0872 22.8357C18.8353 22.8303 18.6814 22.8586 18.5288 22.9132C18.3693 22.9703 18.2434 23.0636 18.1231 23.2504L18.1228 23.2508C18.1213 23.2534 18.1145 23.2644 18.1025 23.2858C18.0889 23.31 18.0731 23.3394 18.057 23.3703C18.0408 23.4013 18.0261 23.4307 18.0144 23.4549C18.0057 23.473 18.0012 23.4832 17.9996 23.4866L17.9993 23.4877C17.9973 23.4931 17.9913 23.5097 17.981 23.5405C17.9701 23.5731 17.9575 23.6119 17.9447 23.653L17.9382 23.674C17.9232 23.7227 17.9092 23.7699 17.8981 23.8089C17.8888 23.8417 17.8843 23.8595 17.8829 23.8649C17.8824 23.8667 17.8823 23.8671 17.8825 23.8662C17.8355 24.0808 17.7954 24.4133 17.7794 24.8181C17.7485 25.5973 17.7029 26.1078 17.5877 26.555C17.3968 27.296 17.0044 27.909 16.4266 28.4287C16.2219 28.6128 15.8291 28.8795 15.5775 28.9976C14.9401 29.2969 14.2272 29.3758 13.5265 29.2621C12.756 29.1372 12.0742 28.7417 11.5623 28.1517C11.3277 27.8812 11.2323 27.718 10.7897 26.9606L10.7757 26.9367C10.6695 26.755 10.5411 26.5357 10.4906 26.4495C10.2851 26.0988 10.0062 25.622 9.82334 25.3089C9.71795 25.1284 9.55783 24.8558 9.4683 24.7045C9.42884 24.6378 9.349 24.5021 9.26677 24.3621L9.01678 23.9357L8.33259 22.5181C8.18366 22.0136 8.16416 21.5403 8.24653 21.0136L8.36328 20.4961C8.49047 20.1028 8.6427 19.8013 8.88423 19.4671ZM12.961 17.5928L12.9647 17.5912L12.9614 17.5927L12.9596 17.5935L12.961 17.5928Z" fill="#0C1E2D" class="color"></path>
<path d="M9.71723 20.0693C9.87886 19.8457 10.0241 19.6957 10.3185 19.4484C10.3946 19.3846 10.7072 19.1732 10.7853 19.1329C10.9609 19.0421 11.2571 18.9395 11.5115 18.8813C11.6904 18.8403 12.0556 18.7791 12.3264 18.7446C12.7805 18.6868 13.1283 18.6193 13.3376 18.5484L13.3459 18.5456C13.421 18.5201 14.1527 18.1638 14.6114 17.8288C15.1794 17.4139 15.8078 16.7228 15.8994 16.5696C15.9472 16.4896 16.2091 15.9879 16.2155 15.9639C16.2222 15.939 16.5396 15.3364 16.5762 15.2793C16.5892 15.2589 16.6159 15.2147 16.6355 15.1811C16.7254 15.0266 16.9258 14.7697 17.0643 14.6317C17.2985 14.3981 17.7403 14.1145 18.0888 13.974C18.646 13.7492 19.1658 13.713 19.741 13.8588C20.2271 13.982 20.6369 14.2497 21.0672 14.7253C21.1263 14.7906 21.5525 15.2796 21.5525 15.2796C21.9211 15.7045 22.0836 15.8917 22.5986 16.4847L22.9771 16.9206C23.0472 17.0014 23.1778 17.1513 23.2673 17.2539C23.3568 17.3564 23.5619 17.5926 23.7231 17.7788C23.8843 17.9649 24.0703 18.179 24.1365 18.2546C24.4586 18.6221 24.6506 18.9654 24.7522 19.3551C24.8507 19.7328 24.8491 20.145 24.7479 20.5117C24.6277 20.9469 24.4308 21.3085 24.1599 21.5909C24.0438 21.712 23.7559 21.9329 23.5968 22.0228C23.2512 22.2183 22.8855 22.3461 22.5499 22.3889C22.2837 22.4229 22.0535 22.4151 21.7183 22.3609C21.4014 22.3097 21.3574 22.2991 20.6681 22.1064C19.8507 21.8778 19.538 21.8182 19.1093 21.8091C18.7525 21.8016 18.4712 21.8433 18.1829 21.9465C17.7972 22.0847 17.4948 22.3297 17.2597 22.6947C17.2005 22.7866 17.087 23.0045 17.0477 23.1018C17.006 23.2047 16.9036 23.5365 16.8795 23.6466C16.8151 23.9404 16.7707 24.3377 16.7533 24.7779C16.7226 25.5518 16.6789 25.9667 16.5933 26.2992C16.4573 26.8268 16.1817 27.2681 15.74 27.6654C15.6033 27.7884 15.2937 27.9967 15.1413 28.0682C14.7106 28.2705 14.21 28.3327 13.6912 28.2486C13.1707 28.1642 12.7014 27.8972 12.3387 27.479C12.178 27.2937 12.1342 27.225 11.663 26.4188C11.5567 26.237 11.4281 26.0173 11.3773 25.9306C11.1721 25.5803 10.8934 25.1041 10.7109 24.7915C10.6047 24.6095 10.4435 24.3353 10.3528 24.1819C10.2621 24.0286 10.1452 23.8298 10.093 23.7402C10.0407 23.6506 9.95496 23.5042 9.90235 23.4149C9.52692 22.7775 9.41084 22.5416 9.31826 22.2279C9.21721 21.8855 9.2002 21.5673 9.26188 21.1729C9.29205 20.98 9.30269 20.9316 9.34113 20.8127C9.43566 20.5204 9.53934 20.3155 9.71723 20.0693Z" fill="url(#paint3_linear_3418_418236)"></path>
<path d="M14.9712 18.6069C16.4476 17.5423 16.321 16.3107 17.6813 14.7586C16.3619 15.5761 16.1263 17.2663 14.7487 18.3101C13.3437 19.3747 11.5173 18.8449 10.725 19.9716C12.0839 19.2055 13.5737 19.6145 14.9712 18.6069Z" fill="#0C1E2D" class="color"></path>
<path d="M11.8737 21.2364C11.6528 21.3951 11.5991 21.6985 11.754 21.9141L12.2078 22.5461L11.5601 23.0113C11.3391 23.17 11.2855 23.4734 11.4403 23.689C11.5952 23.9046 11.8998 23.9507 12.1208 23.792L12.7685 23.3267L13.2224 23.9587C13.3772 24.1743 13.6819 24.2204 13.9028 24.0617C14.1238 23.903 14.1774 23.5996 14.0226 23.384L13.5687 22.752L14.2165 22.2868C14.4374 22.1281 14.491 21.8247 14.3362 21.6091C14.1814 21.3936 13.8767 21.3475 13.6558 21.5062L13.008 21.9714L12.5541 21.3394C12.3993 21.1239 12.0947 21.0777 11.8737 21.2364Z" fill="#0C1E2D" class="color" stroke="#0C1E2D" stroke-width="0.784817"></path>
<path d="M20.9465 21.774C20.9465 21.774 21.45 21.8306 21.6736 21.8021C21.9555 21.7662 22.2626 21.6588 22.5529 21.4947C22.6865 21.4191 22.9283 21.2336 23.0259 21.1319C23.2533 20.8947 23.4188 20.591 23.5197 20.2255C23.6047 19.9175 23.606 19.5713 23.5233 19.2541C23.438 18.9268 22.9285 18.0474 22.4233 17.3552C22.0452 16.8372 20.8094 15.1914 20.8094 15.1914L21.4849 15.9833C21.7945 16.3401 21.931 16.4974 22.3635 16.9954L22.5234 17.1796L22.6814 17.3615C22.7403 17.4294 22.85 17.5553 22.9251 17.6415C23.0003 17.7276 23.1726 17.926 23.308 18.0823C23.4433 18.2386 23.5996 18.4185 23.6552 18.482C23.9257 18.7907 24.087 19.079 24.1723 19.4063C24.255 19.7235 24.2537 20.0697 24.1687 20.3777C24.0677 20.7432 23.9023 21.0469 23.6749 21.2841C23.5773 21.3858 23.3355 21.5713 23.2019 21.6468C22.9116 21.811 22.6045 21.9184 22.3226 21.9543C22.099 21.9828 21.9057 21.9763 21.6241 21.9308C21.3935 21.8935 20.9465 21.774 20.9465 21.774Z" fill="#0C1E2D" class="color"></path>
<path d="M16.1199 25.2193C16.1199 25.2193 15.9995 25.7115 15.8956 25.9116C15.7647 26.1638 15.558 26.415 15.3038 26.6309C15.1869 26.7303 14.9294 26.8933 14.8003 26.9498C14.4992 27.0815 14.1571 27.1321 13.7792 27.1008C13.4608 27.0744 13.1353 26.9563 12.8661 26.7693C12.5883 26.5764 11.9385 25.795 11.4629 25.082C11.107 24.5486 9.98824 22.8211 9.98824 22.8211L10.4986 23.7282C10.7269 24.1418 10.8274 24.3242 11.1458 24.9019L11.2635 25.1155L11.3799 25.3266C11.4232 25.4052 11.5036 25.5516 11.5586 25.6518C11.6135 25.7521 11.7403 25.9822 11.8404 26.1632C11.9405 26.3441 12.0554 26.5528 12.0958 26.6269C12.2924 26.9872 12.5074 27.238 12.7852 27.431C13.0544 27.618 13.3799 27.7361 13.6983 27.7625C14.0762 27.7938 14.4183 27.7432 14.7194 27.6115C14.8485 27.555 15.106 27.3919 15.2229 27.2926C15.4771 27.0767 15.6838 26.8254 15.8147 26.5732C15.9186 26.3732 15.9791 26.1895 16.0335 25.9095C16.078 25.6801 16.1199 25.2193 16.1199 25.2193Z" fill="#0C1E2D" class="color"></path>
<circle cx="18.3958" cy="18.8179" r="0.392408" transform="rotate(-125.686 18.3958 18.8179)" fill="#0C1E2D" class="color" stroke="#0C1E2D" stroke-width="0.693804"></circle>
<circle cx="20.2122" cy="19.1186" r="0.392408" transform="rotate(-125.686 20.2122 19.1186)" fill="#0C1E2D" class="color" stroke="#0C1E2D" stroke-width="0.693804"></circle>
<circle cx="20.513" cy="17.2964" r="0.392408" transform="rotate(-125.686 20.513 17.2964)" fill="#0C1E2D" class="color" stroke="#0C1E2D" stroke-width="0.693804"></circle>
<circle cx="18.6926" cy="16.9985" r="0.392408" transform="rotate(-125.686 18.6926 16.9985)" fill="#0C1E2D" class="color" stroke="#0C1E2D" stroke-width="0.693804"></circle>
<defs>
<linearGradient id="paint0_linear_3418_418236" x1="13.2437" y1="3.86794" x2="13.2437" y2="21.8679" gradientUnits="userSpaceOnUse">
<stop stop-color="white"></stop>
<stop offset="1" stop-color="#9BA2BC"></stop>
</linearGradient>
<linearGradient id="paint1_linear_3418_418236" x1="25.2433" y1="1.97331" x2="5.41169" y2="-1.67916" gradientUnits="userSpaceOnUse">
<stop stop-color="#FEE894"></stop>
<stop offset="1" stop-color="#FFC549"></stop>
</linearGradient>
<linearGradient id="paint2_linear_3418_418236" x1="1.51567" y1="17.24" x2="14.1854" y2="9.83919" gradientUnits="userSpaceOnUse">
<stop stop-color="white"></stop>
<stop offset="1" stop-color="#9BA2BC"></stop>
</linearGradient>
<linearGradient id="paint3_linear_3418_418236" x1="12.0988" y1="16.5873" x2="18.9192" y2="23.2755" gradientUnits="userSpaceOnUse">
<stop stop-color="white"></stop>
<stop offset="1" stop-color="#9BA2BC"></stop>
</linearGradient>
</defs>
</svg>            <span className='px-1'>{total_members} members</span>
          </div>
          {/* <div className="flex items-center">
            <Award className="w-3.5 h-3.5 mr-1" />
            <span>{owner_username}</span>
          </div> */}
        </div>
        
        {/* Stats grid */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          {/* Wins */}
          <div 
            className="angular-cut p-2 text-center"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            <div className="text-primary text-xs font-valorant">WINS</div>
            <div 
              className="text-lg font-bold mt-0.5"
            >
              {wins}
            </div>
          </div>
          
          {/* Matches */}
          <div 
            className="angular-cut p-2 text-center"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            <div className="text-primary text-xs font-valorant">MATCHES</div>
            <div 
              className="text-lg font-bold mt-0.5"
            >
              {matches}
            </div>
          </div>
          
          {/* Points */}
          <div 
            className="angular-cut p-2 text-center"
            style={{ 
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid rgba(255,255,255,0.03)'
            }}
          >
            <div className="text-primary text-xs font-valorant">POINTS</div>
            <div 
              className="text-lg font-bold mt-0.5"
            >
              {
win_rate
.toLocaleString()}
            </div>
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