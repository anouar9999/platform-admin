'use client';
import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  LinkIcon,
  Trophy,
  CalendarDays,
  LayoutGrid,
  BadgeDollarSign,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  Check,
  Image as ImageIcon,
  Gamepad2,
  Upload,
  Users,
  Target,
  ChevronDown,
  Settings,
} from 'lucide-react';
import FloatingLabelInput from '@/app/components/input/input';
import FloatingLabelTextarea from '@/app/components/input/teaxtarea';
import PrizePoolInput from './numberInput';
import ParticipantInput from './participantInput';
import MatchFormatSelector from './MatchFormatSelector';
import ParticipationTypeToggle from './ParticipationTypeToggle';
import BracketTypeSelector from './BracketTypeSelector';
import TeamSizeInput from './TeamInput';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { GlowEffectContext } from '@/context/GlowEffectContext';

const steps = [
  { id: 1, title: 'Nom du Tournoi', icon: Trophy },
  { id: 2, title: 'Image du Tournoi', icon: ImageIcon },
  { id: 3, title: 'Type de Jeu', icon: Gamepad2 },
  { id: 4, title: 'Format et Structure', icon: LayoutGrid },
  { id: 5, title: 'Calendrier', icon: CalendarDays },
  { id: 6, title: 'Prix et Détails', icon: BadgeDollarSign },
  { id: 7, title: 'Type de Bracket', icon: Target },
  { id: 8, title: 'Format Tournoi', icon: LayoutGrid },
  { id: 9, title: 'Stream URL', icon: LinkIcon },
];

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
const createTournament = async (formData) => {
  console.log('=== INCOMING FORM DATA ===');
  
  const formDataToSend = new FormData();

  // Field mapping from frontend to backend
  const fieldMapping = {
    name: 'nom_des_qualifications',
    description: 'description_des_qualifications',
  };

  Object.entries(formData).forEach(([key, value]) => {
    if (value instanceof File) {
      console.log(`Processing: ${key} = [File: ${value.name}, Size: ${value.size} bytes]`);
    } else if (value instanceof Date) {
      console.log(`Processing: ${key} = [Date: ${value.toISOString()}]`);
    } else {
      console.log(`Processing: ${key} = ${value}`);
    }
    
    if (value !== null && value !== '') {
      // Use mapped field name for backend
      const backendKey = fieldMapping[key] || key;
      
      if (
        key === 'start_date' ||
        key === 'end_date' ||
        key === 'registration_start' ||
        key === 'registration_end'
      ) {
        formDataToSend.append(backendKey, value ? value.toISOString() : '');
      } else {
        formDataToSend.append(backendKey, value);
      }
    }
  });

  // Debug: Show what's actually being sent
  console.log('=== FORM DATA BEING SENT ===');
  for (let [key, value] of formDataToSend.entries()) {
    if (value instanceof File) {
      console.log(`${key}: [File: ${value.name}]`);
    } else {
      console.log(`${key}: ${value}`);
    }
  }

  const apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const response = await fetch(`${apiUrl}/api/new_tournament.php`, {
    method: 'POST',
    credentials: 'include',
    mode: 'cors',
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

  return response.json();
};

const TournamentCreationSteps = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setshowGlow } = useContext(GlowEffectContext);

  const [tournamentDateRange, setTournamentDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [registrationDateRange, setRegistrationDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const router = useRouter();

const {
  control,
  handleSubmit,
  watch,
  setValue,
  formState: { errors, isValid },
  trigger,
  getValues,
} = useForm({
  mode: 'onChange',
  defaultValues: {
    name: '', // ✅ Use 'name' instead of 'nom_des_qualifications'
    image: null,
    competition_type: '',
    match_format: '',
    type_de_jeu: '',
    participation_type: 'individual',
    nombre_maximum: '',
    bracket_type: '',
    start_date: null,
    end_date: null,
    registration_start: null,
    registration_end: null,
    description: '', // ✅ Use 'description' instead of 'description_des_qualifications'
    prize_pool: '',
    rules: '',
    stream_url: '',
  },
});

  const watchedFields = watch();
  const selectedGame = watchedFields.competition_type;
  const participationType = watchedFields.participation_type;
  
  const mutation = useMutation({
    mutationFn: createTournament,
    onSuccess: (data) => {
      setshowGlow(true);
      router.push('/admin/tournaments');
    },
    onError: (error) => {
      console.error('Submission error:', error);
      alert(error.message || 'Erreur lors de la création du tournoi');
    },
  });
  
  const nextStep = async (e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }

  const fieldsToValidate = getFieldsForStep(currentStep);
  const isStepValid = await trigger(fieldsToValidate);

  // Log current values for debugging
  const currentValues = getValues();
  console.log('Current step values:', currentValues);

  if (isStepValid && currentStep < steps.length) {
    setCurrentStep(currentStep + 1);
  }
};
  
  useEffect(() => {
    if (watchedFields.start_date || watchedFields.end_date) {
      setTournamentDateRange({
        startDate: watchedFields.start_date,
        endDate: watchedFields.end_date,
      });
    }
  }, [watchedFields.start_date, watchedFields.end_date]);

  useEffect(() => {
    if (watchedFields.registration_start || watchedFields.registration_end) {
      setRegistrationDateRange({
        startDate: watchedFields.registration_start,
        endDate: watchedFields.registration_end,
      });
    }
  }, [watchedFields.registration_start, watchedFields.registration_end]);

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
 const getFieldsForStep = (step) => {
  switch (step) {
    case 1:
      return ['nom_des_qualifications']; // ✅ Changed from 'name'
    case 2:
      return ['image'];
    case 3:
      return ['competition_type'];
    case 4:
      return ['rules'];
    case 5:
      return ['start_date', 'registration_start'];
    case 6:
      return ['prize_pool'];
    case 7:
      return ['bracket_type'];
    case 8:
      return ['match_format', 'type_de_jeu', 'nombre_maximum'];
    case 9:
      return ['stream_url'];
    default:
      return [];
  }
};
  
  const mockGames = [
    {
      id: 1,
      name: 'League of Legends',
      backgroundImage:
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 2,
      name: 'Counter-Strike 2',
      backgroundImage:
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 3,
      name: 'Valorant',
      backgroundImage:
        'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 4,
      name: 'Rocket League',
      backgroundImage:
        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 5,
      name: 'Fortnite',
      backgroundImage:
        'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 6,
      name: 'FIFA 24',
      backgroundImage:
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 7,
      name: 'Call of Duty',
      backgroundImage:
        'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
    {
      id: 8,
      name: 'Apex Legends',
      backgroundImage:
        'https://images.unsplash.com/photo-1556075798-4825dfaaf498?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
    },
  ];
  
const onSubmit = async (data) => {
  console.log('=== FORM SUBMISSION STARTED ===');
  console.log('=== ALL FORM DATA ===');
  
  // Log all fields
  Object.keys(data).forEach(key => {
    const value = data[key];
    if (value instanceof File) {
      console.log(`${key}: [File: ${value.name}]`);
    } else if (value instanceof Date) {
      console.log(`${key}: [Date: ${value.toISOString()}]`);
    } else {
      console.log(`${key}: ${value}`);
    }
  });
  
  // ✅ FIX: Match the actual form field names
  const requiredValidation = {
    name: 'Nom du tournoi', // ✅ Changed to match form field
    start_date: 'Date de début',
    rules: 'Règles',
    competition_type: 'Type de jeu',
    nombre_maximum: 'Nombre de participants'
  };
  
  const missing = [];
  Object.entries(requiredValidation).forEach(([field, label]) => {
    if (!data[field] || data[field] === '') {
      missing.push(label);
      console.error(`❌ Missing: ${field}`);
    } else {
      const value = data[field] instanceof File 
        ? `[File: ${data[field].name}]` 
        : data[field] instanceof Date
        ? data[field].toISOString()
        : data[field];
      console.log(`✅ Present: ${field} = ${value}`);
    }
  });
  
  if (missing.length > 0) {
    alert(`Champs requis manquants: ${missing.join(', ')}`);
    return;
  }

  mutation.mutate(data);
};

  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.warn('Invalid date value:', dateValue);
      return '';
    }
  };
  
  const parseDateFromInput = (inputValue) => {
    if (!inputValue) return null;
    try {
      const date = new Date(inputValue);
      if (isNaN(date.getTime())) return null;
      return date;
    } catch (error) {
      console.warn('Invalid input date:', inputValue);
      return null;
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 1:
  return (
    <div className="space-y-8">
      <div className="* space-x-3 mb-16">
        <h3 className="text-3xl text-white font-custom tracking-wider">
          Let s start with Basic Information
        </h3>
        <p className="text-gray-400 text-sm">
          Choisissez un nom accrocheur pour votre tournoi
        </p>
      </div>

      <Controller
  name="name" // ✅ Changed from "nom_des_qualifications"
        control={control}
        rules={{
          required: 'Le nom du tournoi est requis',
          minLength: { value: 3, message: 'Le nom doit contenir au moins 3 caractères' },
        }}
        render={({ field }) => (
          <div>
            <FloatingLabelInput
              {...field}
              type="text"
              label="Nom du Tournoi"
              className={`w-full bg-gray-800 text-white rounded-xl px-6 py-4 text-lg
                  focus:outline-none focus:ring-2 transition-all duration-300
                  ${
                    errors.nom_des_qualifications // ✅ Changed from errors.name
                      ? 'focus:ring-red-500 border border-red-500'
                      : 'focus:ring-blue-500'
                  }`}
              placeholder="Entrez le nom de votre tournoi"
            />
            {errors.nom_des_qualifications && ( // ✅ Changed from errors.name
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.nom_des_qualifications.message} {/* ✅ Changed */}
              </p>
            )}
           
          </div>
        )}
      />
    </div>
  );
case 2:
  return (
    <div className="space-y-6">
      <div className="space-x-3 mb-16">
        <h3 className="text-3xl text-white font-custom tracking-wider">
          Tournament Image
        </h3>
        <p className="text-gray-400 text-sm">
          Ajoutez une image pour votre tournoi
        </p>
      </div>

      <Controller
        name="image"
        control={control}
        rules={{ required: 'Une image est requise pour le tournoi' }}
        render={({ field: { onChange, value, ...field } }) => (
          <div className="space-y-4">
            <div className="relative font-ea-football">
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-12 text-center bg-gray-800/50 hover:border-gray-500 hover:bg-gray-800/70 transition-all duration-200 cursor-pointer relative">
                  <input
                    {...field}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert("L'image ne doit pas dépasser 5MB");
                          return;
                        }

                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result);
                        reader.readAsDataURL(file);

                        onChange(file);
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />

                  <div className="space-y-4">
                    {!value && (
                      <div className="mx-auto w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center border border-gray-600">
                        <Upload className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    {imagePreview && (
                      <div className="flex justify-center">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="h-32 w-fit object-cover rounded-xl border-2 border-gray-700"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-white text-base mb-1 ">
                        <span className="text-[#03C7FD] font-medium underline cursor-pointer">
                          Click to upload
                        </span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-gray-400 text-sm">
                        Upload images (MAX. file size 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {errors.image && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.image.message}
                </p>
              )}
              
            
            </div>
          </div>
        )}
      />
    </div>
  );
    
      case 3:
        return (
          <>
            <div className="space-y-4">
              <div className="space-x-3 mb-16">
                <h3 className="text-3xl text-white font-custom tracking-wider">
                  Choose Game Type
                </h3>
                <p className="text-gray-400 text-sm">
                  Sélectionnez le jeu pour votre tournoi
                </p>
              </div>

              <Controller
                name="competition_type"
                control={control}
                rules={{ required: 'Veuillez sélectionner un type de jeu' }}
                render={({ field }) => (
                  <div className="space-y-4">
                    {!field.value ? (
                      <div className="grid grid-cols-4 gap-4">
                        {mockGames.map((game, index) => (
                          <div
                            key={game.id}
                            onClick={() => {
                              setTimeout(() => {
                                field.onChange(game.name);
                              }, 300);
                            }}
                            className={`relative p-4 h-28 rounded-lg  cursor-pointer transition-all duration-500 overflow-hidden transform hover:scale-105 border-gray-700 hover:border-gray-600 opacity-100 hover:opacity-90`}
                            style={{
                              backgroundImage: `url(${game.backgroundImage})`,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              transitionDelay: `${index * 50}ms`,
                            }}
                          >
                            <div className="absolute inset-0 bg-black/60 hover:bg-black/50 transition-all duration-300"></div>
                            <div className="relative z-10 text-center">
                              <h3 className="font-medium text-sm text-gray-100">{game.name}</h3>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center animate-fade-in font-ea-football">
                        {(() => {
                          const selectedGame = mockGames.find((game) => game.name === field.value);
                          return selectedGame ? (
                            <>
                              <div
                                className="relative w-80 h-48 rounded-lg overflow-hidden shadow-2xl"
                                style={{
                                  backgroundImage: `url(${selectedGame.backgroundImage})`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              >
                                <div
                                  onClick={() => field.onChange('')}
                                  className="absolute inset-0 flex items-center justify-center"
                                ></div>
                              </div>

                              <div className=" mt-2 text-center">
                                <p className="text-xs text-gray-400 font-pilot capitalize">
                                  The game you selected:
                                </p>
                                <h2 className="text-4xl text-[#03C7FD] font-bold mb-2">
                                  {selectedGame.name}
                                </h2>
                              </div>
                            </>
                          ) : null;
                        })()}
                      </div>
                    )}

                    {errors.competition_type && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.competition_type.message}
                      </p>
                    )}
                   
                  </div>
                )}
              />
            </div>

            <style jsx>{`
              @keyframes fade-in {
                from {
                  opacity: 0;
                  transform: translateY(20px) scale(0.95);
                }
                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              .animate-fade-in {
                animation: fade-in 0.6s ease-out forwards;
              }
            `}</style>
          </>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="space-x-3 mb-16">
              <h3 className="text-3xl text-white font-custom tracking-wider">
                Tournament Rules
              </h3>
              <p className="text-gray-400 text-sm">
                Définissez les règles de votre tournoi
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Controller
                name="rules"
                control={control}
                rules={{ required: 'Règles du tournoi requises' }}
                render={({ field }) => (
                  <div>
                    <FloatingLabelTextarea
                      label={'Regles du Tournoi'}
                      {...field}
                      className={`w-full bg-gray-800 text-white rounded-xl px-4 py-3
                          focus:outline-none focus:ring-2 transition-all duration-300
                          ${
                            errors.rules
                              ? 'focus:ring-red-500 border border-red-500'
                              : 'focus:ring-blue-500'
                          }`}
                      rows={7}
                      placeholder="Définissez les règles du tournoi..."
                    />
                    {errors.rules && (
                      <p className="text-red-500 text-sm mt-2">{errors.rules.message}</p>
                    )}
                  
                  </div>
                )}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="space-x-3 mb-16">
              <h3 className="text-3xl text-white font-custom tracking-wider">
                Tournament Schedule
              </h3>
              <p className="text-gray-400 text-sm">Définissez les dates de votre tournoi</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Controller
                name="start_date"
                control={control}
                rules={{ required: 'La date de début est requise' }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Date de début du tournoi <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...field}
                      type="datetime-local"
                      value={formatDateForInput(field.value)}
                      onChange={(e) => field.onChange(parseDateFromInput(e.target.value))}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.start_date && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.start_date.message}
                      </p>
                    )}
        
                  </div>
                )}
              />

              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Date de fin du tournoi
                    </label>
                    <input
                      {...field}
                      type="datetime-local"
                      value={formatDateForInput(field.value)}
                      onChange={(e) => field.onChange(parseDateFromInput(e.target.value))}
                      min={formatDateForInput(watchedFields.start_date)}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                )}
              />

              <Controller
                name="registration_start"
                control={control}
                rules={{ required: "La date d'ouverture des inscriptions est requise" }}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Ouverture des inscriptions <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...field}
                      type="datetime-local"
                      value={formatDateForInput(field.value)}
                      onChange={(e) => field.onChange(parseDateFromInput(e.target.value))}
                      max={formatDateForInput(watchedFields.start_date)}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    {errors.registration_start && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.registration_start.message}
                      </p>
                    )}
                  </div>
                )}
              />

              <Controller
                name="registration_end"
                control={control}
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Fermeture des inscriptions
                    </label>
                    <input
                      {...field}
                      type="datetime-local"
                      value={formatDateForInput(field.value)}
                      onChange={(e) => field.onChange(parseDateFromInput(e.target.value))}
                      min={formatDateForInput(watchedFields.registration_start)}
                      max={formatDateForInput(watchedFields.start_date)}
                      className="w-full bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                )}
              />

              {watchedFields.start_date && watchedFields.registration_start && (
                <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Résumé des dates</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Inscriptions:</span>
                      <span className="text-green-400">
                        {formatDate(watchedFields.registration_start)}
                        {watchedFields.registration_end &&
                          ` - ${formatDate(watchedFields.registration_end)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tournoi:</span>
                      <span className="text-blue-400">
                        {formatDate(watchedFields.start_date)}
                        {watchedFields.end_date && ` - ${formatDate(watchedFields.end_date)}`}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-12">
            <div className="text-start space-y-4 mb-12">
              <h3 className="text-3xl text-white font-custom tracking-wider">
                Prize Pool & Tournament Details
              </h3>
              <p className="text-gray-400 text-sm max-w-2xl ">
                Set the stakes and define what makes your tournament special
              </p>
            </div>

            <div className=" rounded-3xl font-ea-football  backdrop-blur-sm">
              <Controller
                name="prize_pool"
                control={control}
                rules={{ required: 'Le montant du prix est requis' }}
                render={({ field }) => (
                  <div>
                    <div className="relative group">
                      <PrizePoolInput
                        {...field}
                        type="text"
                        className={`w-[70%] bg-[#21324F] text-lg text-white rounded-lg px-6 py-2 font-medium
                            focus:outline-none focus:ring-1 focus:ring-primbg-primary focus:bg-gray-800 
                            transition-all duration-300  placeholder:text-sm
                            ${
                              errors.prize_pool
                                ? 'ring-2 ring-red-500 border-red-500'
                                : 'border border-gray-700'
                            }`}
                        placeholder="1000€, Trophy + Cash, Points & Rewards..."
                      />
                    </div>
                    {errors.prize_pool && (
                      <div className=" p-3 rounded-lg">
                        <p className="text-red-400 text-sm flex items-center">
                          {errors.prize_pool.message}
                        </p>
                      </div>
                    )}
             
                  </div>
                )}
              />
            </div>
          </div>
        );

      case 7:
        return (
          <div className="min-h-screen font-ea-football">
            <div className="max-w-6xl space-y-12">
              <div className="space-y-6 relative">
                <div className="absolute inset-0 rounded-lg blur-3xl"></div>
                <div className="relative">
                  <h3 className="text-3xl mb-1 font-custom tracking-wider">
                    Bracket Type Selection
                  </h3>
                  <p className="text-gray-400 font-thin text-md max-w-3xl mx-auto leading-relaxed">
                    Choose how participants will be eliminated and advance through the tournament
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <Controller
                    name="bracket_type"
                    control={control}
                    rules={{ required: 'Type de bracket requis' }}
                    render={({ field }) => (
                      <div className="relative">
                        <BracketTypeSelector {...field} name="bracket_type" />
                        {errors.bracket_type && (
                          <div className="mt-4 flex items-center justify-center text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.bracket_type.message}
                          </div>
                        )}
                      
                      </div>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 8:
        const participationType = watch('participation_type');
        const selectedGameName = watch('competition_type');

        return (
          <div className="min-h-screen font-ea-football">
            <div className="max-w-6xl space-y-12">
              <div className="space-y-6 relative">
                <div className="absolute inset-0 rounded-lg blur-3xl"></div>
                <div className="relative">
                  <h3 className="text-2xl mb-1 font-custom tracking-wider">
                    Tournament Format & Structure
                  </h3>
                  <p className="text-gray-400 font-thin text-md max-w-3xl mx-auto leading-relaxed">
                    Define how participants will compete and tournament structure
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <Controller
                      name="match_format"
                      control={control}
                      rules={{ required: 'Format de match requis' }}
                      render={({ field }) => (
                        <div className="relative">
                          <MatchFormatSelector
                            {...field}
                            game={selectedGameName}
                            name="match_format"
                          />
                          {errors.match_format && (
                            <div className="absolute -bottom-6 left-0 flex items-center text-red-400 text-sm">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.match_format.message}
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      name="type_de_jeu"
                      control={control}
                      rules={{ required: 'Type de jeu requis' }}
                      render={({ field }) => (
                        <div className="relative pb-6">
                          <FloatingLabelInput label="Type de Jeu" {...field} />
                          {errors.type_de_jeu && (
                            <div className="absolute -bottom-6 left-0 flex items-center text-red-400 text-sm">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              {errors.type_de_jeu.message}
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <Controller
                    name="participation_type"
                    control={control}
                    rules={{ required: 'Type de participation requis' }}
                    render={({ field }) => (
                      <div className="relative">
                        <ParticipationTypeToggle
                          {...field}
                          label="Type de Participation"
                          name="participation_type"
                        />
                        {errors.participation_type && (
                          <div className="mt-2 flex items-center text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            {errors.participation_type.message}
                          </div>
                        )}
                      </div>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                  {participationType !== 'team' && (
                    <div>
                      <Controller
                        name="nombre_maximum"
                        control={control}
                        rules={{
                          required: 'Nombre maximum requis',
                          min: { value: 2, message: 'Minimum 2 participants' },
                          max: { value: 1024, message: 'Maximum 1024 participants' },
                        }}
                        render={({ field }) => (
                          <div className="relative">
                            <ParticipantInput
                              {...field}
                              type="number"
                              min="2"
                              max="1024"
                              placeholder="Nombre de joueurs"
                              className={`w-full bg-[#21324F]/80 backdrop-blur-sm text-white border border-[#21324F]/60 
                              rounded-2xl px-4 py-4 transition-all duration-300
                              hover:bg-[#21324F] hover:border-blue-400/50
                              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                              ${errors.nombre_maximum ? 'border-red-500/70' : ''}`}
                            />
                            {errors.nombre_maximum && (
                              <div className="absolute -bottom-6 left-0 flex items-center text-red-400 text-sm">
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.nombre_maximum.message}
                              </div>
                            )}
                          
                          </div>
                        )}
                      />
                    </div>
                  )}
                </div>

                {participationType === 'team' && (
                  <div className="">
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                      <Controller
                        name="nombre_maximum"
                        control={control}
                        rules={{
                          required: "Nombre d'équipes requis",
                          min: { value: 2, message: 'Minimum 2 équipes' },
                          max: { value: 128, message: 'Maximum 128 équipes' },
                        }}
                        render={({ field }) => (
                          <div className="relative">
                            <TeamSizeInput
                              {...field}
                              competitionType={selectedGameName}
                              className={`${errors.nombre_maximum ? 'border-red-500/70' : ''}`}
                            />
                            {errors.nombre_maximum && (
                              <div className="absolute -bottom-6 left-0 text-red-400 text-sm">
                                {errors.nombre_maximum.message}
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      case 9:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <LinkIcon className="w-16 h-16 mx-auto text-blue-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">URL du Stream</h2>
              <p className="text-gray-400">Ajoutez le lien de diffusion (optionnel)</p>
            </div>

            <Controller
              name="stream_url"
              control={control}
              rules={{
                pattern: {
                  value: /^https?:\/\/.+/,
                  message: 'Veuillez entrer une URL valide',
                },
              }}
              render={({ field }) => (
                <div>
                  <label className="block text-sm font-medium mb-2">URL du Stream</label>
                  <div className="relative">
                    <input
                      {...field}
                      type="url"
                      className={`w-full bg-gray-800 text-white rounded-xl px-12 py-4 text-lg
                    focus:outline-none focus:ring-2 transition-all duration-300
                    ${
                      errors.stream_url
                        ? 'focus:ring-red-500 border border-red-500'
                        : 'focus:ring-blue-500'
                    }`}
                      placeholder="https://twitch.tv/channel"
                    />
                    <LinkIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  {errors.stream_url && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.stream_url.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (mutation.isPending) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl">Création du tournoi en cours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  text-white">
      <div className="max-w-4xl mx-auto p-6">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;

              return (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                      ${
                        isActive
                          ? 'border-blue-500 bg-[#03C7FD] text-black'
                          : isCompleted
                          ? 'border-green-500 bg-green-500 text-black'
                          : 'border-gray-600 bg-gray-800 text-gray-400'
                      }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-2 transition-all duration-300
                        ${isCompleted ? 'bg-green-500' : 'bg-gray-700'}`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-gray-400">
              Étape {currentStep} sur {steps.length}
            </p>
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onSubmit)} className=" space-y-8  ">
          <div className=" rounded-2xl flex flex-col justify-center ">{renderStep()}</div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-8 py-3 rounded-lg font-ea-football transition-all duration-300
                  ${
                    currentStep === 1
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed '
                      : 'bg-gray-700 text-white hover:bg-gray-600'
                  }`}
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Precedent
            </button>

            {currentStep < steps.length ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-8 py-3 bg-primary font-ea-football rounded-lg text-black hover:bg-primary/90 transition-all duration-300"
              >
                Suivant
                <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex items-center px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trophy className="w-5 h-5 mr-2" />
                {mutation.isPending ? 'Création...' : 'Créer le Tournoi'}
              </button>
            )}
          </div>
        </form>

       
      </div>
    </div>
  );
};

export default TournamentCreationSteps;