import React, { useState, useEffect, useRef } from 'react';
import { 
  X, User, Award, FileText, Save, ArrowLeft, Upload, Trash2, 
  Settings, FileEdit, Camera, Info, Users, Globe, Gift, 
  MessageCircle, Trophy, Twitter, Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EditTeamModal = ({ isOpen, onClose, team, onSave }) => {
  if (!isOpen) return null;
  console.log(team)
  return (
    <div 
      style={{marginTop:'0px'}} 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 space-y-reverse mt-0 flex items-center justify-center"
    >
      <div className="w-full max-w-4xl bg-secondary shadow-2xl m-4 flex flex-col max-h-screen overflow-hidden">
        <ModalHeader onClose={onClose} teamName={team?.name} />
        <ModalBody team={team} onClose={onClose} onSave={onSave} />
      </div>
    </div>
  );
};

// Header component
const ModalHeader = ({ onClose, teamName }) => (
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
        <h2 className="text-gray-100 text-xl font-valorant">Edit Team Profile</h2>
        <p className="text-gray-500 text-sm font-mono mt-0.5">
          {teamName || "Team"}
        </p>
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
const ModalBody = ({ team, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [teamData, setTeamData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  // Initialize form when modal opens
  useEffect(() => {
    if (team) {
      setTeamData({
        id: team.id,
        name: team.name || '',
        tag: team.tag || '',
        slug: team.slug || '',
        game_id: team.game_id || '',
        description: team.description || '',
        division: team.division || '',
        tier: team.tier || 'amateur',
        discord: team.discord || '',
        twitter: team.twitter || '',
        contact_email: team.contact_email || '',
      });
      
      // Reset image states
      setLogo(team.logo || null);
      setBanner(team.banner || null);
      setLogoPreview(null);
      setBannerPreview(null);
    }
  }, [team]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeamData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle logo upload
  const handleLogoChange = (e) => {
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
    setLogoPreview(objectUrl);
    setLogo(file);
    
    // Clean up preview URL on unmount
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  // Handle banner upload
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      alert("File size should not exceed 10MB");
      return;
    }
    
    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert("Only JPG, PNG & GIF files are allowed");
      return;
    }
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setBannerPreview(objectUrl);
    setBanner(file);
    
    // Clean up preview URL on unmount
    return () => URL.revokeObjectURL(objectUrl);
  };
  
  // Remove logo
  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setLogo(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };
  
  // Remove banner
  const handleRemoveBanner = () => {
    setBannerPreview(null);
    setBanner(null);
    if (bannerInputRef.current) {
      bannerInputRef.current.value = '';
    }
  };
  
  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData();
    
    // Add all team data fields
    Object.entries(teamData).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    // Add logo if it's a file
    if (logo instanceof File) {
      formData.append('logo', logo);
    }
    
    // Add banner if it's a file
    if (banner instanceof File) {
      formData.append('banner', banner);
    }
    
    // Submit with delay to simulate network request
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
    }, 600);
  };
  
  // Define tabs
  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Users },
    { id: 'media', label: 'Media', icon: Camera },
    { id: 'social', label: 'Social', icon: Globe },
    { id: 'description', label: 'Description', icon: FileEdit }
  ];
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Tabs */}
      <div className="flex border-b border-gray-800 overflow-x-auto">
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
        {activeTab === 'basic' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Team Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  label="Team Name"
                  name="name"
                  value={teamData.name || ''}
                  onChange={handleChange}
                  icon={Trophy}
                  required
                />
                
                <FormField
                  label="Team Tag"
                  name="tag"
                  value={teamData.tag || ''}
                  onChange={handleChange}
                  icon={Award}
                  maxLength={10}
                  hint="Short team identifier (max 10 chars)"
                  required
                />
                
            
                
                <div className="space-y-1.5">
                  <label className="text-gray-300 text-sm font-medium flex items-center">
                    <Gift className="h-3.5 w-3.5 mr-1.5 text-primary/80" />
                    Division
                  </label>
                  <select
                    name="division"
                    value={teamData.division || ""}
                    onChange={handleChange}
                    className="w-full pl-3 pr-8 py-2.5 bg-dark text-gray-100 angular-cut focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Select Division</option>
                    <option value="bronze">Bronze</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                    <option value="diamond">Diamond</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-gray-300 text-sm font-medium flex items-center">
                    <Award className="h-3.5 w-3.5 mr-1.5 text-primary/80" />
                    Team Tier
                  </label>
                  <select
                    name="tier"
                    value={teamData.tier || "amateur"}
                    onChange={handleChange}
                    className="w-full pl-3 pr-8 py-2.5 bg-dark text-gray-100 angular-cut focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="amateur">Amateur</option>
                    <option value="semi-pro">Semi-Professional</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                
                <FormField
                  label="Contact Email"
                  name="contact_email"
                  type="email"
                  value={teamData.contact_email || ''}
                  onChange={handleChange}
                  icon={Mail}
                  placeholder="team@example.com"
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'media' && (
          <div className="space-y-6">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
              Team Branding
            </h3>
            
            {/* Team Banner Preview */}
            <div className="space-y-2 mb-6">
              <div className="relative w-full h-56  overflow-hidden  bg-gray-900">
                {/* Banner */}
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner preview" className="w-full h-full object-cover" />
                ) : banner && typeof banner === 'string' ? (
                  <img 
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${banner}`}
                    alt="Team banner"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/1200x400?text=No+Banner';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800">
                    <FileText className="w-16 h-16 text-gray-700" />
                  </div>
                )}
                
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                
                {/* Team logo and name at bottom left */}
                <div className="absolute bottom-4 left-4 flex items-center">
                  <div 
                    className="w-14 h-14 rounded-lg overflow-hidden shadow-lg bg-gray-900 mr-3 relative group cursor-pointer"
                    onClick={() => logoInputRef.current?.click()}
                  >
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    ) : logo && typeof logo === 'string' ? (
                      <img 
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL || ''}${logo}`}
                        alt="Team logo"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teamData.name || 'Team')}&background=random`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Trophy className="w-8 h-8 text-gray-600" />
                      </div>
                    )}
                    {/* Overlay for logo editing */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-200">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xl drop-shadow-md">
                      {teamData.name || "Team Name"}
                    </h3>
                    {teamData.tag && (
                      <p className="text-gray-300 text-sm">#{teamData.tag}</p>
                    )}
                  </div>
                </div>
                
                {/* Edit overlay for banner */}
                <button
                  type="button"
                  onClick={() => bannerInputRef.current?.click()}
                  className="absolute top-4 right-4 p-2 bg-gray-900/60 backdrop-blur-sm text-white rounded-lg hover:bg-gray-900/80 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
                
                {/* Invisible file input for banner */}
                <input
                  type="file"
                  ref={bannerInputRef}
                  onChange={handleBannerChange}
                  className="hidden"
                  accept="image/*"
                />
              </div>
              
              <div className="flex justify-between">
                
                
                <div className="flex space-x-2">
                  {banner || bannerPreview ? (
                    <button
                      type="button"
                      onClick={handleRemoveBanner}
                      className="flex items-center px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                      Remove
                    </button>
                  ) : null}
                  
                  <button
                    type="button"
                    onClick={() => bannerInputRef.current?.click()}
                    className="flex items-center px-3 py-1.5 bg-dark hover:bg-gray-700 text-sm text-gray-300 rounded"
                  >
                    <Upload className="w-3.5 h-3.5 mr-1.5" />
                    {banner || bannerPreview ? 'Change Banner' : 'Upload Banner'}
                  </button>
                </div>
              </div>
            </div>
            
         
          </div>
        )}
        
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
                Social Media
              </h3>
              
              <div className="grid grid-cols-1 gap-6">
                <FormField
                  label="Discord Server"
                  name="discord"
                  value={teamData.discord || ''}
                  onChange={handleChange}
                  icon={MessageCircle}
                  placeholder="discord.gg/your-server"
                  hint="Discord server invite link or ID"
                />
                
                <FormField
                  label="Twitter/X Handle"
                  name="twitter"
                  value={teamData.twitter || ''}
                  onChange={handleChange}
                  icon={Twitter}
                  placeholder="Your Twitter handle (without @)"
                  hint="Twitter/X username without the @ symbol"
                />
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'description' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              Team Description
            </h3>
            
            <div className="space-y-2">
              <textarea
                name="description"
                value={teamData.description || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-dark text-gray-100 angular-cut focus:outline-none focus:ring-2 focus:ring-primary/30"
                rows="8"
                placeholder="Write something about your team..."
                maxLength="1000"
              />
              
              <div className="flex justify-between text-xs text-gray-500">
                <span className="flex items-center">
                  <FileText className="h-3 w-3 mr-1" />
                  {teamData.description ? teamData.description.length : 0} characters
                </span>
                <span>Maximum 1000 characters</span>
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

// Helper component
const FormField = ({ label, name, type = "text", value = '', onChange, placeholder = "", icon: Icon, hint, required = false, maxLength }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <label htmlFor={name} className="text-gray-300 text-sm font-medium flex items-center">
        {Icon && <Icon className="h-3.5 w-3.5 mr-1.5 text-primary/80" />}
        {label} {required && <span className="text-primary ml-1">*</span>}
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
      required={required}
      maxLength={maxLength}
      className="w-full px-3 py-2.5 bg-dark angular-cut text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
    />
    
    {maxLength && (
      <div className="flex justify-end">
        <span className="text-xs text-gray-500">{value?.length || 0}/{maxLength}</span>
      </div>
    )}
  </div>
);

export default EditTeamModal;