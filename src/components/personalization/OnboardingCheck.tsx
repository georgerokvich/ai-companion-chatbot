'use client';

import { useEffect, useState } from 'react';
import { trpc } from '@/lib/trpc/client';
import { PersonalizationModal } from './PersonalizationModal';
import { getUserPreferencesFromStorage } from '@/lib/utils/storage';

export const OnboardingCheck = () => {
  const [showModal, setShowModal] = useState(false);
  
  const { data: userData, isLoading } = trpc.user.getPreferences.useQuery();
  
  useEffect(() => {
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
  }, [userData, isLoading]);
  
  if (isLoading || !showModal) {
    return null;
  }
  
  return (
    <PersonalizationModal
      onClose={() => setShowModal(false)}
      initialDisplayName={userData?.displayName || ''}
      initialGender={userData?.gender || 'unspecified'}
      isFirstTime={true}
    />
  );
};
