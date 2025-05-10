// Local storage utilities for user preferences

const STORAGE_KEYS = {
  USER_PREFERENCES: 'ai-companion-user-preferences',
  LOGIN_STATUS: 'isLoggedIn',
  USER_EMAIL: 'userEmail',
};

export type UserPreferences = {
  displayName?: string;
  gender?: 'male' | 'female' | 'other' | 'unspecified';
  hasCompletedOnboarding?: boolean;
};

// Get user preferences from local storage
export const getUserPreferencesFromStorage = (): UserPreferences | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const storedPreferences = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (storedPreferences) {
      return JSON.parse(storedPreferences);
    }
  } catch (error) {
    console.error('Error getting user preferences from storage:', error);
  }
  
  return null;
};

// Save user preferences to local storage
export const saveUserPreferencesToStorage = (preferences: UserPreferences): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error saving user preferences to storage:', error);
  }
};

// Clear user preferences from local storage
export const clearUserPreferencesFromStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
  } catch (error) {
    console.error('Error clearing user preferences from storage:', error);
  }
};

// Get login status from local storage
export const getLoginStatusFromStorage = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    return localStorage.getItem(STORAGE_KEYS.LOGIN_STATUS) === 'true';
  } catch (error) {
    console.error('Error getting login status from storage:', error);
    return false;
  }
};

// Save login status to local storage
export const saveLoginStatusToStorage = (isLoggedIn: boolean): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEYS.LOGIN_STATUS, isLoggedIn ? 'true' : 'false');
  } catch (error) {
    console.error('Error saving login status to storage:', error);
  }
};
