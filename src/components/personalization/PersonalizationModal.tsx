'use client';

import React, { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';

interface PersonalizationModalProps {
  onClose: () => void;
  initialDisplayName?: string;
  initialGender?: string;
  isFirstTime?: boolean;
}

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({ 
  onClose, 
  initialDisplayName = '',
  initialGender = 'unspecified',
  isFirstTime = false
}) => {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [gender, setGender] = useState(initialGender);
  const [isSaving, setIsSaving] = useState(false);
  
  const updateUserPreferences = trpc.user.updatePreferences.useMutation({
    onSuccess: () => {
      onClose();
    },
  });
  
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserPreferences.mutateAsync({
        displayName,
        gender,
        hasCompletedOnboarding: true
      });
      
      // Refresh the page to reflect changes
      router.refresh();
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-md p-6 border border-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold text-white mb-4">
          {isFirstTime ? 'Personalize Your AI Experience' : 'Edit Your Preferences'}
        </h2>
        
        <p className="text-gray-400 mb-6">
          It will help to customize your interactions with the AI characters.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-gray-300 text-sm">
              Your Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="bg-gray-800 text-white pl-10 pr-4 py-2 rounded-md w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-gray-300 text-sm">
              Gender
            </label>
            <div className="relative">
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="bg-gray-800 text-white px-4 py-2 rounded-md w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent appearance-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unspecified">Prefer not to say</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="mt-6 w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 px-4 rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 transition-colors disabled:opacity-70 flex items-center justify-center"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : 'Save'}
        </button>
        
        {!isFirstTime && (
          <button
            onClick={onClose}
            className="mt-3 w-full bg-transparent border border-gray-600 text-gray-300 py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
