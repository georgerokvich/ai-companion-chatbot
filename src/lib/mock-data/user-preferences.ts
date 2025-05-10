// Mock user preferences for the demo

export const mockUserPreferences = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  displayName: '',
  gender: 'unspecified',
  hasCompletedOnboarding: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

// Function to update mock user preferences
export const updateMockUserPreferences = (
  newPreferences: {
    displayName?: string;
    gender?: 'male' | 'female' | 'other' | 'unspecified';
    hasCompletedOnboarding?: boolean;
  }
) => {
  // Update the mock user preferences
  Object.assign(mockUserPreferences, {
    ...newPreferences,
    updatedAt: new Date()
  });
  
  return mockUserPreferences;
};
