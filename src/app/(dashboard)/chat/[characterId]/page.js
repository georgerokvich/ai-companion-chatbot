'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OnboardingCheck } from '@/components/personalization';
import { trpc } from '@/lib/trpc/client';
import { getUserPreferencesFromStorage } from '@/lib/utils/storage';

export default function ChatPage(props) {
  const characterId = props.params?.characterId || '';
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // State management
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [character, setCharacter] = useState({
    name: 'AI Companion',
    personality: 'Friendly and helpful',
    avatar: null
  });
  
  // Get user preferences from tRPC
  const { data: userPreferences } = trpc.user.getPreferences.useQuery();
  
  // Get user preferences from local storage
  const [localUserPreferences, setLocalUserPreferences] = useState(null);
  
  useEffect(() => {
    // Get preferences from local storage
    const storedPreferences = getUserPreferencesFromStorage();
    if (storedPreferences) {
      setLocalUserPreferences(storedPreferences);
    }
  }, []);

  // Handle direct navigation to /chat without character ID
  useEffect(() => {
    // Fetch character data
    if (characterId) {
      // For demo purposes, we'll use predefined characters
      const demoCharacters = {
        'char-1': {
          id: 'char-1',
          name: 'Sophia',
          personality: 'Friendly, curious, adventurous',
          avatar: 'https://placekitten.com/500/750'
        },
        'char-2': {
          id: 'char-2',
          name: 'Max',
          personality: 'Analytical, knowledgeable, witty',
          avatar: 'https://placekitten.com/501/750'
        },
        'char-3': {
          id: 'char-3',
          name: 'Luna',
          personality: 'Imaginative, passionate, thoughtful',
          avatar: 'https://placekitten.com/502/750'
        }
      };
      
      // Set character data from demo or use default
      if (demoCharacters[characterId]) {
        setCharacter(demoCharacters[characterId]);
      }
    }
  }, [characterId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  // Focus input on component mount
  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
  }, []);

  // Generate unique ID
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Send a message
  const sendMessage = () => {
    // Only send if input is not empty
    if (!input.trim() || isSubmitting) {
      return;
    }
    
    try {
      console.log('Sending message:', input);
      
      // Save message text and clear input
      const messageText = input.trim();
      setInput('');
      setIsSubmitting(true);
      
      // Create user message
      const userMessage = {
        id: generateId(),
        content: messageText,
        role: 'user',
        timestamp: new Date().toISOString()
      };
      
      // Add to messages immediately
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // In a real implementation, this would call the API
      // For demo, we'll simulate an API call
      fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: messageText,
          character,
          userPreferences: localUserPreferences || userPreferences || null
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Create AI message
          const aiMessage = {
            id: generateId(),
            content: data.reply,
            role: 'assistant',
            timestamp: new Date().toISOString()
          };
          
          // Add AI message to chat
          setMessages(prevMessages => [...prevMessages, aiMessage]);
          
          // Reset submitting state
          setIsSubmitting(false);
          
          // Focus input for next message
          if (inputRef.current) {
            inputRef.current.focus();
          }
        })
        .catch((error) => {
          console.error('Error sending message:', error);
          setIsSubmitting(false);
        });
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSubmitting(false);
    }
  };

  // Generate an image
  const generateImage = () => {
    if (generatingImage) return;
    
    setGeneratingImage(true);
    
    setTimeout(() => {
      // Random cat image
      const imageUrl = `https://placekitten.com/${500 + Math.floor(Math.random() * 100)}/${400 + Math.floor(Math.random() * 100)}`;
      
      // Create image message
      const imageMessage = {
        id: generateId(),
        type: 'image',
        url: imageUrl,
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      
      // Add to messages
      setMessages(prevMessages => [...prevMessages, imageMessage]);
      setGeneratingImage(false);
    }, 1500);
  };

  // Handle input key press (Enter to send)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div id="chat-page-container" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#0d0d1b',
      position: 'relative'
    }}>
      {/* Personalization Onboarding Check */}
      <OnboardingCheck />
      {/* Chat header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 1.5rem',
        background: 'rgba(20, 20, 35, 0.9)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          overflow: 'hidden',
          background: 'linear-gradient(45deg, #ff4fa7, #7e3aed)',
          marginRight: '1rem'
        }}>
          {character.avatar ? (
            <img
              src={character.avatar}
              alt={character.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              color: 'white'
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: 0 }}>
            {character.name}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', margin: 0 }}>
            {character.personality}
          </p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button 
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userEmail');
              router.push('/login');
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1.5rem',
        paddingBottom: '80px', /* Space for input */
        background: 'linear-gradient(to bottom, #11111e, #1a1a32)',
        position: 'relative',
        zIndex: 5
      }}>
        <div style={{
          maxWidth: '850px',
          margin: '0 auto'
        }}>
          {messages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '60vh',
              textAlign: 'center',
              padding: '2rem'
            }}>
              <div style={{
                width: '5rem',
                height: '5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#ff4fa7">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.75rem' }}>
                Start a conversation
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>
                Say hello to {character.name} and start chatting!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  marginBottom: '1.5rem',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                {message.type === 'image' ? (
                  <div style={{
                    maxWidth: '80%',
                    padding: '0.5rem',
                    borderRadius: '18px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                  }}>
                    <img
                      src={message.url}
                      alt="Generated"
                      style={{
                        maxWidth: '100%',
                        borderRadius: '12px',
                        marginBottom: '0.5rem'
                      }}
                    />
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'rgba(255,255,255,0.5)',
                      margin: '0.5rem'
                    }}>
                      Generated image
                    </p>
                  </div>
                ) : (
                  <div style={{
                    maxWidth: '80%',
                    padding: '1rem 1.25rem',
                    borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: message.role === 'user' 
                      ? 'linear-gradient(45deg, #ff4fa7, #7e3aed)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                  }}>
                    <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                      {message.content}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}

          {isSubmitting && (
            <div style={{
              display: 'flex',
              justifyContent: 'flex-start',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                padding: '1rem 1.25rem',
                borderRadius: '18px 18px 18px 4px',
                background: 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#6b7280',
                    opacity: 0.7,
                    animation: 'typingBubble 1s infinite 0s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#6b7280',
                    opacity: 0.7,
                    animation: 'typingBubble 1s infinite 0.2s'
                  }}></div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#6b7280',
                    opacity: 0.7,
                    animation: 'typingBubble 1s infinite 0.4s'
                  }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} style={{ height: '1px' }}></div>
        </div>
      </div>

      {/* Input area */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '280px',
        right: 0,
        padding: '1rem',
        background: 'rgba(20, 20, 35, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '850px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}>
          <button
            id="generate-image-btn"
            onClick={generateImage}
            disabled={generatingImage}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(255, 255, 255, 0.08)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {generatingImage ? (
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%',
                borderTop: '2px solid #ff4fa7',
                borderRight: '2px solid transparent',
                borderBottom: '2px solid transparent',
                borderLeft: '2px solid transparent',
                animation: 'spin 1s linear infinite'
              }}></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Message ${character.name}...`}
            style={{
              flex: 1,
              padding: '0.75rem 1.25rem',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: 'white',
              fontSize: '1rem',
              outline: 'none'
            }}
          />
          
          <button
            id="send-message-btn"
            onClick={sendMessage}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: 'none',
              background: input.trim() ? 'linear-gradient(45deg, #ff4fa7, #7e3aed)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() ? 'pointer' : 'default',
              opacity: input.trim() ? 1 : 0.5
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>

      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes typingBubble {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}