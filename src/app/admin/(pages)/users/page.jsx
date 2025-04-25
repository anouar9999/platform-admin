'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  X,
  Trash2,
  Loader2,
  Search,
  Users,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import EditUserModal from './EditUser';
import { TbTournament } from 'react-icons/tb';
import ProfileCard from './UserCard';
import { motion, AnimatePresence } from 'framer-motion';

// Delete Confirmation Popup Component
const DeleteConfirmationPopup = ({ isOpen, onClose, onConfirm, username }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-dark w-full max-w-md overflow-hidden shadow-2xl angular-cut border border-red-900/30"
          >
            <div className="p-6 pb-5 flex items-center justify-between border-b border-gray-800/50 relative overflow-hidden bg-gradient-to-r from-red-900/30 to-transparent">
              <div className="flex items-center z-10 relative">
                <div className="bg-red-500/20 backdrop-blur-sm rounded-lg p-2 mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <h2 className="text-gray-100 text-xl font-valorant">Confirm Deletion</h2>
                  <p className="text-gray-500 text-sm font-mono mt-0.5">
                    This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-white text-center mb-6">
                Are you sure you want to delete <span className="text-red-400 font-semibold">{username || 'this user'}</span>? 
                This will permanently remove all associated data and cannot be reversed.
              </p>

              <div className="flex items-center space-x-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-700 text-gray-300 rounded-md flex items-center font-medium"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white angular-cut flex items-center font-medium shadow-lg shadow-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main user management component with improved UI/UX
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('username');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showFiltersMenu, setShowFiltersMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // State for delete confirmation popup
  const [deletePopup, setDeletePopup] = useState({
    isOpen: false,
    userId: null,
    username: ''
  });

  const filtersRef = useRef(null);

  // Close filters dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target) && showFiltersMenu) {
        setShowFiltersMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFiltersMenu]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`,
      );
      if (response.data.success) {
        setUsers(response.data.users);
        setFilteredUsers(response.data.users);
        console.log(response.data.users);
      } else {
        setError(response.data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Error fetching users. Please try again later.');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    let result = users.filter(
      (user) =>
        (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterType === 'all' || user.type === filterType),
    );

    result.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredUsers(result);
  }, [searchTerm, users, filterType, sortBy, sortOrder]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = async (formData) => {
    try {
      // Add the user ID to the form data
      console.log("editingUser:", editingUser); // Debug log

      formData.append('id', editingUser.id);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        await fetchUsers();
        setEditingUser(null);
        setNotification({
          type: 'success',
          message: 'User updated successfully',
        });
      } else {
        setNotification({
          type: 'error',
          message: response.data.error || 'Failed to update user',
        });
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: 'Error updating user. Please try again later.',
      });
      console.error('Error updating user:', err);
    }
  };

  // Show delete confirmation popup instead of window.confirm
  const handleDeleteUser = (user) => {
    setDeletePopup({
      isOpen: true,
      userId: user.id,
      username: user.username
    });
  };

  // Handle actual deletion after confirmation
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/manage_users.php`,
        {
          data: { id: deletePopup.userId },
          headers: { 'Content-Type': 'application/json' },
        },
      );

      if (response.data && response.data.success) {
        await fetchUsers();
        setNotification({
          type: 'success',
          message: 'User deleted successfully',
        });
      } else {
        setNotification({
          type: 'error',
          message: 'Error deleting user. Server responded with an error.',
        });
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setNotification({
        type: 'error',
        message: 'Error deleting user. Please try again.',
      });
    } finally {
      setIsDeleting(false);
      setDeletePopup({ isOpen: false, userId: null, username: '' });
    }
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setShowFiltersMenu(false);
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setShowFiltersMenu(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <span className="text-white text-lg">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-white text-xl mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchUsers}
          className="px-4 py-2  text-white rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container space-y-8 mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div>
        <div className="flex items-center text-primary ">
          <TbTournament />
          <p className="mx-2 font-semibold uppercase tracking-wider"> User Management</p>
        </div>

        <h1 className="text-3xl flex items-center font-custom tracking-wider uppercase">
          EXPLOREZ TOUS LES joueurs inscrit dans le platform.
        </h1>
      </div>

      {/* Search and Filters */}
      <div className=" mb-8 gap-4 grid grid-cols-1 md:grid-cols-3">
        {/* Search Bar */}
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-secondary text-white angular-cut pl-10 focus:outline-none"
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <ProfileCard
            key={user.id}
            user={user}
            onEdit={handleEditUser}
            onDelete={() => handleDeleteUser(user)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-16  rounded-xl mt-8">
          <Users size={48} className="mx-auto mb-4 text-gray-500" />
          <h3 className="text-xl text-white mb-2">No users found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterType('all');
            }}
            className="px-4 py-2 bg-secondary text-white angular-cut transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Processing overlay */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-white">Deleting user...</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      <DeleteConfirmationPopup
        isOpen={deletePopup.isOpen}
        onClose={() => setDeletePopup({ isOpen: false, userId: null, username: '' })}
        onConfirm={handleConfirmDelete}
        username={deletePopup.username}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

export default UserManagement;