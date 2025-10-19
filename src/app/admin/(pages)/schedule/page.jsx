'use client';
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  Search,
  Clock,
  MapPin,
  Users,
  Trophy,
  AlertCircle,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Grid3x3,
  List,
  Download,
  RefreshCw,
} from 'lucide-react';

// Calendar Day Cell Component
const CalendarDayCell = ({ day, events, onEventClick, isCurrentMonth, isToday }) => {
  const getEventColor = (status) => {
    const colors = {
      registration_open: 'bg-green-500/20 border-green-500/50 text-green-400',
      ongoing: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
      completed: 'bg-slate-500/20 border-slate-500/50 text-slate-400',
      cancelled: 'bg-red-500/20 border-red-500/50 text-red-400',
    };
    return colors[status] || colors.completed;
  };

  return (
    <div
      className={`min-h-[120px] p-2 border border-slate-700/30 ${
        isCurrentMonth ? 'bg-secondary' : 'bg-slate-800/30'
      } ${isToday ? 'ring-2 ring-blue-400' : ''} hover:bg-slate-700/20 transition-colors`}
    >
      <div className="flex items-center justify-between mb-2">
        <span
          className={`text-sm font-medium ${
            isToday
              ? 'bg-blue-500 text-white px-2 py-1 rounded-full font-bold'
              : isCurrentMonth
              ? 'text-slate-300'
              : 'text-slate-500'
          }`}
        >
          {day}
        </span>
      </div>
      <div className="space-y-1">
        {events.slice(0, 3).map((event, idx) => (
          <button
            key={idx}
            onClick={() => onEventClick(event)}
            className={`w-full text-left px-2 py-1  text-xs  ${getEventColor(
              event.status
            )} hover:opacity-80 transition-opacity truncate`}
          >
            <div className="flex items-center gap-1">
              {/* <Clock size={10} /> */}
              <span className="truncate">{event.name}</span>
            </div>
          </button>
        ))}
        {events.length > 3 && (
          <button className="w-full text-left px-2 py-1 text-xs text-slate-400 hover:text-blue-400 transition-colors">
            +{events.length - 3} plus
          </button>
        )}
      </div>
    </div>
  );
};

