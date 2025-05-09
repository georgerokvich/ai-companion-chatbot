'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  if (!isClient) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Welcome to AI Companion</h1>
        
        <p className="text-xl text-gray-300 mb-8">
          Create, customize, and chat with AI characters. What would you like to do?
        </p>

        <div className="space-y-4">
          <Link 
            href="/my-characters"
            className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-bold shadow-lg transition-all"
          >
            My Characters
          </Link>
          
          <Link 
            href="/characters/new"
            className="block w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-white font-bold shadow-lg transition-all"
          >
            Create New Character
          </Link>
          
          <Link 
            href="/characters"
            className="block w-full px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white font-bold shadow-lg transition-all"
          >
            Browse Characters
          </Link>
        </div>
      </div>
    </div>
  );
}
