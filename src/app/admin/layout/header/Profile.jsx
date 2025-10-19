import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [adminName, setAdminName] = useState('');
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Handle authentication and click outside
  useEffect(() => {
    const storedUsername = localStorage.getItem('adminUsername');
    const storedAdminId = localStorage.getItem('adminId');
    if (!storedUsername || !storedAdminId) {
      router.push('/login');
      return;
    }
    setAdminName(storedUsername);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [router]);

  const handleSignOut = () => {
    localStorage.removeItem('adminSessionToken');
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminUsername');
    router.push('/login');
  };

  if (!adminName) return null;

  return (
    <div ref={dropdownRef} className="relative flex items-center text-left">
      <button
        type="button"
        className="flex items-center space-x-3 rounded-l-lg py-1 px-4 cursor-default transition-colors duration-200  bg-[#21324F]"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span className="w-8 h-8 rounded-full bg-[#21324F] flex items-center  overflow-hidden">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlcKzVClNV1JkQ8qVlMzxvYr7n9flJv-x9OA&s"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        </span>
        <span className="text-white text-left font-ea-football">
          <span className=" text-sm ">{adminName}</span>
          <span className="block text-xs text-primary"> SUPER Admin</span>
        </span>
      </button>
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="ml-0.5 flex  h-full items-center space-x-3 rounded-r-lg py-4 px-3 cursor-pointer transition-colors duration-200  bg-[#21324F]"
      >
        <ChevronDown
          className={`w-4 h-4 text-gray-300 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-28 w-56 rounded-lg font-ea-football shadow-lg bg-[#21324F]      z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className="flex w-full items-center px-4 py-2 text-sm text-white transition-colors duration-200"
              role="menuitem"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-400 " aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