// Event List Item Component
const EventListItem = ({ event, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);

  const getStatusStyle = (status) => {
    const styles = {
      registration_open: 'bg-green-500/10 text-green-500',
      ongoing: 'bg-blue-500/10 text-blue-500',
      completed: 'bg-slate-500/10 text-slate-400',
      cancelled: 'bg-red-500/10 text-red-500',
    };
    return styles[status] || styles.completed;
  };

  const getStatusLabel = (status) => {
    const labels = {
      registration_open: 'Inscriptions ouvertes',
      ongoing: 'En cours',
      completed: 'Terminé',
      cancelled: 'Annulé',
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-secondary p-4   transition-all group">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-800">
            <img
              src={event.featured_image || 'https://via.placeholder.com/64'}
              alt={event.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-white text-lg mb-1 font-zentry tracking-wide">{event.name}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(event.start_date).toLocaleDateString('fr-FR')}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {new Date(event.start_date).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {event.current_participants || 0}/{event.max_participants}
              </span>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(event.status)}`}
          >
            {getStatusLabel(event.status)}
          </span>
        </div>
        <div className="relative ml-4">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-slate-400" />
          </button>

          {showActions && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowActions(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-secondary rounded-lg shadow-xl border border-slate-700/50 z-50">
                <button
                  onClick={() => {
                    onView(event);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-slate-300 hover:bg-slate-700/50 rounded-t-lg flex items-center gap-2"
                >
                  <Eye size={16} />
                  Voir les détails
                </button>
                <button
                  onClick={() => {
                    onEdit(event);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-blue-400 hover:bg-slate-700/50 flex items-center gap-2"
                >
                  <Edit size={16} />
                  Modifier
                </button>
                <button
                  onClick={() => {
                    onDelete(event);
                    setShowActions(false);
                  }}
                  className="w-full px-4 py-2 text-left text-red-400 hover:bg-slate-700/50 rounded-b-lg flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Event Details Modal
const EventDetailsModal = ({ event, onClose }) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div className="bg-secondary rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700/50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-blue-400">{event.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <AlertCircle size={24} className="text-slate-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="aspect-video rounded-lg overflow-hidden bg-slate-800">
              <img
                src={event.featured_image || 'https://via.placeholder.com/800x450'}
                alt={event.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Date de début</p>
                <p className="text-white">
                  {new Date(event.start_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-slate-300 text-sm">
                  {new Date(event.start_date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Date de fin</p>
                <p className="text-white">
                  {new Date(event.end_date).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-slate-300 text-sm">
                  {new Date(event.end_date).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Participants</p>
                <p className="text-white text-2xl font-bold">
                  {event.current_participants || 0}/{event.max_participants}
                </p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">Prize Pool</p>
                <p className="text-blue-400 text-2xl font-bold">{event.prize_pool || 'N/A'} DH</p>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Description</p>
              <p className="text-white">{event.description || 'Aucune description'}</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => (window.location.href = `/tournaments/${event.slug || event.id}`)}
                className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors"
              >
                Voir le tournoi
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Schedule Component
const TournamentSchedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('calendar');
  const [tournaments, setTournaments] = useState([]);
  const [filteredTournaments, setFilteredTournaments] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTournaments = async () => {
      try {
        setIsLoading(true);
        // Mock data for demonstration
        const mockTournaments = [
          {
            id: 1,
            name: 'Championship League',
            start_date: '2025-10-15T10:00:00',
            end_date: '2025-10-20T18:00:00',
            status: 'registration_open',
            max_participants: 32,
            current_participants: 18,
            prize_pool: '50000',
            description: 'Annual championship tournament',
            featured_image: 'https://via.placeholder.com/400x300',
            slug: 'championship-league',
            bracket_type: 'Single Elimination',
          },
          {
            id: 2,
            name: 'Winter Cup',
            start_date: '2025-10-25T14:00:00',
            end_date: '2025-10-28T20:00:00',
            status: 'ongoing',
            max_participants: 16,
            current_participants: 16,
            prize_pool: '30000',
            description: 'Seasonal winter tournament',
            featured_image: 'https://via.placeholder.com/400x300',
            slug: 'winter-cup',
            bracket_type: 'Double Elimination',
          },
        ];
        setTournaments(mockTournaments);
        setFilteredTournaments(mockTournaments);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournaments();
  }, []);

  useEffect(() => {
    const filtered = tournaments.filter((tournament) => {
      const searchMatch =
        searchTerm.trim() === '' ||
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase());

      const statusMatch = statusFilter === '' || tournament.status === statusFilter;

      return searchMatch && statusMatch;
    });

    setFilteredTournaments(filtered);
  }, [searchTerm, statusFilter, tournaments]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        day: prevMonthLastDay - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const getEventsForDate = (date) => {
    return filteredTournaments.filter((tournament) => {
      const startDate = new Date(tournament.start_date);
      const endDate = new Date(tournament.end_date);
      const checkDate = new Date(date);
      checkDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      return checkDate >= startDate && checkDate <= endDate;
    });
  };

  const changeMonth = (direction) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1)
    );
  };

  const handleEdit = (tournament) => {
    window.location.href = `/admin/tournaments/edit/${tournament.id}`;
  };

  const handleDelete = (tournament) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${tournament.name}" ?`)) {
      alert('Tournoi supprimé avec succès');
    }
  };

  const handleView = (tournament) => {
    setSelectedEvent(tournament);
  };

  const exportCalendar = () => {
    alert('Export de calendrier (fonctionnalité à implémenter)');
  };

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
  ];

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = filteredTournaments
    .filter((t) => new Date(t.start_date) > new Date())
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-circular-web">
      <div className="bg-secondary border-b border-slate-700/50 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-bold text-primary font-zentry">
                Calendrier des Tournois
              </h1>
              <p className="text-slate-400 font-circular-web uppercase text-sm">
                Planifiez et gérez tous vos événements
              </p>
            </div>
            {/* <div className="flex gap-3">
              <button
                onClick={exportCalendar}
                className="flex items-center gap-2 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-600/50"
              >
                <Download size={20} />
                Exporter
              </button>
              <button
                onClick={() => (window.location.href = '/admin/new-tournament')}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-bold"
              >
                <Plus size={20} />
                Nouveau Tournoi
              </button>
            </div> */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className=" p-6  mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative group w-full lg:w-auto">
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-5 py-3 bg-slate-800/50 text-white  pl-12 focus:outline-none focus:ring-2 focus:ring-primary border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200"
              />
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-primary transition-colors"
                size={20}
              />
            </div>

            <div className="flex gap-3 flex-wrap items-center">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-slate-800/50 text-slate-300 rounded-lg border border-slate-700/30 hover:border-slate-600/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Tous les statuts</option>
                <option value="registration_open">Inscriptions ouvertes</option>
                <option value="ongoing">En cours</option>
                <option value="completed">Terminé</option>
                <option value="cancelled">Annulé</option>
              </select>

              <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg p-1 border border-slate-700/50">
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
                  onClick={() => setViewMode('calendar')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'calendar'
                      ? 'bg-slate-700/50 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Vue Calendrier"
                >
                  <Calendar size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center bg-secondary rounded-lg border border-slate-700/50">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-slate-400 mt-4">Chargement du calendrier...</p>
          </div>
        ) : viewMode === 'calendar' ? (
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <div className="bg-secondary rounded-lg border border-slate-700/30 overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-slate-700/30">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <ChevronLeft size={24} className="text-slate-300" />
                  </button>
                  <h2 className="text-2xl font-zentry tracking-wide text-white">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                  >
                    <ChevronRight size={24} className="text-slate-300" />
                  </button>
                </div>

                <div className="grid grid-cols-7 border-b border-slate-700/30 font-circular-web">
                  {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                    <div
                      key={day}
                      className="p-3 text-center text-slate-400 font-medium text-sm"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {days.map((dayInfo, index) => {
                    const events = getEventsForDate(dayInfo.date);
                    const isToday =
                      dayInfo.date.toDateString() === today.toDateString();
                    return (
                      <CalendarDayCell
                        key={index}
                        day={dayInfo.day}
                        events={events}
                        onEventClick={handleView}
                        isCurrentMonth={dayInfo.isCurrentMonth}
                        isToday={isToday}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-secondary  border border-slate-700/30 p-6 sticky top-24">
                <h3 className="text-xl font-bold text-primary font-ea-football mb-4">
                  Événements à venir
                </h3>
                <div className="space-y-3">
                  {upcomingEvents.length === 0 ? (
                    <p className="text-slate-400 text-sm">
                      Aucun événement à venir
                    </p>
                  ) : (
                    upcomingEvents.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => handleView(event)}
                        className="w-full text-left bg-slate-800/50 p-3 hover:bg-slate-700/50 transition-colors border border-slate-700/30"
                      >
                        <p className="text-white text-sm mb-1 truncate font-bold">
                          {event.name}
                        </p>
                        <p className="text-slate-400 text-xs flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(event.start_date).toLocaleDateString('fr-FR')}
                        </p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTournaments.length === 0 ? (
              <div className="p-12 text-center bg-secondary rounded-lg border border-slate-700/50">
                <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-300 mb-2">
                  Aucun événement trouvé
                </h3>
                <p className="text-slate-400">
                  Essayez de modifier vos filtres
                </p>
              </div>
            ) : (
              filteredTournaments.map((event) => (
                <EventListItem
                  key={event.id}
                  event={event}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onView={handleView}
                />
              ))
            )}
          </div>
        )}

        {filteredTournaments.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-slate-400 text-sm">
            <p>
              Affichage de {filteredTournaments.length} événement
              {filteredTournaments.length > 1 ? 's' : ''}
            </p>
            <p>Total: {tournaments.length} tournoi{tournaments.length > 1 ? 's' : ''}</p>
          </div>
        )}
      </div>

      {selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
};

export default TournamentSchedule;