'use client';

import React, { useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { useRouter } from 'next/navigation';
import { saveUserPreferencesToStorage } from '@/lib/utils/storage';

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
    onSuccess: (data) => {
      // Save preferences to local storage
      saveUserPreferencesToStorage({
        displayName,
        gender: gender as 'male' | 'female' | 'other' | 'unspecified',
        hasCompletedOnboarding: true
      });
      
      onClose();
    },
  });
  
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateUserPreferences.mutateAsync({
        displayName,
        gender: gender as 'male' | 'female' | 'other' | 'unspecified',
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
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0, 0, 0, 0.75)' }}>
      <div className="w-full max-w-md p-6 rounded-xl shadow-2xl" 
           style={{ 
             background: 'linear-gradient(to bottom, #1a1a2e, #0f0f1d)', 
             border: '1px solid rgba(255, 255, 255, 0.1)'
           }}>
        <h2 className="text-2xl font-bold text-white mb-4">
          {isFirstTime ? 'Personalize Your AI Experience' : 'Edit Your Preferences'}
        </h2>
        
        <p className="text-gray-400 mb-6">
          It will help to customize your interactions with the AI characters.
        </p>
        
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-gray-300 text-sm font-medium">
              Your Name
            </label>
            <div className="relative">
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg text-white"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(4px)',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="gender" className="block text-gray-300 text-sm font-medium">
              Gender
            </label>
            <div className="relative">
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="appearance-none w-full px-4 py-3 rounded-lg text-white"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.07)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(4px)',
                  outline: 'none'
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unspecified">Prefer not to say</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(to right, #ff4fa7, #7e3aed)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(255, 79, 167, 0.3)'
          }}
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
            className="w-full mt-3 py-3 rounded-lg font-medium transition-all"
            style={{ 
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffffaa'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
