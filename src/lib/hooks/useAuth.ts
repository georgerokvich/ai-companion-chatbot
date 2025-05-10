'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { saveLoginStatusToStorage, clearUserPreferencesFromStorage } from '@/lib/utils/storage';

// Hook for authentication operations
export const useAuth = () => {
  const router = useRouter();

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Save login status to storage
      saveLoginStatusToStorage(true);
      
      // Save user email to storage (for demo)
      localStorage.setItem('userEmail', email);
      
      // Redirect to dashboard
      router.push('/dashboard');
      
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      
      // Clear all auth-related data from storage
      saveLoginStatusToStorage(false);
      localStorage.removeItem('userEmail');
      clearUserPreferencesFromStorage();
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    signIn,
    signOut,
  };
};
