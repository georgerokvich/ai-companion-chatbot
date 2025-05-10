'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { trpc } from '@/lib/trpc/client';
import Link from 'next/link';

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
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-white" style={{ marginBottom: '1.5rem' }}>Welcome to AI Companion</h1>
        
        <p className="text-lg text-gray-300" style={{ marginBottom: '2rem' }}>
          {charactersQuery.isLoading
            ? 'Loading your characters...'
            : charactersQuery.data?.length === 0
            ? 'Browse our character library to start chatting!'
            : 'Loading your chat...'}
        </p>

        {charactersQuery.data?.length === 0 && (
          <Link
            href="/characters"
            className="btn btn-primary"
            style={{ 
              padding: '1rem 2rem', 
              display: 'inline-block',
              margin: '0 auto'
            }}
          >
            Browse Characters
          </Link>
        )}
      </div>
    </div>
  );
}
