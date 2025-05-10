'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const modalRef = useRef<HTMLDivElement>(null);
  
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

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node) && !isFirstTime) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isFirstTime]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center" 
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
      <div 
        ref={modalRef}
        className="modal-container w-full max-w-xs p-6 rounded-xl shadow-lg animate-fadeIn"
        style={{
          background: 'rgba(12, 12, 23, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h2 className="text-xl font-bold text-white mb-2">
          {isFirstTime ? 'Personalize Your AI Experience' : 'Edit Your Preferences'}
        </h2>
        
        <p className="text-xs text-gray-400 mb-4">
          It will help to customize your interactions with the AI characters.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="displayName" className="block text-gray-300 text-xs">
              Your Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 text-sm rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="gender" className="block text-gray-300 text-xs">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-purple-500 appearance-none"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="unspecified">Prefer not to say</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full mt-4 py-2 rounded text-sm font-medium text-white bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 focus:outline-none transition"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        
        {!isFirstTime && (
          <button
            onClick={onClose}
            className="w-full mt-2 py-2 rounded text-sm font-medium text-gray-300 bg-transparent border border-gray-700 hover:bg-gray-800 focus:outline-none transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
