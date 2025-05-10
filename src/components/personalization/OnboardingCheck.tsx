'use client';

import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { PersonalizationModal } from './PersonalizationModal';
import { getUserPreferencesFromStorage } from '@/lib/utils/storage';

export const OnboardingCheck = () => {
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const { data: userData, isLoading } = trpc.user.getPreferences.useQuery();
  
  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);
  
  useEffect(() => {
    if (!isMounted) return;
    
    // Set a timeout to prevent immediate modal opening
    const timer = setTimeout(() => {
      // First check if there are preferences in local storage
      const storedPreferences = getUserPreferencesFromStorage();
      
      if (storedPreferences && storedPreferences.hasCompletedOnboarding) {
        // If we have completed onboarding in local storage, don't show modal
        return;
      }
      
      // Otherwise, check the server data
      if (!isLoading && userData && !userData.hasCompletedOnboarding) {
        setShowModal(true);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [userData, isLoading, isMounted]);
  
  // Don't render anything until we've checked preferences or if component is not mounted
  if (isLoading || !isMounted) {
    return null;
  }
  
  return showModal ? (
    <PersonalizationModal
      onClose={() => setShowModal(false)}
      initialDisplayName={userData?.displayName || ''}
      initialGender={userData?.gender || 'unspecified'}
      isFirstTime={true}
    />
  ) : null;
};
