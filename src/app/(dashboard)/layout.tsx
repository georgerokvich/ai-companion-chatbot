'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { trpc } from '@/lib/trpc/client';
import { useAuth } from '@/lib/hooks/useAuth';
import './dashboard-style.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const charactersQuery = trpc.character.getAll.useQuery(undefined, {
    enabled: !!user,
  });
  
  // Get user preferences for personalization
  const { data: userPreferences } = trpc.user.getPreferences.useQuery(undefined, {
    enabled: !!user,
  });

  useEffect(() => {
    const checkUser = async () => {
      // Check localStorage for demo auth (this should always work in demo mode)
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userEmail = localStorage.getItem('userEmail');
      
      if (isLoggedIn === 'true' && userEmail) {
        // If localStorage has login info, use that for demo mode
        setUser({ 
          id: 'demo-user-id',
          email: userEmail, 
          name: userEmail.split('@')[0] 
        });
        setLoading(false);
        return;
      }
      
      // If not in localStorage, redirect to login
      router.push('/login');
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: 'var(--background)' }}>
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Mobile sidebar toggle */}
      <div
        className="sidebar-toggle"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </div>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-logo">AI Companion</h1>
        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <h2 className="sidebar-section-title">Your Characters</h2>
            
            <div className="space-y-2">
              {charactersQuery.isLoading ? (
                <p style={{ color: 'var(--gray-400)' }}>Loading characters...</p>
              ) : charactersQuery.error ? (
                <p style={{ color: 'var(--primary)' }}>Error loading characters</p>
              ) : charactersQuery.data?.length === 0 ? (
                <p style={{ color: 'var(--gray-400)' }}>No characters yet</p>
              ) : (
                charactersQuery.data?.map((character) => (
                  <Link
                    key={character.id}
                    href={`/chat/${character.id}`}
                    className={`sidebar-link ${
                      pathname === `/chat/${character.id}` ? 'active' : ''
                    }`}
                  >
                    {character.name}
                  </Link>
                ))
              )}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link
                href="/characters/new"
                className="btn btn-primary"
                style={{ 
                  width: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Character
              </Link>
            </div>
          </div>
          
          <div className="sidebar-section">
            <h2 className="sidebar-section-title">Navigation</h2>
            <Link href="/dashboard" className={`sidebar-link ${pathname === '/dashboard' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </Link>
            <Link href="/my-characters" className={`sidebar-link ${pathname === '/my-characters' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              My Characters
            </Link>
            <Link href="/settings" className={`sidebar-link ${pathname === '/settings' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
            <Link href="/" className="sidebar-link">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home Page
            </Link>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-info">
            <div>
              <p className="user-email">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="btn btn-secondary"
            style={{ 
              width: '100%', 
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Log Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="content-area">
        {children}
      </div>
    </div>
  );
}
