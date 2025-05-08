'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';

export default function DashboardPage() {
  const router = useRouter();
  const charactersQuery = trpc.character.getAll.useQuery();

  useEffect(() => {
    if (charactersQuery.data && charactersQuery.data.length > 0) {
      // If user has characters, navigate to the chat with the first one
      router.push(`/chat/${charactersQuery.data[0].id}`);
    }
  }, [charactersQuery.data, router]);

  return (
    <div className="flex flex-col items-center justify-center h-full p-8 bg-gradient-to-b from-purple-50 to-pink-50">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to AI Companion</h1>
        
        <p className="mt-4 text-lg text-gray-600">
          {charactersQuery.isLoading
            ? 'Loading your characters...'
            : charactersQuery.data?.length === 0
            ? 'Create your first AI companion to start chatting!'
            : 'Loading your chat...'}
        </p>

        {charactersQuery.data?.length === 0 && (
          <button
            onClick={() => router.push('/characters/new')}
            className="px-6 py-3 mt-6 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg hover:from-purple-600 hover:to-pink-600 shadow-md"
          >
            Create Character
          </button>
        )}
      </div>
    </div>
  );
}
