'use client';
import React, { useState } from 'react';
import {
  Calendar,
  LinkIcon,
  Trophy,
  Users,
  CalendarDays,
  Clock,
  Info,
  LayoutGrid,
  BadgeDollarSign,
  ChevronRight,
  AlertCircle,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/utils/ToastProvider';

// Component imports
import FloatingLabelInput from '@/app/components/input/input';
import LoadingOverlay from './Loading';
import CompetitionTypeSelector from './CompetitionType';
import ParticipationTypeToggle from './ParticipationTypeToggle';
import PrizePoolInput from './numberInput';
import ParticipantInput from './participantInput';
import TeamSizeInput from './TeamInput';
import BracketTypeSelector from './BracketTypeSelector';
import MatchFormatSelector from './MatchFormatSelector';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Utilities
import { competitionTypes } from '@/utils/helpers';
import { TbTournament } from "react-icons/tb";
import SectionTitle from './SectionTitle';

// Section Title Component with enhanced UI/UX

const CustomDateInput = ({ value, onClick, label, isRequired, icon: Icon }) => (
  <div className="group">
    <label className="block text-sm font-medium mb-2 group-hover:text-primary transition-colors">
      {label} {isRequired && <span className="text-red-500">*</span>}
    </label>
    <div className="relative overflow-hidden">
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left bg-secondary text-white rounded-xl angular-cut px-6 py-3 
          focus:outline-none focus:ring-2 focus:ring-primary/30 pl-10
          transition-all duration-300 ease-in-out group-hover:shadow-md group-hover:shadow-primary/5"
      >
        {value || 'Sélectionner une date'}
      </button>
      
      {Icon && (
        <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 
          group-hover:text-primary transition-colors duration-300" />
      )}
      
      {/* Subtle highlight effect on hover */}
    </div>
  </div>
);

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const TournamentCreation = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordProtected, setPasswordProtected] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    competition_type: '',
    participation_type: 'participant',
    start_date: '',
    end_date: '',
    registration_start: '',
    registration_end: '',
    status: 'Ouvert aux inscriptions',
    description_des_qualifications: '',
    rules: '',
    nombre_maximum: '',
    prize_pool: '',
    format_des_qualifications: '',
    type_de_match: '',
    type_de_jeu: '',
    match_format: '',
    stream_url: '',
    min_team_size: 5,
    max_team_size: 7,
    password: '',
    image: null,
  });

  

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      const file = files[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          showToast.error("L'image ne doit pas dépasser 5MB");
          return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
          showToast.error("Format d'image non supporté. Utilisez JPG, PNG ou GIF");
          return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);

        setFormData((prev) => ({ ...prev, [name]: file }));
      }
    } else {
      if (name === 'participation_type') {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
          nombre_maximum: '',
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };
  const handleDateChange = (date, fieldName) => {
    handleChange({
      target: {
        name: fieldName,
        value: date ? date.toISOString() : ''
      }
    });
  };
  const validateForm = () => {
    const requiredFields = [
      'nom_des_qualifications',
      'start_date',
      'end_date',
      'image',
      'competition_type',
    ];

    const emptyFields = requiredFields.filter((field) => !formData[field]);
    if (emptyFields.length > 0) {
      showToast('Veuillez remplir tous les champs obligatoires', 'error', 1500);
      return false;
    }

    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
    if (startDate > endDate) {
      showToast('La date de fin doit être après la date de début', 'error', 1500);
      return false;
    }

    if (formData.registration_start && formData.registration_end) {
      const regStart = new Date(formData.registration_start);
      const regEnd = new Date(formData.registration_end);

      if (regStart > regEnd) {
        showToast(
          "La date de fin d'inscription doit être après la date de début d'inscription",
          'error',
          1500,
        );
        return false;
      }

      if (regEnd > startDate) {
        showToast('Les inscriptions doivent se terminer avant le début du tournoi', 'error', 1500);
        return false;
      }
    }

    if (formData.participation_type === 'team' && !formData.nombre_maximum) {
      showToast("Veuillez spécifier le nombre maximum d'équipes", 'error', 1500);
      return false;
    }

    if (formData.participation_type === 'team') {
      if (parseInt(formData.min_team_size) > parseInt(formData.max_team_size)) {
        showToast(
          "La taille minimum d'équipe ne peut pas être supérieure à la taille maximum",
          'error',
          1500,
        );
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsLoading(true);
    const formDataToSend = new FormData();

    try {
      console.log(formData)
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== '') {
          formDataToSend.append(key, value);
        }
      });

      if (!passwordProtected) {
        formDataToSend.delete('password');
      }

      const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      const response = await fetch(`${apiUrl}/api/new_tournament.php`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          throw new Error(errorData.message || 'Erreur lors de la création du tournoi');
        } catch (e) {
          console.error('Server response:', errorText);
          throw new Error('Erreur de serveur inattendue');
        }
      }

      const data = await response.json();

      showToast('Tournoi créé avec succès!', 'success', 1500);
      setTimeout(() => router.push('/admin/tournaments'), 1500);
    } catch (error) {
      console.error('Submission error:', error);
      showToast(error.message || 'Une erreur est survenue', 'error', 1500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-gray-300 min-h-screen p-4">
      {!isLoading ? (
        <div className="mx-auto">
          <div className='flex items-center text-[#d6503247]'> 
          <TbTournament  />
            <p className="  mx-2 font-semibold uppercase tracking-wider"> 
                create tournament</p>

            </div>
               
          <h1 className="text-3xl flex items-center font-custom mb-8 tracking-wider">Creez un tournoi et definissez les preferences.                 
          </h1>
  {/* <p className="text-gray-500 mb-8">Créez un tournoi et définissez les préférences.</p> */}

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Section 1: Tournament Type & Basic Info */}
        
            <div className="rounded-2xl p-6 pt-4 space-y-4  bg-secondary/30 ">
              <SectionTitle
                icon={Info}
                title="Informations de Base"
                description="Les détails essentiels pour identifier votre tournoi"
             />
                <div className="px-8 space-y-4 ">
                {/* Game Type */}
                <CompetitionTypeSelector
                  competitionTypes={competitionTypes}
                  selectedType={formData.competition_type}
                  onChange={handleChange}
                />

                {/* Tournament Image */}
                <div className="space-y-2">
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 object-cover rounded-xl angular-cut"
                    />
                  )}
                  <div className="relative">
                    <label className="block text-sm font-medium mb-2">Image du Tournoi</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="w-full rounded-xl p-3 file:mr-4 file:py-2 file:px-4 
                    file:rounded-full file:border-0 file:text-sm file:bg-primary bg-secondary
                    file:text-gray-300 hover:file:bg-primary/20 cursor-pointer angular-cut"
                    />
                  </div>
                </div>

                {/* Tournament Name */}
                <FloatingLabelInput
                  label="Nom des Qualifications"
                  type="text"
                  value={formData.nom_des_qualifications}
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: 'nom_des_qualifications',
                        value: e.target.value,
                      },
                    })
                  }
                />
              </div>
        
            </div>

            {/* Section 2: Tournament Format & Structure */}
            <div className="rounded-2xl p-6 pt-4 space-y-4  bg-secondary/30 ">
              <SectionTitle
                icon={LayoutGrid}
                title="Format et Structure"
                description="Définissez comment les participants s'affronteront"
              />
{/* Match Format */}
<div className="px-8 grid grid-cols-2 gap-6">
                  <MatchFormatSelector
                    value={formData.match_format}
                    onChange={handleChange}
                    game={formData.competition_type}
                  />

                  <FloatingLabelInput
                    label="Type de Jeu"
                    type="text"
                    value={formData.type_de_jeu}
                    onChange={(e) =>
                      handleChange({
                        target: {
                          name: 'type_de_jeu',
                          value: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              <div className=" space-y-8 ">
                {/* Entry Details (based on participation type) */}
                <div className=" px-8 grid grid-cols-3 gap-6">
                  {/* Participation Type */}
                  <ParticipationTypeToggle
                    value={formData.participation_type}
                    onChange={handleChange}
                    images={{
                      participant: '/images/solo-player.png',
                      team: '/images/team-players.png',
                    }}
                  />
                  {formData.participation_type === 'team' ? (
                    <TeamSizeInput
                      value={formData.nombre_maximum}
                      onChange={handleChange}
                      competitionType={formData.competition_type}
                    />
                  ) : (
                    <ParticipantInput value={formData.nombre_maximum} onChange={handleChange} />
                  )}

                  <BracketTypeSelector
                    value={formData.bracket_type}
                    onChange={handleChange}
                  />
                </div>

                
              </div>
            </div>

            {/* Section 3: Tournament Schedule & Timing */}
            <div className="rounded-2xl p-6 pt-4 space-y-4  bg-secondary/30 ">
  <SectionTitle
    icon={CalendarDays}
    title="Calendrier et Horaires"
    description="Planifiez les dates et la durée du tournoi"
  />
  <div className="px-8 space-y-8">
      {/* Tournament Dates with Visual Calendar */}
      <div className="rounded-xl p-4 bg-secondary/10 ">
        <h3 className="text-primary text-sm font-medium mb-4 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Dates du Tournoi
        </h3>
        
        <div className="grid grid-cols-2 gap-6">
          {/* Start Date */}
          <DatePicker
            selected={formData.start_date ? new Date(formData.start_date) : null}
            onChange={date => handleDateChange(date, 'start_date')}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            customInput={
              <CustomDateInput 
                label="Date de Début" 
                isRequired={true} 
                icon={Calendar}
                value={formatDate(formData.start_date)}
              />
            }
            calendarClassName="bg-dark border border-gray-700 text-white rounded-xl shadow-lg"
            className="bg-dark text-white"
            wrapperClassName="w-full"
            popperClassName="datepicker-popper"
            popperPlacement="bottom-start"
          />
          
          {/* End Date */}
          <DatePicker
            selected={formData.end_date ? new Date(formData.end_date) : null}
            onChange={date => handleDateChange(date, 'end_date')}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            dateFormat="MMMM d, yyyy h:mm aa"
            customInput={
              <CustomDateInput 
                label="Date de Fin" 
                isRequired={true} 
                icon={Calendar}
                value={formatDate(formData.end_date)}
              />
            }
            calendarClassName="bg-dark border border-gray-700 text-white rounded-xl shadow-lg"
            minDate={formData.start_date ? new Date(formData.start_date) : null}
            className="bg-dark text-white"
            wrapperClassName="w-full"
          />
        </div>
      </div>
      
      {/* Registration Period with styled separator */}
      <div className="relative">
        <div className="absolute left-0 right-0 top-0 flex items-center">
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
          <div className="px-3 text-gray-500 text-xs uppercase tracking-wider font-medium bg-gray-900/20 rounded-full backdrop-blur-sm">
            Période d'inscription
          </div>
          <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
        </div>
        
        <div className="pt-8 bg-secondary/30 rounded-xl p-4 shadow-inner mt-4 ">
          <div className="grid grid-cols-2 gap-6">
            {/* Registration Start */}
            <DatePicker
              selected={formData.registration_start ? new Date(formData.registration_start) : null}
              onChange={date => handleDateChange(date, 'registration_start')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={
                <CustomDateInput 
                  label="Début d'Inscription" 
                  icon={Calendar}
                  value={formatDate(formData.registration_start)}
                />
              }
              calendarClassName="bg-dark border border-gray-700 text-white rounded-xl shadow-lg"
              maxDate={formData.start_date ? new Date(formData.start_date) : null}
            />
            
            {/* Registration End */}
            <DatePicker
              selected={formData.registration_end ? new Date(formData.registration_end) : null}
              onChange={date => handleDateChange(date, 'registration_end')}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              customInput={
                <CustomDateInput 
                  label="Fin d'Inscription" 
                  icon={Calendar}
                  value={formatDate(formData.registration_end)}
                />
              }
              calendarClassName="bg-dark border border-gray-700 text-white rounded-xl shadow-lg"
              minDate={formData.registration_start ? new Date(formData.registration_start) : null}
              maxDate={formData.start_date ? new Date(formData.start_date) : null}
            />
          </div>
        </div>
      </div>
    </div>
</div>

            {/* Section 4: Prize & Details */}
            <div className="rounded-2xl p-6 pt-4 space-y-4  bg-secondary/30 ">
              <SectionTitle
                icon={BadgeDollarSign}
                title="Prix et Détails"
                description="Définissez la récompense et les règles du tournoi"
              />
              <div className="px-14 space-y-8 ">
                {/* Prize Pool */}
                <PrizePoolInput value={formData.prize_pool} onChange={handleChange} />

                {/* Tournament Details */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col space-y-2">
                    <label className="block text-sm font-medium">
                      Description des Qualifications
                    </label>
                    <textarea
                      name="description_des_qualifications"
                      value={formData.description_des_qualifications}
                      onChange={handleChange}
                      className="w-full bg-secondary text-white rounded-xl angular-cut px-6 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
                      rows="6"
                      placeholder="Entrez la description du tournoi"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="block text-sm font-medium">Règles du Tournoi</label>
                    <textarea
                      name="rules"
                      value={formData.rules}
                      onChange={handleChange}
                      className="w-full bg-secondary text-white rounded-xl angular-cut px-6 py-3 focus:outline-none focus:ring-2 focus:ring-black/20"
                      rows="6"
                      placeholder="Entrez les règles du tournoi"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Section 5: Additional Settings */}
            <div className="rounded-2xl p-6 pt-4 space-y-4  bg-secondary/30 ">
              <SectionTitle
                icon={LinkIcon}
                title="Paramètres Additionnels"
                description="Options supplémentaires pour votre tournoi"
              />
              <div className="px-8 space-y-8 ">
                <div className="grid grid-cols-1 gap-6">
                  {/* Stream URL */}
                  <div className="relative">
                    <label className="absolute text-[12pt] font-custom text-gray-300 leading-tight tracking-widest -translate-y-7 top-5 left-4 text-xs rounded-md bg-[#181818] px-2 z-10">
                      URL du Stream
                    </label>
                    <div className="flex bg-secondary rounded-xl angular-cut p-2 ">
                      <span className="inline-flex items-center px-3 text-gray-400 bg-secondary rounded-l-lg angular-cut">
                        <LinkIcon size={16} />
                      </span>
                      <input
                        type="url"
                        name="stream_url"
                        value={formData.stream_url}
                        onChange={handleChange}
                        placeholder="https://twitch.tv/channel"
                        className="w-full bg-secondary p-3 rounded-r-lg angular-cut"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Submit Button */}
            <div className="flex justify-end mt-8">
              <button
                type="submit"
                className="group relative overflow-hidden px-4 py-3 angular-cut bg-primary text-white hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/20 font-bold text-md flex items-center gap-3 hover:gap-4"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer transition-opacity" />

                {/* Icon */}
                <ChevronRight className="w-5 h-5 transition-all duration-300 group-hover:translate-x-1" />

                {/* Text content */}
                <span className="tracking-wider transition-all duration-300">CRÉER LE TOURNOI</span>

                {/* Arrow icon */}

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-8 h-8 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-primary/30" />

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-white/30 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </form>
        </div>
      ) : (
        <LoadingOverlay text="Creating tournament" />
      )}
    </div>
  );
};

export default TournamentCreation;
