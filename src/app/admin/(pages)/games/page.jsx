"use client"
import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  Filter,
  ChevronDown,
  Plus,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Gamepad2,
  TrendingUp,
  Users,
  Award,
  Grid3x3,
  List,
  AlertCircle,
  Star,
  Settings,
  Save,
  ImageIcon,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';

// Custom Confirm Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmer", cancelText = "Annuler", type = "danger" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-secondary max-w-md w-full font-zentry overflow-hidden">
        <div className={`p-6 border-b border-slate-700/50 flex items-center gap-4 ${
          type === 'danger' ? 'bg-red-500/10' : 'bg-blue-500/10'
        }`}>
          <div className={`p-3 rounded-full ${
            type === 'danger' ? 'bg-red-500/20' : 'bg-blue-500/20'
          }`}>
            <AlertTriangle className={`w-6 h-6 ${
              type === 'danger' ? 'text-red-400' : 'text-blue-400'
            }`} />
          </div>
          <h3 className="text-xl font-zentry text-white tracking-wider">
            {title}
          </h3>
        </div>

        <div className="p-6">
          <p className="text-slate-300 font-circular-web leading-relaxed">
            {message}
          </p>
        </div>

        <div className="p-6 bg-slate-900/30 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-white transition-colors font-zentry"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`flex-1 px-6 py-3 transition-colors font-zentry ${
              type === 'danger' 
                ? 'bg-red-500 hover:bg-red-600 text-black' 
                : 'bg-primary hover:bg-primary/90 text-black'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast notification component
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-24 right-6 z-[300] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-in min-w-[300px] border-2 ${
      type === 'success' 
        ? 'bg-green-500/95 backdrop-blur-md border-green-400' 
        : 'bg-red-500/95 backdrop-blur-md border-red-400'
    }`}>
      {type === 'success' ? (
        <CheckCircle size={24} className="text-white flex-shrink-0" />
      ) : (
        <AlertCircle size={24} className="text-white flex-shrink-0" />
      )}
      <p className="text-white font-circular-web font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
      >
        <X size={18} className="text-white" />
      </button>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ icon: Icon, label, value, trend, color }) => (
  <div className="bg-gradient-to-br from-secondary to-[#0f172a] p-4 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 transition-colors duration-300`}>
        <Icon className={`w-6 h-6 ${
          color === 'blue' ? 'text-blue-400' : 
          color === 'green' ? 'text-green-400' : 
          color === 'purple' ? 'text-purple-400' : 
          'text-yellow-400'
        }`} />
      </div>
    </div>
    <h3 className="text-slate-400 text-sm font-circular-web mb-2 uppercase">{label}</h3>
    <p className="text-primary text-4xl font-zentry">{value}</p>
  </div>
);

