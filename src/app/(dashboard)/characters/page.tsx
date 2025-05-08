'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { trpc } from '@/lib/trpc/client';

export default function CharactersPage() {
  const router = useRouter();
  const charactersQuery = trpc.character.getAll.useQuery();
  const deleteCharacter = trpc.character.delete.useMutation({
    onSuccess: () => {
      charactersQuery.refetch();
    },
  });

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this character? This action cannot be undone.')) {
      await deleteCharacter.mutateAsync({ id });
    }
  };

  return (
    <div className="flex flex-col w-full h-full p-4 overflow-y-auto md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Your Characters</h1>
        <Link
          href="/characters/new"
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-md hover:from-purple-600 hover:to-pink-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Character
        </Link>
      </div>

      {charactersQuery.isLoading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="w-12 h-12 border-t-4 border-purple-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : charactersQuery.error ? (
        <div className="p-4 text-red-500 bg-red-50 rounded-md">
          An error occurred: {charactersQuery.error.message}
        </div>
      ) : charactersQuery.data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8 text-center">
          <div className="p-8 mb-6 text-purple-500 bg-purple-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-700">No Characters Yet</h2>
          <p className="mt-2 mb-6 text-gray-500">
            Create your first AI companion to start chatting!
          </p>
          <Link
            href="/characters/new"
            className="px-6 py-3 text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-md hover:from-purple-600 hover:to-pink-600"
          >
            Create Character
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {charactersQuery.data.map((character) => (
            <div
              key={character.id}
              className="overflow-hidden transition-shadow bg-white rounded-lg shadow-sm hover:shadow-md"
            >
              <div className="h-40 bg-gradient-to-r from-purple-200 to-pink-200">
                {character.avatar ? (
                  <img
                    src={character.avatar}
                    alt={character.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{character.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{character.personality}</p>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{character.description}</p>
                
                <div className="flex mt-4 space-x-2">
                  <button
                    onClick={() => router.push(`/chat/${character.id}`)}
                    className="flex-1 px-3 py-1.5 text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-md hover:from-purple-600 hover:to-pink-600"
                  >
                    Chat
                  </button>
                  <button
                    onClick={() => handleDelete(character.id)}
                    className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
