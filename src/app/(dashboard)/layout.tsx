'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { trpc } from '@/lib/trpc/client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const charactersQuery = trpc.character.getAll.useQuery(undefined, {
    enabled: !!user,
  });

  useEffect(() => {
    const checkUser = async () => {
      // First check localStorage for demo auth
      const isLoggedIn = localStorage.getItem('isLoggedIn');
      const userEmail = localStorage.getItem('userEmail');
      
      if (isLoggedIn === 'true' && userEmail) {
        // If localStorage has login info, use that for demo mode
        setUser({ email: userEmail, name: 'Demo User' });
        setLoading(false);
        return;
      }
      
      // If not in localStorage, check Supabase session
      const { data } = await supabase.auth.getSession();
      
      if (!data.session) {
        router.push('/login');
        return;
      }
      
      setUser(data.session.user);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed p-4 bg-purple-500 rounded-full shadow-lg md:hidden bottom-6 right-6 z-20"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-xl transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-purple-600">AI Companion</h1>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Your Characters</h2>
            
            <div className="space-y-2">
              {charactersQuery.isLoading ? (
                <p className="text-gray-500">Loading characters...</p>
              ) : charactersQuery.error ? (
                <p className="text-red-500">Error loading characters</p>
              ) : charactersQuery.data?.length === 0 ? (
                <p className="text-gray-500">No characters yet</p>
              ) : (
                charactersQuery.data?.map((character) => (
                  <Link
                    key={character.id}
                    href={`/chat/${character.id}`}
                    className={`block p-2 rounded-md transition ${
                      pathname === `/chat/${character.id}`
                        ? 'bg-purple-100 text-purple-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {character.name}
                  </Link>
                ))
              )}
            </div>

            <div className="pt-4 mt-6 border-t">
              <Link
                href="/characters/new"
                className="flex items-center p-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-md hover:from-purple-600 hover:to-pink-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Character
              </Link>
            </div>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">{user?.email}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
