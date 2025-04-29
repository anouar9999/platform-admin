'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FloatingLabelInput from '@/app/components/input/input';
import { Mail, User } from 'lucide-react';
import * as Yup from 'yup';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('Admin@00');
  const [email, setEmail] = useState('admin@gmail.com');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isAdminSetup, setIsAdminSetup] = useState(true);
  const router = useRouter();

  // Define validation schemas
  const loginSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Invalid email format'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters'),
  });

  const setupSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'For security, passwords must be at least 8 characters')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Include uppercase, lowercase, number, and special character for stronger security'
      ),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
  });

  useEffect(() => {
    checkAdminSetup();
    
    // Check for existing session_token
    const savedToken = localStorage.getItem('adminSessionToken');
    if (savedToken) {
      // Verify token validity with backend before auto-login
      verifyToken(savedToken);
    }
  }, []);
  
  const verifyToken = async (token) => {
    try {
      // You'll need to create this endpoint on your backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify_token.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_token: token }),
      });
      
      const data = await response.json();
      if (data.valid) {
        // Token is valid, redirect to dashboard
        router.push('/');
      } else {
        // Token is invalid, clear stored credentials
        localStorage.removeItem('adminSessionToken');
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminUsername');
      }
    } catch (error) {
      console.error('Error verifying token:', error);
    }
  };

  const checkAdminSetup = async () => {
    try {
      // Use a more efficient endpoint that performs a lightweight check
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin_setup.php?check_only=true`,
        {
          method: 'GET',
        },
      );

      const data = await response.json();
      setIsAdminSetup(data.isEmpty);
    } catch (error) {
      console.error('Error checking admin setup:', error);
      // Default to login form if check fails
      setIsAdminSetup(false);
    }
  };

  const validateForm = async () => {
    try {
      const schema = isAdminSetup ? setupSchema : loginSchema;
      const formData = isAdminSetup
        ? { username, password, email, fullName }
        : { email, password }; // Changed from username to email
      
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
      return false;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate form before submission
    const isValid = await validateForm();
    if (!isValid) return;

    setIsLoading(true);

    try {
      const url = isAdminSetup
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin_setup.php`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin_login.php`;

      const requestBody = isAdminSetup
        ? { username, password, email, full_name: fullName }
        : { email, password, remember_me: rememberMe };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      if (data.success || data.message === 'Admin created successfully') {
        if (!isAdminSetup) {
          // Handle session token based on remember me preference
          if (rememberMe) {
            // Store in localStorage for persistent sessions
            localStorage.setItem('adminSessionToken', data.session_token);
            localStorage.setItem('adminId', data.admin_id);
            localStorage.setItem('adminUsername', data.username);
          } else {
            // Store in sessionStorage for temporary sessions
            sessionStorage.setItem('adminSessionToken', data.session_token);
            sessionStorage.setItem('adminId', data.admin_id);
            sessionStorage.setItem('adminUsername', data.username);
          }
        }
        router.push('/admin/'); // Redirect to admin dashboard
      } else {
        setError(data.message || 'Operation failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row">
      {/* Full screen background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://moroccogamingexpo.ma/wp-content/uploads/2024/08/MGE-Jour-2-149-1-1024x683.jpg"
          alt="Background"
          layout="fill"
          objectFit="cover"
          priority
          className="select-none"
        />
        {/* Gradient overlays - changed from gray-900 to black */}
        <div className="absolute inset-0 bg-gradient-to-bl from-black/95 via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-l from-black/95 via-black/80 to-transparent"></div>
      </div>

      {/* Left side content - hidden on mobile */}
      <div className="relative z-10 w-full md:w-1/2 p-12 hidden md:flex flex-col justify-center">
        <div className="space-y-4 max-w-xl">
          <div className="mb-6 w-56">
            <Image
              src="https://moroccogamingexpo.ma/wp-content/uploads/2024/02/Logo-MGE-2025-white.svg"
              alt="Gaming Expo"
              width={220}
              height={40}
              className="w-full h-auto"
            />
          </div>

          <h1 className="font-custom tracking-widest text-5xl font-bold text-white leading-tight">
            Tournament
            <br />
            <span className="text-primary">Control Center</span>, Manage
            <br />
            Your Competitions
          </h1>

          <p className="text-white text-sm max-w-md">
            Streamline your tournament operations with our secure management system
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="relative z-10 w-full md:w-1/2 min-h-screen flex flex-col items-center justify-center px-6 py-8">
        {/* Logo container - centered on mobile */}
        <div className="md:hidden w-48 mb-12">
          
        </div>

        <div className="w-full max-w-md">
          <div className="space-y-3 mb-8 text-center md:text-left">
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-wider text-white font-custom leading-tight">
              {isAdminSetup ? 'First-Time Setup' : 'Welcome Back'} <br />
              {isAdminSetup ? 'Administrator' : 'to your dashboard'}<span className="text-primary">.</span>
            </h2>
            <p className="text-white/50 text-sm sm:text-sm">
              {isAdminSetup
                ? 'Create your administrator account to begin organizing tournaments'
                : 'Sign in to access your tournament management tools'}
            </p>
          </div>

          {error && (
            <div className="rounded-lg p-4 mb-6">
              <p className="text-red-500 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
           
            {isAdminSetup && ( 
              <>
              <FloatingLabelInput
                label="Username"
                icon={User}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
              </>
            )}

            {isAdminSetup && (
              <>
                <div>
                  <FloatingLabelInput
                    label="Full Name"
                    icon={User}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>
              </>
            )}
            
            <div>
              <FloatingLabelInput
                label="Email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <FloatingLabelInput
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* {!isAdminSetup && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-black rounded bg-black"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                  Keep me signed in
                </label>
              </div>
            )} */}

            <button
              type="submit"
              className="w-full bg-primary text-base sm:text-[12pt] text-white py-3 font-custom tracking-widest rounded-full hover:bg-primary/60 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray="31.4 31.4"
                      strokeDashoffset="15.7"
                    />
                  </svg>
                  <span className="animate-pulse">Processing...</span>
                </div>
              ) : (
                isAdminSetup ? 'Complete Setup' : 'Access Dashboard'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}