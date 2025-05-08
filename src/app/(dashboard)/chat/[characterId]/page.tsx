'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';

export default function ChatPage({ params }: { params: { characterId: string } }) {
  const { characterId } = params;
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
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
  const [chatId, setChatId] = useState<string | null>(null);
  
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
    { id: chatId as string },
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
  const handleSendMessage = async (e: React.FormEvent) => {
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

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          character: {
            name: character.name,
            personality: character.personality,
          },
        }),
      });

      if (!response.ok) throw new Error('Failed to get AI response');
      
      const { reply } = await response.json();
      
      // Add AI response to chat
      await addMessageMutation.mutateAsync({
        chatId,
        content: reply,
        role: 'assistant',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle generating image
  const handleGenerateImage = async () => {
    if (!chatId || generatingImage) return;
    
    setGeneratingImage(true);
    
    try {
      const lastMessage = chatQuery.data?.messages.slice(-1)[0];
      const prompt = lastMessage?.content || 'Generate a portrait image';
      
      const response = await fetch('/api/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate image');
      
      const { imageUrl } = await response.json();
      
      // Add image to chat
      await addImageMutation.mutateAsync({
        chatId,
        url: imageUrl,
        prompt,
      });
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGeneratingImage(false);
    }
  };

  if (characterQuery.isLoading) {
    return (
      <div className="flex items-center justify-center flex-1">
        <div className="w-12 h-12 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!characterQuery.data) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <h2 className="text-2xl font-bold text-gray-800">Character not found</h2>
        <p className="mt-2 text-gray-600">This character doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 mt-4 text-white bg-purple-500 rounded-md hover:bg-purple-600"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const { data: character } = characterQuery;

  return (
    <div className="flex flex-col w-full h-full">
      {/* Chat header */}
      <div className="flex items-center p-4 bg-white shadow-sm md:p-6">
        <div className="flex items-center">
          <div className="w-12 h-12 overflow-hidden bg-gray-100 rounded-full md:w-14 md:h-14">
            {character.avatar ? (
              <img
                src={character.avatar}
                alt={character.name}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-900">{character.name}</h2>
            <p className="text-sm text-gray-500">{character.personality}</p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="max-w-3xl mx-auto space-y-4">
          {!chatQuery.data || chatQuery.data.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="p-4 mb-4 text-purple-500 bg-purple-100 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-700">Start a conversation</h3>
              <p className="mt-2 text-gray-500">
                Say hello to {character.name} and start chatting!
              </p>
            </div>
          ) : (
            chatQuery.data.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            ))
          )}

          {/* Display images */}
          {chatQuery.data?.images.map((image) => (
            <div key={image.id} className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl p-2 bg-white shadow-sm">
                <img
                  src={image.url}
                  alt={image.prompt}
                  className="object-contain max-w-full rounded-lg max-h-80"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Generated from: {image.prompt}
                </p>
              </div>
            </div>
          ))}

          {isSubmitting && (
            <div className="flex justify-start">
              <div className="px-4 py-3 bg-white rounded-2xl shadow-sm">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={generatingImage || !chatId}
              className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200 focus:outline-none"
            >
              {generatingImage ? (
                <div className="w-6 h-6 border-2 border-gray-300 border-t-purple-500 rounded-full animate-spin"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            
            <button
              type="submit"
              disabled={isSubmitting || !input.trim() || !chatId}
              className="p-2 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-full hover:from-purple-600 hover:to-pink-600 focus:outline-none disabled:opacity-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
