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

  // Prevent body scrolling when modal is open
  useEffect(() => {
    // Save the original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    // Re-enable scrolling on unmount
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

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
    <div 
      id="personalization-modal-overlay"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        padding: '1rem'
      }}
    >
      <div 
        ref={modalRef}
        id="personalization-modal-content"
        style={{
          maxWidth: '360px',
          width: '100%',
          backgroundColor: '#14142a',
          borderRadius: '0.5rem',
          border: '1px solid #2a2a40',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          padding: '1.5rem',
          margin: '0 auto',
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'white', marginBottom: '0.75rem' }}>
          {isFirstTime ? 'Personalize Your AI Experience' : 'Edit Your Preferences'}
        </h2>
        
        <p style={{ fontSize: '0.875rem', color: '#d1d5db', marginBottom: '1rem' }}>
          It will help to customize your interactions with the AI characters.
        </p>
        
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label 
              htmlFor="displayName" 
              style={{ display: 'block', color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem' }}
            >
              Your Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              style={{ 
                width: '100%', 
                padding: '0.5rem 0.75rem', 
                fontSize: '0.875rem', 
                borderRadius: '0.25rem',
                backgroundColor: '#1a1a30',
                color: 'white',
                border: '1px solid #333345',
                outline: 'none'
              }}
            />
          </div>
          
          <div>
            <label 
              htmlFor="gender" 
              style={{ display: 'block', color: '#d1d5db', fontSize: '0.875rem', marginBottom: '0.25rem' }}
            >
              Gender
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem 0.75rem', 
                  fontSize: '0.875rem', 
                  borderRadius: '0.25rem',
                  backgroundColor: '#1a1a30',
                  color: 'white',
                  border: '1px solid #333345',
                  outline: 'none',
                  appearance: 'none',
                  paddingRight: '2rem'
                }}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unspecified">Prefer not to say</option>
              </select>
              <div style={{ 
                position: 'absolute',
                top: '50%',
                right: '0.75rem',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}>
                <svg 
                  width="12" 
                  height="12" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ color: '#9ca3af' }}
                >
                  <path 
                    d="M2 4L6 8L10 4" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          style={{ 
            width: '100%', 
            padding: '0.5rem 0',
            borderRadius: '0.25rem',
            color: 'white',
            fontWeight: '500',
            background: 'linear-gradient(to right, #ff4fa7, #7e3aed)',
            border: 'none',
            cursor: isSaving ? 'default' : 'pointer',
            opacity: isSaving ? 0.7 : 1,
            marginBottom: '0.5rem'
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        
        {!isFirstTime && (
          <button
            onClick={onClose}
            style={{ 
              width: '100%', 
              padding: '0.5rem 0',
              borderRadius: '0.25rem',
              color: '#d1d5db',
              fontWeight: '500',
              backgroundColor: '#1a1a30',
              border: '1px solid #333345',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
