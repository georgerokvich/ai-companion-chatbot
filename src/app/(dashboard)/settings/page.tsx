'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';
import { getUserPreferencesFromStorage, saveUserPreferencesToStorage } from '@/lib/utils/storage';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('unspecified');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  
  const { data: userPreferences, isLoading } = trpc.user.getPreferences.useQuery();
  
  const updateUserPreferences = trpc.user.updatePreferences.useMutation({
    onSuccess: (data) => {
      saveUserPreferencesToStorage({
        displayName,
        gender: gender as 'male' | 'female' | 'other' | 'unspecified',
        hasCompletedOnboarding: true
      });
      
      setSaveMessage('Settings saved successfully!');
      
      // Clear the message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    },
  });
  
  useEffect(() => {
    // Get user email from localStorage
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) {
      setEmail(userEmail);
    }
    
    // Get preferences from local storage first
    const storedPreferences = getUserPreferencesFromStorage();
    
    if (storedPreferences) {
      if (storedPreferences.displayName) {
        setDisplayName(storedPreferences.displayName);
      }
      if (storedPreferences.gender) {
        setGender(storedPreferences.gender);
      }
    }
    
    // Update with server data if available
    if (userPreferences) {
      if (userPreferences.displayName) {
        setDisplayName(userPreferences.displayName);
      }
      if (userPreferences.gender) {
        setGender(userPreferences.gender);
      }
    }
    
    // Generate a placeholder avatar based on email
    if (userEmail) {
      const hash = userEmail.trim().toLowerCase();
      setAvatarUrl(`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(hash)}`);
    }
  }, [userPreferences]);
  
  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      await updateUserPreferences.mutateAsync({
        displayName,
        gender: gender as 'male' | 'female' | 'other' | 'unspecified',
        hasCompletedOnboarding: true
      });
    } catch (error) {
      console.error('Failed to save preferences:', error);
      setSaveMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      
      {/* Settings Tabs */}
      <div className="flex border-b border-gray-800 mb-6">
        <button 
          className={`pb-3 px-4 font-medium ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button 
          className={`pb-3 px-4 font-medium ${activeTab === 'personalization' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('personalization')}
        >
          Personalization
        </button>
        <button 
          className={`pb-3 px-4 font-medium ${activeTab === 'appearance' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-gray-300'}`}
          onClick={() => setActiveTab('appearance')}
        >
          Appearance
        </button>
      </div>
      
      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
              
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm disabled:opacity-70"
                  />
                  <p className="mt-1 text-xs text-gray-500">Your email address cannot be changed</p>
                </div>
                
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-400 mb-1">
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:border-primary focus:outline-none"
                  />
                  <p className="mt-1 text-xs text-gray-500">This name will be used by AI companions</p>
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-400 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:border-primary focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="unspecified">Prefer not to say</option>
                  </select>
                </div>
                
                <div className="pt-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none disabled:opacity-70"
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  {saveMessage && (
                    <p className={`mt-2 text-sm ${saveMessage.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                      {saveMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Profile Picture</h2>
              
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-800 border-4 border-gray-700 mb-4">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <button
                  className="px-4 py-2 bg-gray-800 text-gray-300 border border-gray-700 rounded-md text-sm hover:bg-gray-700"
                  onClick={() => alert('Profile picture upload will be available in a future update!')}
                >
                  Change Picture
                </button>
                
                <p className="mt-4 text-xs text-gray-500 text-center">
                  Supported formats: JPG, PNG, GIF<br />
                  Maximum size: 5MB
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Personalization Tab Content */}
      {activeTab === 'personalization' && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">AI Interaction Settings</h2>
          
          <div className="space-y-5">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-400 mb-1">
                Your Name
              </label>
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:border-primary focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">AI companions will use this name to address you</p>
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-400 mb-1">
                Gender
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:border-primary focus:outline-none"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="unspecified">Prefer not to say</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">This helps AI companions personalize interactions</p>
            </div>
            
            <div className="pt-3">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-5 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none disabled:opacity-70"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              
              {saveMessage && (
                <p className={`mt-2 text-sm ${saveMessage.includes('Failed') ? 'text-red-400' : 'text-green-400'}`}>
                  {saveMessage}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Appearance Tab Content */}
      {activeTab === 'appearance' && (
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Appearance Settings</h2>
          
          <p className="text-gray-400 mb-6">
            Customize how the app looks and feels. More appearance options coming soon!
          </p>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">
                Theme
              </label>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input 
                    type="radio" 
                    id="theme-dark" 
                    name="theme" 
                    value="dark"
                    checked={true}
                    className="peer absolute w-0 h-0 opacity-0"
                    readOnly
                  />
                  <label 
                    htmlFor="theme-dark" 
                    className="flex flex-col items-center p-4 bg-gray-800 border-2 border-primary rounded-lg cursor-pointer peer-checked:bg-gray-700"
                  >
                    <div className="w-full h-24 mb-3 bg-gray-900 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-400">Dark Theme Preview</span>
                    </div>
                    <span className="text-sm font-medium text-white">Dark Theme</span>
                  </label>
                </div>
                
                <div className="relative">
                  <input 
                    type="radio" 
                    id="theme-light" 
                    name="theme" 
                    value="light"
                    disabled
                    className="peer absolute w-0 h-0 opacity-0"
                  />
                  <label 
                    htmlFor="theme-light" 
                    className="flex flex-col items-center p-4 bg-gray-800 border-2 border-transparent rounded-lg cursor-not-allowed opacity-50"
                  >
                    <div className="w-full h-24 mb-3 bg-gray-200 rounded-md flex items-center justify-center">
                      <span className="text-xs text-gray-600">Light Theme Preview</span>
                    </div>
                    <span className="text-sm font-medium text-white">Light Theme (Coming Soon)</span>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="pt-3">
              <button
                className="px-5 py-2 bg-gray-800 text-gray-400 border border-gray-700 rounded-md cursor-not-allowed opacity-50"
                disabled
              >
                Save Appearance
              </button>
              <p className="mt-2 text-xs text-gray-500">
                Additional appearance options will be available in future updates
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
