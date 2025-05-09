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
  
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);

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

  // Handle sending message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!input.trim() || !chatId || isSubmitting) return;
    
    setIsSubmitting(true);
    setInput('');
    
    try {
      // Add user message to chat
      await addMessageMutation.mutateAsync({
        chatId,
        content: input,
        role: 'user',
      });

      // Get AI response
      const character = characterQuery.data;
      if (!character) throw new Error('Character not found');

      // Mock AI response - in demo mode, we'll just simulate a response
      setTimeout(async () => {
        const responses = [
          "I'm so happy to chat with you! How can I make your day better?",
          "That's an interesting thought. Tell me more about it!",
          "I've been thinking about that too. What do you think about this topic?",
          "I love your perspective on things. You're really insightful!",
          "That's fascinating! I'd love to explore this idea more with you.",
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Add AI response to chat
        await addMessageMutation.mutateAsync({
          chatId,
          content: randomResponse,
          role: 'assistant',
        });
        
        setIsSubmitting(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSubmitting(false);
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
      <div className="chat-messages">
        <div className="message-list">
          {!chatQuery.data || chatQuery.data.messages.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3>Start a conversation</h3>
              <p>
                Say hello to {character.name} and start chatting!
              </p>
            </div>
          ) : (
            chatQuery.data.messages.map((message) => (
              <div
                key={message.id}
                className={`message message-${message.role}`}
              >
                <div className="message-bubble">
                  <p>{message.content}</p>
                </div>
              </div>
            ))
          )}

          {/* Display images */}
          {chatQuery.data?.images && chatQuery.data.images.map((image) => (
            <div key={image.id} className="message message-assistant">
              <div className="message-bubble">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="message-image"
                />
              </div>
            </div>
          ))}

          {isSubmitting && (
            <div className="message message-assistant">
              <div className="message-bubble">
                <div className="loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="chat-input">
        <form onSubmit={handleSendMessage} className="input-form">
          <button
            type="button"
            onClick={handleGenerateImage}
            disabled={generatingImage || !chatId}
            className="input-image"
          >
            {generatingImage ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </button>
          
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isSubmitting || !chatId}
            placeholder={`Message ${character.name}...`}
            className="input-field"
          />
          
          <button
            type="submit"
            disabled={isSubmitting || !input.trim() || !chatId}
            className="input-send"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
