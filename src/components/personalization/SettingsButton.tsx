'use client';

import { useState, useEffect } from 'react';
import { PersonalizationModal } from './PersonalizationModal';
import { getUserPreferencesFromStorage } from '@/lib/utils/storage';

interface SettingsButtonProps {
  displayName?: string;
  gender?: string;
}

export const SettingsButton: React.FC<SettingsButtonProps> = ({ 
  displayName = '',
  gender = 'unspecified'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localDisplayName, setLocalDisplayName] = useState(displayName);
  const [localGender, setLocalGender] = useState(gender);
  
  useEffect(() => {
    // Get preferences from local storage
    const storedPreferences = getUserPreferencesFromStorage();
    
    if (storedPreferences) {
      if (storedPreferences.displayName) {
        setLocalDisplayName(storedPreferences.displayName);
      }
      if (storedPreferences.gender) {
        setLocalGender(storedPreferences.gender);
      }
    }
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors text-gray-300"
        aria-label="Personalization settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
        <span>Personalization</span>
      </button>

      {isModalOpen && (
        <PersonalizationModal 
          onClose={() => setIsModalOpen(false)} 
          initialDisplayName={localDisplayName}
          initialGender={localGender}
        />
      )}
    </>
  );
};
