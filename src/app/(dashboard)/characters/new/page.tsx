'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewCharacterPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to characters page since character creation is disabled
    router.push('/characters');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Character Creation Disabled</h1>
        <p className="text-gray-600 mb-6">
          Custom character creation has been disabled. Please browse our curated library of pre-made characters.
        </p>
        <button
          onClick={() => router.push('/characters')}
          className="w-full px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-md"
        >
          Browse Characters
        </button>
      </div>
    </div>
  );
}
}
