'use client';
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import './globals.css'; // adjust the path if necessary
import 'react-quill/dist/quill.snow.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '@/app/font.css';
import ToastProvider from '@/utils/ToastProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import GlowEffectContextProvider from '@/context/GlowEffectContext';
export const MyApp = ({ children }) => {
  return (
    <>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {children}
    </>
  );
};

export default function RootLayout({ children }) {
  const queryClient = new QueryClient();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <QueryClientProvider client={queryClient}>
          <GlowEffectContextProvider>
            <ToastProvider>
              <MyApp children={children} />
            </ToastProvider>
          </GlowEffectContextProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
