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

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ 
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <div 
        ref={modalRef}
        className="w-full max-w-md bg-[#14142a] rounded-lg border border-[#2a2a40] shadow-2xl p-6 animate-fadeIn"
        style={{
          maxWidth: '360px',
          margin: 'auto'
        }}
      >
        <h2 className="text-xl font-bold text-white mb-3">
          {isFirstTime ? 'Personalize Your AI Experience' : 'Edit Your Preferences'}
        </h2>
        
        <p className="text-sm text-gray-300 mb-4">
          It will help to customize your interactions with the AI characters.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="displayName" className="block text-gray-300 text-sm">
              Your Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 text-sm rounded bg-[#1a1a30] text-white border border-[#333345] focus:outline-none focus:border-[#7e3aed]"
            />
          </div>
          
          <div className="space-y-1">
            <label htmlFor="gender" className="block text-gray-300 text-sm">
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded bg-[#1a1a30] text-white border border-[#333345] focus:outline-none focus:border-[#7e3aed] appearance-none"
              style={{ 
                backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em'
              }}
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
          className="w-full mt-5 py-2 rounded text-white font-medium"
          style={{ 
            background: 'linear-gradient(to right, #ff4fa7, #7e3aed)',
            boxShadow: '0 2px 10px rgba(255, 79, 167, 0.3)'
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        
        {!isFirstTime && (
          <button
            onClick={onClose}
            className="w-full mt-3 py-2 rounded text-gray-300 bg-[#1a1a30] border border-[#333345] font-medium"
          >
            Cancel
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

// Import createPortal from 'react-dom' at the top of your file
import { createPortal } from 'react-dom';
