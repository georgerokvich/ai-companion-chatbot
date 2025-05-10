'use client';

import { useState, useEffect } from 'react';
import { trpc } from '@/lib/trpc/client';
import { getUserPreferencesFromStorage, saveUserPreferencesToStorage } from '@/lib/utils/storage';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState('');
  const [gender, setGender] = useState('unspecified');
  const [email, setEmail] = useState('');
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

  const tabAnimationProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  const generateInitials = (name: string) => {
    return name 
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : email ? email.substring(0, 2).toUpperCase() : 'AI';
  };

  return (
    <div style={{ 
      padding: '2rem 1.5rem',
      maxWidth: '1000px',
      margin: '0 auto',
      color: 'white'
    }}>
      <h1 style={{ 
        fontSize: '1.75rem', 
        fontWeight: 'bold', 
        marginBottom: '1.5rem',
        background: 'linear-gradient(to right, #ff4fa7, #7e3aed)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline-block'
      }}>
        Settings
      </h1>
      
      {/* Settings Tabs */}
      <div style={{ 
        display: 'flex',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '1.5rem',
        gap: '1rem'
      }}>
        <button 
          onClick={() => setActiveTab('profile')}
          style={{
            padding: '0.75rem 1rem',
            fontWeight: '500',
            fontSize: '0.95rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'profile' ? '#ff4fa7' : 'rgba(255, 255, 255, 0.6)',
            borderBottom: activeTab === 'profile' ? '2px solid #ff4fa7' : '2px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          Profile
        </button>
        <button 
          onClick={() => setActiveTab('personalization')}
          style={{
            padding: '0.75rem 1rem',
            fontWeight: '500',
            fontSize: '0.95rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'personalization' ? '#ff4fa7' : 'rgba(255, 255, 255, 0.6)',
            borderBottom: activeTab === 'personalization' ? '2px solid #ff4fa7' : '2px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          Personalization
        </button>
        <button 
          onClick={() => setActiveTab('appearance')}
          style={{
            padding: '0.75rem 1rem',
            fontWeight: '500',
            fontSize: '0.95rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: activeTab === 'appearance' ? '#ff4fa7' : 'rgba(255, 255, 255, 0.6)',
            borderBottom: activeTab === 'appearance' ? '2px solid #ff4fa7' : '2px solid transparent',
            transition: 'all 0.2s ease'
          }}
        >
          Appearance
        </button>
      </div>
      
      {/* Profile Tab Content */}
      {activeTab === 'profile' && (
        <motion.div 
          {...tabAnimationProps}
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
            gap: '1.5rem'
          }}
        >
          <div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.25rem',
                color: 'white'
              }}>
                Profile Information
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label 
                    htmlFor="email" 
                    style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.7)', 
                      marginBottom: '0.375rem' 
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    style={{ 
                      width: '100%', 
                      padding: '0.625rem 0.875rem', 
                      background: 'rgba(0, 0, 0, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.375rem',
                      color: 'rgba(255, 255, 255, 0.7)',
                      fontSize: '0.875rem',
                      opacity: 0.8
                    }}
                  />
                  <p style={{ 
                    marginTop: '0.375rem', 
                    fontSize: '0.75rem', 
                    color: 'rgba(255, 255, 255, 0.5)' 
                  }}>
                    Your email address cannot be changed
                  </p>
                </div>
                
                <div>
                  <label 
                    htmlFor="displayName" 
                    style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.7)', 
                      marginBottom: '0.375rem' 
                    }}
                  >
                    Display Name
                  </label>
                  <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your name"
                    style={{ 
                      width: '100%', 
                      padding: '0.625rem 0.875rem', 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '0.375rem',
                      color: 'white',
                      fontSize: '0.875rem'
                    }}
                  />
                  <p style={{ 
                    marginTop: '0.375rem', 
                    fontSize: '0.75rem', 
                    color: 'rgba(255, 255, 255, 0.5)' 
                  }}>
                    This name will be used by AI companions
                  </p>
                </div>
                
                <div>
                  <label 
                    htmlFor="gender" 
                    style={{ 
                      display: 'block', 
                      fontSize: '0.875rem', 
                      fontWeight: '500',
                      color: 'rgba(255, 255, 255, 0.7)', 
                      marginBottom: '0.375rem' 
                    }}
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
                        padding: '0.625rem 0.875rem', 
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '0.375rem',
                        color: 'white',
                        fontSize: '0.875rem',
                        appearance: 'none'
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
                      right: '0.875rem', 
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none'
                    }}>
                      <svg 
                        width="10" 
                        height="6" 
                        viewBox="0 0 10 6" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path 
                          d="M1 1L5 5L9 1" 
                          stroke="white" 
                          strokeOpacity="0.5" 
                          strokeWidth="1.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div style={{ paddingTop: '0.5rem' }}>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{ 
                      padding: '0.625rem 1.25rem',
                      background: 'linear-gradient(to right, #ff4fa7, #7e3aed)',
                      color: 'white',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: isSaving ? 'default' : 'pointer',
                      opacity: isSaving ? 0.7 : 1,
                      transition: 'all 0.2s ease',
                      boxShadow: '0 4px 12px rgba(126, 58, 237, 0.2)'
                    }}
                  >
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  {saveMessage && (
                    <p style={{ 
                      marginTop: '0.75rem', 
                      fontSize: '0.875rem', 
                      color: saveMessage.includes('Failed') ? '#f87171' : '#4ade80',
                      fontWeight: '500'
                    }}>
                      {saveMessage}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '0.75rem',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)'
            }}>
              <h2 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                marginBottom: '1.25rem',
                color: 'white'
              }}>
                Profile Picture
              </h2>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{ 
                  width: '7rem',
                  height: '7rem',
                  borderRadius: '50%',
                  background: displayName 
                    ? 'linear-gradient(135deg, #ff4fa7, #7e3aed)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  fontSize: '2rem',
                  fontWeight: 'bold',
                  color: 'white',
                  border: '4px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                }}>
                  {generateInitials(displayName)}
                </div>
                
                <button
                  style={{ 
                    padding: '0.625rem 1.25rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => alert('Profile picture upload will be available soon!')}
                >
                  Change Picture
                </button>
                
                <p style={{ 
                  marginTop: '1rem',
                  fontSize: '0.75rem',
                  color: 'rgba(255, 255, 255, 0.5)',
                  textAlign: 'center',
                  lineHeight: '1.5'
                }}>
                  Supported formats: JPG, PNG, GIF<br />
                  Maximum size: 5MB
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Personalization Tab Content */}
      {activeTab === 'personalization' && (
        <motion.div 
          {...tabAnimationProps}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1.25rem',
            color: 'white'
          }}>
            AI Interaction Settings
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '32rem' }}>
            <div>
              <label 
                htmlFor="displayName-personalization" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.7)', 
                  marginBottom: '0.375rem' 
                }}
              >
                Your Name
              </label>
              <input
                id="displayName-personalization"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                style={{ 
                  width: '100%', 
                  padding: '0.625rem 0.875rem', 
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.375rem',
                  color: 'white',
                  fontSize: '0.875rem'
                }}
              />
              <p style={{ 
                marginTop: '0.375rem', 
                fontSize: '0.75rem', 
                color: 'rgba(255, 255, 255, 0.5)' 
              }}>
                AI companions will use this name to address you
              </p>
            </div>
            
            <div>
              <label 
                htmlFor="gender-personalization" 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.7)', 
                  marginBottom: '0.375rem' 
                }}
              >
                Gender
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  id="gender-personalization"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{ 
                    width: '100%', 
                    padding: '0.625rem 0.875rem', 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.375rem',
                    color: 'white',
                    fontSize: '0.875rem',
                    appearance: 'none'
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
                  right: '0.875rem', 
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <svg 
                    width="10" 
                    height="6" 
                    viewBox="0 0 10 6" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M1 1L5 5L9 1" 
                      stroke="white" 
                      strokeOpacity="0.5" 
                      strokeWidth="1.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
              <p style={{ 
                marginTop: '0.375rem', 
                fontSize: '0.75rem', 
                color: 'rgba(255, 255, 255, 0.5)' 
              }}>
                This helps AI companions personalize interactions
              </p>
            </div>
            
            <div style={{ paddingTop: '0.5rem' }}>
              <button
                onClick={handleSave}
                disabled={isSaving}
                style={{ 
                  padding: '0.625rem 1.25rem',
                  background: 'linear-gradient(to right, #ff4fa7, #7e3aed)',
                  color: 'white',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: isSaving ? 'default' : 'pointer',
                  opacity: isSaving ? 0.7 : 1,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 12px rgba(126, 58, 237, 0.2)'
                }}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              
              {saveMessage && (
                <p style={{ 
                  marginTop: '0.75rem', 
                  fontSize: '0.875rem', 
                  color: saveMessage.includes('Failed') ? '#f87171' : '#4ade80',
                  fontWeight: '500'
                }}>
                  {saveMessage}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Appearance Tab Content */}
      {activeTab === 'appearance' && (
        <motion.div 
          {...tabAnimationProps}
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '1rem',
            color: 'white'
          }}>
            Appearance Settings
          </h2>
          
          <p style={{ 
            fontSize: '0.875rem',
            color: 'rgba(255, 255, 255, 0.6)',
            marginBottom: '1.5rem'
          }}>
            Customize how the app looks and feels. More appearance options coming soon!
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label 
                style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500',
                  color: 'rgba(255, 255, 255, 0.7)', 
                  marginBottom: '0.75rem' 
                }}
              >
                Theme
              </label>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
                gap: '1rem'
              }}>
                <div>
                  <input 
                    type="radio" 
                    id="theme-dark" 
                    name="theme" 
                    value="dark"
                    checked={true}
                    className="sr-only"
                    readOnly
                  />
                  <label 
                    htmlFor="theme-dark" 
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '2px solid #7e3aed',
                      borderRadius: '0.5rem',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '6rem',
                      marginBottom: '0.75rem',
                      background: '#0d0d1b',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                        Dark Theme Preview
                      </span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white' }}>
                      Dark Theme
                    </span>
                  </label>
                </div>
                
                <div>
                  <input 
                    type="radio" 
                    id="theme-light" 
                    name="theme" 
                    value="light"
                    disabled
                    className="sr-only"
                  />
                  <label 
                    htmlFor="theme-light" 
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      padding: '1rem',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '2px solid transparent',
                      borderRadius: '0.5rem',
                      cursor: 'not-allowed',
                      opacity: 0.5
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '6rem',
                      marginBottom: '0.75rem',
                      background: '#f8fafc',
                      borderRadius: '0.375rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span style={{ fontSize: '0.75rem', color: 'rgba(0, 0, 0, 0.5)' }}>
                        Light Theme Preview
                      </span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white' }}>
                      Light Theme (Coming Soon)
                    </span>
                  </label>
                </div>
              </div>
            </div>
            
            <div style={{ paddingTop: '0.5rem' }}>
              <button
                style={{ 
                  padding: '0.625rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '0.375rem',
                  cursor: 'not-allowed',
                  opacity: 0.5
                }}
                disabled
              >
                Save Appearance
              </button>
              <p style={{ 
                marginTop: '0.625rem', 
                fontSize: '0.75rem', 
                color: 'rgba(255, 255, 255, 0.5)' 
              }}>
                Additional appearance options will be available in future updates
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