// Dropdown Component
const Dropdown = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-secondary text-slate-300 hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30 hover:border-slate-600/50 font-circular-web"
      >
        {Icon && <Icon size={18} />}
        <span className="text-sm">{value || label}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute z-50 w-48 mt-2 bg-secondary shadow-2xl border border-slate-700/30 overflow-hidden">
            {options.map((option) => (
              <button
                key={option.value}
                className={`w-full px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 transition-colors duration-200 text-sm`}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const GameCard = ({ game, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="relative group overflow-hidden bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="p-2.5 bg-slate-900/90 backdrop-blur-md hover:bg-primary/90 rounded-xl transition-all duration-300 shadow-lg hover:shadow-primary/50 border border-slate-700/50 hover:border-primary"
        >
          <MoreVertical size={18} className="text-white" />
        </button>
        
        {showActions && (
          <div className="absolute right-0 mt-2 w-52 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onView(game);
                setShowActions(false);
              }}
              className="w-full px-5 py-3 text-left text-slate-200 hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
            >
              <Eye size={18} className="text-blue-400" />
              <span className="font-circular-web">Voir détails</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(game);
                setShowActions(false);
              }}
              className="w-full px-5 py-3 text-left text-slate-200 hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
            >
              <Edit size={18} className="text-primary" />
              <span className="font-circular-web">Modifier</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(game);
                setShowActions(false);
              }}
              className="w-full px-5 py-3 text-left text-slate-200 hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
            >
              <Trash2 size={18} className="text-red-400" />
              <span className="font-circular-web">Supprimer</span>
            </button>
          </div>
        )}
      </div>

      <div className="relative h-56 overflow-hidden">
        <img
          src={game.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        <div className="absolute top-4 left-4">
          <div className={`px-4 py-2 rounded-full text-xs font-medium backdrop-blur-md font-circular-web uppercase tracking-wider ${
            game.is_active === 1 
              ? 'bg-green-500/30 text-green-300 border border-green-400/50 shadow-green-500/50' 
              : 'bg-slate-500/30 text-slate-300 border border-slate-400/50'
          }`}>
            {game.is_active === 1 ? '● Actif' : '○ Inactif'}
          </div>
        </div>

        <div className="absolute bottom-4 left-4">
          <h3 className="text-2xl font-zentry text-white tracking-wider mb-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {game.name}
          </h3>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

// Game Row Component
const GameRow = ({ game, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <tr className="border-b border-slate-700/50 font-circular-web hover:bg-slate-800/30 transition-colors">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <img
            src={game.image || 'https://via.placeholder.com/80'}
            alt={game.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <p className="text-white font-zentry tracking-wider">{game.name}</p>
            <p className="text-slate-400 text-sm">{game.slug}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          game.is_active === 1 
            ? 'bg-green-500/10 text-green-500' 
            : 'bg-slate-500/10 text-slate-400'
        }`}>
          {game.is_active === 1 ? 'Actif' : 'Inactif'}
        </span>
      </td>
      <td className="px-6 py-4 text-slate-300">{game.publisher || 'N/A'}</td>
      <td className="px-6 py-4 text-slate-300">{game.tournaments_count || 0}</td>
      <td className="px-6 py-4 text-slate-300">{game.players_count || 0}</td>
      <td className="px-6 py-4">
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-slate-400" />
          </button>
          
          {showActions && (
            <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-lg shadow-xl border border-slate-700/50 z-10">
              <button
                onClick={() => {
                  onView(game);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 rounded-t-lg flex items-center gap-2"
              >
                <Eye size={16} />
                Voir détails
              </button>
              <button
                onClick={() => {
                  onEdit(game);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-blue-400 hover:bg-slate-700/50 flex items-center gap-2"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={() => {
                  onDelete(game);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700/50 rounded-b-lg flex items-center gap-2"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};

// Game Modal
const GameModal = ({ game, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: game?.name || '',
    slug: game?.slug || '',
    image: game?.image || '',
    publisher: game?.publisher || '',
    is_active: game?.is_active !== undefined ? game.is_active : 1,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const generateSlug = () => {
    const slug = formData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, slug }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/70 backdrop-blur-sm">
      <div className="bg-secondary max-w-3xl w-full max-h-[calc(100vh-120px)] overflow-y-auto mt-20">
        <div className="top-0 bg-secondary border-b border-slate-700/50 z-10 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&q=80')"
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-l from-black/90 via-black/80 to-transparent" />
          
          <div className="relative p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-zentry text-primary tracking-wider">
                {game ? 'Modifier le jeu' : 'Ajouter un jeu'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-white font-ea-football text-lg flex items-center gap-2">
              <Gamepad2 size={20} className="text-primary" />
              Informations de base
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2 font-circular-web">
                  Nom du jeu *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={generateSlug}
                  required
                  className="w-full px-4 py-2 bg-slate-700/30 text-white border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/50 font-circular-web"
                  placeholder="Ex: League of Legends"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2 font-circular-web">
                  Slug (URL-friendly) *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    required
                    className="flex-1 px-4 py-2 bg-slate-700/30 text-white border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/50 font-circular-web"
                    placeholder="league-of-legends"
                  />
                  <button
                    type="button"
                    onClick={generateSlug}
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors font-circular-web"
                  >
                    Auto
                  </button>
                </div>
                <p className="text-slate-500 text-xs mt-1">Généré automatiquement à partir du nom</p>
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2 font-circular-web">
                  Éditeur
                </label>
                <input
                  type="text"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-slate-700/30 text-white border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/50 font-circular-web"
                  placeholder="Ex: Riot Games"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-ea-football text-lg flex items-center gap-2">
              <ImageIcon size={20} className="text-primary" />
              Image du jeu
            </h3>

            <div>
              <label className="block text-slate-400 text-sm mb-2 font-circular-web">
                URL de l image
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/30 text-white border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-primary/50 font-circular-web"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-3">
                  <p className="text-slate-400 text-xs mb-2">Aperçu:</p>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-white font-ea-football text-lg flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              Paramètres
            </h3>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active === 1}
                onChange={handleChange}
                className="w-5 h-5 bg-slate-700/30 border-slate-600/50 rounded focus:ring-2 focus:ring-primary/50"
              />
              <label htmlFor="is_active" className="text-slate-300 font-circular-web">
                Jeu actif (visible sur la plateforme)
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-700/50 font-zentry hover:bg-slate-700 text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center font-zentry gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black transition-colors"
            >
              <Save size={20} />
              {game ? 'Sauvegarder' : 'Créer le jeu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
const AdminGamesPage = () => {
  const [filters, setFilters] = useState({
    status: '',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    game: null,
  });
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    tournaments: 0,
    players: 0,
  });

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost';

  const filterOptions = {
    status: [
      { value: '', label: 'Tous les statuts' },
      { value: '1', label: 'Actif' },
      { value: '0', label: 'Inactif' },
    ],
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const fetchGames = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/games_api.php`);
      const data = await response.json();
      
      if (data.success) {
        setGames(data.games);
        setFilteredGames(data.games);
        if (data.stats) {
          setStats(data.stats);
        }
      } else {
        showToast(data.message || 'Erreur lors du chargement des jeux', 'error');
      }
    } catch (err) {
      console.error('Error fetching games:', err);
      showToast('Erreur de connexion à l\'API', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    const filtered = games.filter((game) => {
      const searchMatch =
        searchTerm.trim() === '' ||
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.slug && game.slug.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (game.publisher && game.publisher.toLowerCase().includes(searchTerm.toLowerCase()));

      const statusMatch = filters.status === '' || game.is_active.toString() === filters.status;

      return searchMatch && statusMatch;
    });

    setFilteredGames(filtered);
  }, [filters, games, searchTerm]);

  const handleEdit = (game) => {
    setSelectedGame(game);
    setShowModal(true);
  };

  const handleDelete = (game) => {
    // Check if game has tournaments before showing delete confirmation
    if (game.tournaments_count > 0) {
      showToast(
        `Impossible de supprimer "${game.name}". Ce jeu a ${game.tournaments_count} tournoi${game.tournaments_count > 1 ? 's' : ''} associé${game.tournaments_count > 1 ? 's' : ''}.`,
        'error'
      );
      return;
    }
    
    setConfirmModal({
      isOpen: true,
      game: game,
    });
  };

  const confirmDelete = async () => {
    const game = confirmModal.game;
    
    if (!game || !game.id) {
      showToast('ID du jeu invalide', 'error');
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/games_api.php?id=${game.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        await fetchGames();
        showToast('Jeu supprimé avec succès', 'success');
      } else {
        // Show specific error messages
        if (data.message.includes('existing tournaments')) {
          showToast(`Impossible de supprimer "${game.name}". Ce jeu a des tournois associés.`, 'error');
        } else {
          showToast(data.message || 'Erreur lors de la suppression', 'error');
        }
      }
    } catch (err) {
      console.error('Error deleting game:', err);
      showToast('Erreur lors de la suppression du jeu', 'error');
    }
  };

  const handleView = (game) => {
    console.log('View game:', game);
    showToast('Fonction de visualisation à implémenter', 'success');
  };

  const handleCreate = () => {
    setSelectedGame(null);
    setShowModal(true);
  };

  const handleSave = async (formData) => {
    try {
      const method = selectedGame ? 'PUT' : 'POST';
      
      // Clean up formData - convert empty strings to null
      const cleanedData = {
        ...formData,
        image: formData.image?.trim() || null,
        publisher: formData.publisher?.trim() || null,
      };
      
      const payload = selectedGame 
        ? { ...cleanedData, id: selectedGame.id }
        : cleanedData;

      const response = await fetch(`${API_URL}/api/games_api.php`, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        await fetchGames();
        setShowModal(false);
        showToast(
          selectedGame ? 'Jeu modifié avec succès' : 'Jeu créé avec succès',
          'success'
        );
      } else {
        showToast(data.message || 'Erreur lors de la sauvegarde', 'error');
      }
    } catch (err) {
      console.error('Error saving game:', err);
      showToast('Erreur lors de la sauvegarde du jeu', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-secondary/70 text-white overflow-y-auto">
      <div className="bg-secondary border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold font-ea-football text-primary">Gestion des Jeux</h1>
              <p className="text-slate-400 font-circular-web uppercase">
                Gérez tous les jeux disponibles sur la plateforme
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 font-ea-football text-black transition-colors font-medium"
            >
              <Plus size={20} />
              Ajouter un jeu
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard icon={Gamepad2} label="Total Jeux" value={stats.total} color="blue" />
          <StatsCard icon={CheckCircle} label="Jeux Actifs" value={stats.active} trend={8} color="green" />
          <StatsCard icon={Award} label="Total Tournois" value={stats.tournaments} trend={15} color="purple" />
          <StatsCard icon={Users} label="Total Joueurs" value={stats.players.toLocaleString()} trend={12} color="yellow" />
        </div>

        <div className="p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                placeholder="Rechercher un jeu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 bg-secondary text-white pl-12 focus:outline-none focus:ring-2 focus:ring-primary/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 font-circular-web"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors" size={20} />
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <Dropdown
                label="Statut"
                options={filterOptions.status}
                value={filters.status}
                onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
                icon={Star}
              />

              <div className="flex items-center gap-2 bg-secondary rounded-lg p-1 border border-slate-700/50">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list'
                      ? 'bg-slate-700/50 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Vue Liste"
                >
                  <List size={20} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-slate-700/50 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Vue Grille"
                >
                  <Grid3x3 size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
           <div className="p-12 text-center bg-secondary rounded-xl">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-4 font-zentry text-2xl">Chargement des jeux...</p>
          </div>
        ) : filteredGames.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-3xl font-ea-football text-slate-300 mb-2">Aucun jeu trouvé</h3>
            <p className="text-slate-400 mb-6 font-circular-web">
              Essayez de modifier vos filtres ou ajoutez un nouveau jeu
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onView={handleView}
              />
            ))}
          </div>
        ) : (
          <div className="bg-secondary overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f172a]/50 font-ea-football">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Jeu</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Statut</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Éditeur</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Tournois</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Joueurs</th>
                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGames.map((game) => (
                    <GameRow
                      key={game.id}
                      game={game}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onView={handleView}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredGames.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-slate-400 text-sm">
            <p>
              Affichage de {filteredGames.length} jeu{filteredGames.length > 1 ? 'x' : ''}
            </p>
            <p>Total: {games.length} jeu{games.length > 1 ? 'x' : ''}</p>
          </div>
        )}
      </div>

      {showModal && (
        <GameModal
          game={selectedGame}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ isOpen: false, game: null })}
        onConfirm={confirmDelete}
        title="Supprimer le jeu"
        message={`Êtes-vous sûr de vouloir supprimer "${confirmModal.game?.name}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="danger"
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default AdminGamesPage;