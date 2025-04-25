import React, { useState, useEffect, useRef } from 'react';
import { 
  X, User, Mail, Shield, Award, Star, CheckCircle, 
  FileText, Save, ArrowLeft, Upload, Trash2, 
  Eye, EyeOff, Settings, FileEdit, Camera, Info 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


// Main component
const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  if (!isOpen) return null;
  return (
    <div style={{marginTop:'0px'}} className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 space-y-reverse mt-0 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-secondary shadow-2xl m-4 flex flex-col max-h-screen overflow-hidden">
        <ModalHeader onClose={onClose} username={user?.username} />
        <ModalBody user={user} onClose={onClose} onSave={onSave} />
      </div>
    </div>
  );
};

// Header component
const ModalHeader = ({ onClose, username }) => (
  <div 
              className="p-6 pb-5 flex items-center justify-between border-b border-gray-800/50 relative overflow-hidden"
              style={{
                backgroundImage: "url('https://wallpapers.com/images/hd/3d-valorant-logo-lotk82bx6kv65d3u.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                flexShrink: 0
              }}
            >
              {/* Add an overlay to ensure text remains readable */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-primary/20 to-gray-900/80 z-0"></div>
              
              {/* Content - now with z-10 to appear above the background */}
              <div className="flex items-center z-10 relative">
                <div className="bg-primary/20 backdrop-blur-sm rounded-lg p-2 mr-3">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-gray-100 text-xl font-valorant">Edit User Profile</h2>
                  {/* <p className="text-gray-500 text-sm font-mono mt-0.5">
                    {formData.username || "User"}
                  </p> */}
                </div>
              </div>
              <motion.button
                onClick={onClose}
                whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-red-500/20 rounded-full p-2 transition-colors z-10 relative"
              >
                <X className="h-5 w-5" />
              </motion.button>
              </div>
);

// Main body with tabs and content
const ModalBody = ({ user, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState({});
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  // Initialize form when modal opens
  useEffect(() => {
    if (user) {
      setUserData({
        id: user.id,
        username: user.username || '',
        email: user.email || '',
        points: user.points?.toString() || '0',
        rank: user.rank || '',
        type: user.type || 'participant',
        is_verified: Boolean(user.is_verified),
        bio: user.bio || ''
      });
      
      // Reset other states
      setPassword('');
      setPreviewUrl(null);
      setAvatar(user.avatar || null);
    }
  }, [user]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should not exceed 5MB");
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert("Only JPG, PNG & GIF files are allowed");
      return;
    }
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setAvatar(file);
    
    // Clean up preview URL on unmount
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  // Remove avatar
  const handleRemoveAvatar = () => {
    setPreviewUrl(null);
    setAvatar(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData();
    
    // Add all user data fields
    Object.entries(userData).forEach(([key, value]) => {
      if (key === 'is_verified') {
        formData.append(key, value ? '1' : '0');
      } else {
        formData.append(key, value);
      }
    });
    
    // Add password only if changed
    if (password) {
      formData.append('password', password);
    }
    
    // Add avatar if it's a file
    if (avatar instanceof File) {
      formData.append('avatar', avatar);
    }
    
    // Submit with delay to simulate network request
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
    }, 600);
  };
  
  // Password strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };
  
  const passwordStrength = getPasswordStrength();
  
  // Define tabs
  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'bio', label: 'Biography', icon: FileEdit }
  ];
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {tabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`flex items-center px-5 py-3 text-sm font-medium transition ${
              activeTab === tab.id 
                ? 'text-primary bg-primary/5 border-b-2 border-primary' 
                : 'text-gray-500 hover:text-gray-300'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon className="h-4 w-4 mr-2" />
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex items-center space-x-6 pb-6 border-b border-gray-800/30">
              <div className="relative">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                  accept="image/*"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl overflow-hidden border-2 border-gray-800 cursor-pointer group"
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
                  ) : avatar && typeof avatar === 'string' ? (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${avatar}`}
                      alt="User avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.username || 'User')}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <User className="w-10 h-10 text-gray-700" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {(previewUrl || avatar) && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    className="absolute -bottom-2 -right-2 p-1.5 bg-red-600 text-white rounded-full"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Profile Picture</h3>
                <p className="text-sm text-gray-400">Upload a photo to help others recognize you.</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center px-3 py-1.5 bg-dark hover:bg-gray-700 text-sm text-gray-300 rounded"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload Image
                </button>
              </div>
            </div>
            
            {/* Profile Fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  label="Username"
                  name="username"
                  value={userData.username || ''}
                  onChange={handleChange}
                  icon={User}
                />
                
                <FormField
                  label="Email Address"
                  name="email"
                  type="email"
                  value={userData.email || ''}
                  onChange={handleChange}
                  icon={Mail}
                />
                
                <FormField
                  label="Points"
                  name="points"
                  type="number"
                  value={userData.points || ''}
                  onChange={handleChange}
                  icon={Award}
                  hint="Points earned by user through activities"
                />
                
                <FormField
                  label="Rank"
                  name="rank"
                  value={userData.rank || ''}
                  onChange={handleChange}
                  icon={Star}
                />
                
                <div className="space-y-1.5">
                  <label className="text-gray-300 text-sm font-medium flex items-center">
                    <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-primary/80" />
                    Verification Status
                  </label>
                  <select
                    name="is_verified"
                    value={userData.is_verified ? "1" : "0"}
                    onChange={(e) => setUserData(prev => ({
                      ...prev,
                      is_verified: e.target.value === "1"
                    }))}
                    className="w-full pl-3 pr-8 py-2.5 bg-dark text-gray-100 angular-cut focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="0">Not Verified</option>
                    <option value="1">Verified</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="max-w-lg mx-auto space-y-6">
            
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Password Management
              </h3>
              
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-gray-300 text-sm font-medium">New Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-3 pr-10 py-2.5 bg-dark text-gray-100 angular-cut focus:outline-none focus:ring-2 focus:ring-primary/30"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                
                {password && (
                  <div className="mt-3 space-y-2">
                    <div className="relative pt-1">
                      <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                        <div
                          style={{ width: `${passwordStrength}%` }}
                          className={`h-full transition-all duration-300 ${
                            passwordStrength <= 25 ? 'bg-red-500' : 
                            passwordStrength <= 50 ? 'bg-orange-500' : 
                            passwordStrength <= 75 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Weak</span>
                        <span>Strong</span>
                      </div>
                    </div>
                    
                    <ul className="space-y-1 text-xs text-gray-500">
                      <PasswordRequirement 
                        met={password.length >= 8}
                        text="At least 8 characters"
                      />
                      <PasswordRequirement 
                        met={/[A-Z]/.test(password)}
                        text="Include uppercase letters"
                      />
                      <PasswordRequirement 
                        met={/[0-9]/.test(password)}
                        text="Include numbers"
                      />
                      <PasswordRequirement 
                        met={/[^A-Za-z0-9]/.test(password)}
                        text="Include special characters"
                      />
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'bio' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Biography
            </h3>
            
            <div className="space-y-2">
              <textarea
                name="bio"
                value={userData.bio || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark text-gray-100 angular-cut focus:outline-none focus:ring-2 focus:ring-primary/30"
                rows="8"
                placeholder="Write something about yourself..."
                maxLength="500"
              />
              
              <div className="flex justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {userData.bio ? userData.bio.length : 0} characters
                </span>
                <span>Maximum 500 characters</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-5 border-t border-gray-800 bg-gradient-to-b from-gray-900/0 to-gray-900/60 mt-auto">
        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 flex items-center text-gray-400 hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white angular-cut flex items-center font-medium shadow-lg shadow-primary/20 disabled:opacity-70"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

// Helper components
const FormField = ({ label, name, type = "text", value = '', onChange, placeholder = "", icon: Icon, hint }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <label htmlFor={name} className="text-gray-300 text-sm font-medium flex items-center">
        {Icon && <Icon className="h-3.5 w-3.5 mr-1.5 text-primary/80" />}
        {label}
      </label>
      
      {hint && (
        <div className="group relative">
          <Info className="h-3.5 w-3.5 text-gray-500 cursor-help" />
          <div className="absolute right-0 bottom-full mb-2 w-48 bg-gray-900 text-xs text-gray-300 p-2 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
            {hint}
          </div>
        </div>
      )}
    </div>
    
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 bg-dark angular-cut text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
    />
  </div>
);

const PasswordRequirement = ({ met, text }) => (
  <li className={`flex items-center ${met ? 'text-green-500' : ''}`}>
    <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${met ? 'bg-green-500' : 'bg-gray-700'}`}></div>
    {text}
  </li>
);

export default EditUserModal;