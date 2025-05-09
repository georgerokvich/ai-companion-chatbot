'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';

// Using JavaScript instead of TypeScript for compatibility
export default function ChatPage(props) {
  // Extract characterId from props
  const characterId = props.params?.characterId || '';
  
  const router = useRouter();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  
  // Add focus handling for input field
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Get character info
  const characterQuery = trpc.character.getById.useQuery(
    { id: characterId },
    {
      enabled: !!characterId,
      retry: 1,
      onError: () => {
        router.push('/dashboard');
      },
    }
  );

  // Create or get existing chat
  const createChatMutation = trpc.chat.create.useMutation();
  const [chatId, setChatId] = useState(null);
  
  useEffect(() => {
    const initChat = async () => {
      if (characterId && !chatId) {
        const newChat = await createChatMutation.mutateAsync({ characterId });
        setChatId(newChat.id);
      }
    };
    
    initChat();
  }, [characterId, chatId, createChatMutation]);

  // Get chat messages
  const chatQuery = trpc.chat.getById.useQuery(
    { id: chatId },
    {
      enabled: !!chatId,
      refetchInterval: 1000, // Poll for new messages
    }
  );

  // Add message mutation
  const addMessageMutation = trpc.chat.addMessage.useMutation({
    onSuccess: () => {
      chatQuery.refetch();
    },
  });

  // Add image mutation
  const addImageMutation = trpc.chat.addImage.useMutation({
    onSuccess: () => {
      chatQuery.refetch();
    },
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatQuery.data?.messages]);
  
  // Focus the input field when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      focusInput();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [chatId]);

  // Handle sending message - simplified and more direct
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    
    // Skip if empty or already submitting
    if (!input.trim() || isSubmitting) {
      console.log('Send prevented - empty input or already submitting');
      return;
    }
    
    // Skip if no chat ID yet
    if (!chatId) {
      console.log('No chat ID available yet');
      return;
    }
    
    console.log('Sending message:', input);
    
    setIsSubmitting(true);
    const messageText = input.trim(); // Save message text before clearing input
    setInput(''); // Clear input immediately for better UX
    
    try {
      console.log('Adding user message to chat');
      
      // Add user message to local state immediately for instant feedback
      const mockUserMessage = {
        id: 'temp-' + Date.now(),
        content: messageText,
        role: 'user',
        chatId: chatId,
        createdAt: new Date()
      };
      
      // Optimistically update UI
      if (chatQuery.data) {
        const updatedMessages = [...chatQuery.data.messages, mockUserMessage];
        chatQuery.data.messages = updatedMessages;
      }
      
      // Actually add the message via API
      await addMessageMutation.mutateAsync({
        chatId,
        content: messageText,
        role: 'user',
      });
      
      console.log('User message added successfully');

      // Simulate AI thinking and response
      setTimeout(async () => {
        try {
          const responses = [
            "I'm so happy to chat with you! How can I make your day better?",
            "That's an interesting thought. Tell me more about it!",
            "I've been thinking about that too. What do you think about this topic?",
            "I love your perspective on things. You're really insightful!",
            "That's fascinating! I'd love to explore this idea more with you.",
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          console.log('Adding AI response');
          
          // Add AI response to chat
          await addMessageMutation.mutateAsync({
            chatId,
            content: randomResponse,
            role: 'assistant',
          });
          
          console.log('AI response added successfully');
        } catch (error) {
          console.error('Error adding AI response:', error);
        } finally {
          setIsSubmitting(false);
          
          // Re-focus the input after sending
          setTimeout(() => {
            if (inputRef.current) {
              inputRef.current.focus();
              console.log('Input refocused');
            }
          }, 100);
        }
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSubmitting(false);
      setInput(messageText); // Restore message text on error
      alert('Failed to send message. Please try again.');
    }
  };

  // Handle generating image
  const handleGenerateImage = async () => {
    if (!chatId || generatingImage) return;
    
    setGeneratingImage(true);
    
    try {
      // In demo mode, we'll just use placeholder images
      setTimeout(async () => {
        const imageUrl = `https://placekitten.com/500/${400 + Math.floor(Math.random() * 200)}`;
        
        // Add image to chat
        await addImageMutation.mutateAsync({
          chatId,
          url: imageUrl,
          prompt: "Generated image for you!",
        });
        
        setGeneratingImage(false);
      }, 2000);
    } catch (error) {
      console.error('Error generating image:', error);
      setGeneratingImage(false);
    }
  };

  if (characterQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--background)' }}>
        <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!characterQuery.data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8" style={{ background: 'var(--background)' }}>
        <h2 className="text-2xl font-bold text-white">Character not found</h2>
        <p className="mt-2 text-gray-400">This character does not exist or you do not have access to it.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 mt-4 text-white bg-primary rounded-md hover:bg-primary-dark"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { data: character } = characterQuery;

  return (
    <div className="chat-container">
      {/* Chat header */}
      <div className="chat-header">
        <div className="character-avatar">
          {character.avatar ? (
            <img
              src={character.avatar}
              alt={character.name}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-white">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>
        <div className="character-info">
          <h2>{character.name}</h2>
          <p>{character.personality}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button 
            onClick={() => {
              localStorage.removeItem('isLoggedIn');
              localStorage.removeItem('userEmail');
              router.push('/login');
            }}
            className="btn btn-secondary"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem'
            }}
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Chat messages */}
      <div 
        style={{
          flex: 1,
          padding: '1.5rem',
          overflowY: 'auto',
          background: 'linear-gradient(to bottom, rgba(13, 13, 27, 0.7), rgba(26, 26, 50, 0.7))',
          paddingBottom: '80px'
        }}
      >
        <div 
          style={{
            maxWidth: '850px',
            margin: '0 auto'
          }}
        >
          {!chatQuery.data || chatQuery.data.messages.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              textAlign: 'center',
              padding: '2rem',
              marginTop: '20vh'
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
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '2.5rem', height: '2.5rem', color: '#ff4fa7' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.75rem' }}>Start a conversation</h3>
              <p style={{ color: '#9ca3af' }}>
                Say hello to {character.name} and start chatting!
              </p>
            </div>
          ) : (
            chatQuery.data.messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  marginBottom: '1.5rem',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '80%',
                    padding: '1rem 1.25rem',
                    borderRadius: message.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: message.role === 'user' 
                      ? 'linear-gradient(45deg, #ff4fa7, #7e3aed)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    color: message.role === 'user' ? 'white' : '#e5e7eb',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                    backdropFilter: message.role === 'user' ? 'none' : 'blur(10px)',
                    border: message.role === 'user' ? 'none' : '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <p style={{ whiteSpace: 'pre-wrap' }}>{message.content}</p>
                </div>
              </div>
            ))
          )}

          {/* Display images */}
          {chatQuery.data?.images && chatQuery.data.images.map((image) => (
            <div 
              key={image.id} 
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '1.5rem'
              }}
            >
              <div
                style={{
                  maxWidth: '80%',
                  padding: '0.5rem',
                  borderRadius: '18px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
              >
                <img
                  src={image.url}
                  alt={image.prompt}
                  style={{
                    maxWidth: '100%',
                    borderRadius: '12px',
                    marginBottom: '0.5rem'
                  }}
                />
                <p style={{
                  fontSize: '0.75rem',
                  color: '#9ca3af',
                  margin: '0 0.5rem'
                }}>
                  Generated from: {image.prompt}
                </p>
              </div>
            </div>
          ))}

          {isSubmitting && (
            <div 
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                marginBottom: '1.5rem'
              }}
            >
              <div
                style={{
                  padding: '1rem 1.25rem',
                  borderRadius: '18px 18px 18px 4px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '50%',
                    background: '#6b7280',
                    animation: 'bounce 1.2s ease-in-out 0s infinite'
                  }}></div>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '50%',
                    background: '#6b7280',
                    animation: 'bounce 1.2s ease-in-out 0.2s infinite'
                  }}></div>
                  <div style={{
                    width: '0.5rem',
                    height: '0.5rem',
                    borderRadius: '50%',
                    background: '#6b7280',
                    animation: 'bounce 1.2s ease-in-out 0.4s infinite'
                  }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area - completely rebuilt for maximum compatibility */}
      <div 
        style={{
          padding: '16px',
          background: '#121225',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          position: 'fixed',
          bottom: 0,
          left: '280px',
          right: 0,
          zIndex: 9999
        }}
      >
        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <button
            type="button"
            onClick={handleGenerateImage}
            disabled={generatingImage || !chatId}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10000
            }}
          >
            {generatingImage ? (
              <div style={{ 
                width: '20px', 
                height: '20px', 
                border: '2px solid #333', 
                borderTopColor: '#ff4fa7',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#aaa' }}>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                console.log('Enter key pressed');
                handleSendMessage();
              }
            }}
            placeholder={`Message ${character?.name || 'AI'}...`}
            style={{
              flex: 1,
              padding: '14px 20px',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '24px',
              color: 'white',
              fontSize: '16px',
              zIndex: 10000,
              outline: 'none'
            }}
            onFocus={(e) => console.log('Input focused')}
            onClick={(e) => {
              e.stopPropagation();
              console.log('Input clicked');
            }}
          />
          
          <button
            type="button"
            onClick={() => {
              console.log('Send button clicked directly');
              handleSendMessage();
            }}
            disabled={isSubmitting || !input.trim() || !chatId}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: input.trim() ? 'linear-gradient(45deg, #ff4fa7, #7e3aed)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: input.trim() ? 'pointer' : 'default',
              zIndex: 10000
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'white' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
