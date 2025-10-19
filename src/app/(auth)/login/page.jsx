'use client';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import FloatingLabelInput from '@/app/components/input/input';
import { Mail, User } from 'lucide-react';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useQuery, useMutation } from '@tanstack/react-query';
import { GlowEffectContext } from '@/context/GlowEffectContext';

export default function Login() {
  const [error, setError] = useState('');
  const router = useRouter();
  const { setshowGlow } = useContext(GlowEffectContext);
  // Validation schemas
  const loginSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Invalid email format'),
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
        'Include uppercase, lowercase, number, and special character for stronger security',
      ),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    fullName: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters'),
  });

  // Query: Check if admin setup is needed
  const { data: adminSetupData, isLoading: isSetupLoading } = useQuery({
    queryKey: ['adminSetup'],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin_setup.php?check_only=true`,
      );
      if (!res.ok) throw new Error('Failed to check admin setup');
      return res.json();
    },
    staleTime: 1000 * 60, // 1 min
  });

  const isAdminSetup = adminSetupData?.isEmpty ?? true;

  // Form
  const formSchema = isAdminSetup ? setupSchema : loginSchema;
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: isAdminSetup
      ? {
          username: '',
          password: 'Admin@00',
          email: 'admin@gmail.com',
          fullName: '',
        }
      : {
          email: 'admin@gmail.com',
          password: 'Admin@00',
        },
  });

  // Query: Verify token on mount
  useEffect(() => {
    const savedToken = localStorage.getItem('adminSessionToken');
    if (savedToken) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify_token.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_token: savedToken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) router.push('/');
          else {
            localStorage.removeItem('adminSessionToken');
            localStorage.removeItem('adminId');
            localStorage.removeItem('adminUsername');
          }
        });
    }
    // Reset form when isAdminSetup changes
    reset(
      false
        ? {
            username: '',
            password: 'Admin@00',
            email: 'admin@gmail.com',
            fullName: '',
          }
        : {
            email: 'admin@gmail.com',
            password: 'Admin@00',
          },
    );
    // eslint-disable-next-line
  }, [isAdminSetup, reset, router]);

  // Mutation: Submit form
  const { mutate, isPending } = useMutation({
    mutationFn: async (formData) => {
      setError('');
      const url = isAdminSetup
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin_setup.php`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/admin_login.php`;

      const requestBody = isAdminSetup
        ? {
            username: formData.username,
            password: formData.password,
            email: formData.email,
            full_name: formData.fullName,
          }
        : {
            email: formData.email,
            password: formData.password,
            remember_me: formData.rememberMe ?? true,
          };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || `HTTP error! status: ${response.status}`);
      return data;
    },
    onSuccess: (data, formData) => {
      setshowGlow(true);
      if (data.success || data.message === 'Admin created successfully') {
        if (!isAdminSetup) {
          if (formData.rememberMe ?? true) {
            localStorage.setItem('adminSessionToken', data.session_token);
            localStorage.setItem('adminId', data.admin_id);
            localStorage.setItem('adminUsername', data.username);
          } else {
            sessionStorage.setItem('adminSessionToken', data.session_token);
            sessionStorage.setItem('adminId', data.admin_id);
            sessionStorage.setItem('adminUsername', data.username);
          }
        }
        router.push('/admin/');
      } else {
        setError(data.message || 'Operation failed');
      }
    },
    onError: (err) => {
      setError(err.message || 'An error occurred. Please try again.');
    },
  });

  if (isSetupLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <span className="text-white">Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-black/80">
      {/* Full screen background image */}
    

      {/* Left side content - hidden on mobile */}
      <div className="relative z-10 w-full md:w-[45%] lg:w-[40%] px-6 sm:px-10 md:px-12 py-12 flex flex-col justify-center bg-secondary">
        <div className="space-y-4 max-w-xl">
          {!isAdminSetup && (
            <div className=" absolute top-8  mb-6 w-32 xl:w-44">
              <Image
                src="/images/logo-gamius-white.png"
                alt="Gaming Expo"
                width={120}
                height={40}
                className="w-full h-auto"
              />
            </div>
          )}

          <div className="w-full max-w-md">
            <div className="space-y-16 mb-8 text-center md:text-left ml-0 md:ml-2 lg:ml-3">
              <h2 className="text-xl sm:text-2xl md:text-3xl  tracking-wider text-white font-custom leading-tight">
                {isAdminSetup ? 'First-Time Setup' : 'Welcome To Gamius Area'} <br />
                {isAdminSetup ? 'Administrator' : 'to your dashboard'}
                <span className="text-[#03C7FD] font-ea-football"> .</span>
                <p className="text-white/30 text-[0.65rem]  font-ea-football mt-1">
                  {isAdminSetup
                    ? 'Create your administrator account to begin organizing tournaments'
                    : 'Sign in to access your tournament management tools'}
                </p>
              </h2>
            </div>

            {error && (
              <div className="rounded-lg p-4 mb-6">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-8 mt-16  ">
              {isAdminSetup && (
                <>
                  <FloatingLabelInput label="Username" icon={User} {...register('username')} />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
                  )}
                </>
              )}

              {isAdminSetup && (
                <div>
                  <FloatingLabelInput label="Full Name" icon={User} {...register('fullName')} />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                  )}
                </div>
              )}

              <div>
                <FloatingLabelInput label="Email" type="email" icon={Mail} {...register('email')} />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <FloatingLabelInput label="Password" type="password" {...register('password')} />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Uncomment if you want to use remember me */}
              {!isAdminSetup && (
                <div className="flex items-center justify-between lg:ml-3">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-black rounded bg-black"
                      {...register('rememberMe')}
                      defaultChecked
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-white/70 font-ea-football"
                    >
                      Keep me signed in
                    </label>
                  </div>

                  {/* Forgot password link */}
                  <button
                    type="button"
                    onClick={() => router.push('/forgot-password')}
                    className="text-sm text-primary hover:underline font-ea-football font-medium"
                  >
                    Forgot Password <span className="font-mono text-primary">?</span>
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-[50%]  bg-primary text-base sm:text-[12pt] text-black px-3 py-2.5 font-custom rounded hover:bg-primtext-primary/90 transition-colors mt-8 disabled:opacity-50 disabled:cursor-not-allowed "
                disabled={isPending}
              >
                {isPending ? (
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
                ) : isAdminSetup ? (
                  'Complete Setup'
                ) : (
                  <div>Sign In</div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Overlay between left and right sections */}
      <div className="absolute top-0 left-[45%] md:left-[45%] lg:left-[40%] h-full w-2 z-20 pointer-events-none">
        <div className="h-full w-full bg-gradient-to-r from-[#11243D]/90 via-[#11243D]/60 to-transparent"></div>
      </div>

      {/* Right side - Background Image Only */}
      <div className="relative w-full md:w-[60%] h-screen">
        {/* Background image */}
        <img
          src="https://moroccogamingexpo.ma/wp-content/uploads/2025/08/1V2A0517-scaled.jpg"
          alt="Gaming Background"
          fill
          className="object-cover select-none h-screen opacity-60"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[#11243D]/10"></div>
      </div>
    </div>
  );
}
