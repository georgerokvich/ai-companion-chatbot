'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Define character categories
const categories = [
  "All", "Assistant", "Education", "Creative", "Health", 
  "Philosophy", "Entertainment", "Cooking", "Science", "Meditation"
];

export default function CharactersPage() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Fetch the mock characters (simulating an API call)
  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      
      // This would be an API call in a real app
      // For now we'll create our own data that matches our expanded mock characters
      const mockCharacters = [
        {
          id: 'char-1',
          name: 'Sophia',
          description: 'A friendly and outgoing AI companion who loves to chat about anything.',
          avatar: 'https://ui-avatars.com/api/?name=Sophia&background=a855f7&color=fff',
          category: 'Entertainment',
        },
        {
          id: 'char-2',
          name: 'Max',
          description: 'A tech-savvy AI that knows all about computers, programming, and technology.',
          avatar: 'https://ui-avatars.com/api/?name=Max&background=3b82f6&color=fff',
          category: 'Education',
        },
        {
          id: 'char-3',
          name: 'Luna',
          description: 'A creative and artistic AI who loves discussing art, music, and literature.',
          avatar: 'https://ui-avatars.com/api/?name=Luna&background=ec4899&color=fff',
          category: 'Creative',
        },
        {
          id: 'char-4',
          name: 'Professor Wilson',
          description: 'An intellectual history professor with extensive knowledge of world events and philosophical debates.',
          avatar: 'https://ui-avatars.com/api/?name=Prof+Wilson&background=f59e0b&color=fff',
          category: 'Philosophy',
        },
        {
          id: 'char-5',
          name: 'Chef Marco',
          description: 'A passionate culinary expert who can guide you through recipes and share cooking secrets.',
          avatar: 'https://ui-avatars.com/api/?name=Chef+Marco&background=10b981&color=fff',
          category: 'Cooking',
        },
        {
          id: 'char-6',
          name: 'Nova',
          description: 'A sci-fi enthusiast and astronomy buff who loves discussing space, technology, and futuristic concepts.',
          avatar: 'https://ui-avatars.com/api/?name=Nova&background=6366f1&color=fff',
          category: 'Science',
        },
        {
          id: 'char-7',
          name: 'Coach Alex',
          description: 'A motivational fitness coach who helps with workout routines and maintaining a healthy lifestyle.',
          avatar: 'https://ui-avatars.com/api/?name=Coach+Alex&background=22c55e&color=fff',
          category: 'Health',
        },
        {
          id: 'char-8',
          name: 'Maya',
          description: 'A meditation guide and mindfulness expert to help you find peace and reduce stress.',
          avatar: 'https://ui-avatars.com/api/?name=Maya&background=8b5cf6&color=fff',
          category: 'Meditation',
        },
        {
          id: 'char-9',
          name: 'Detective Morris',
          description: 'A sharp-witted detective with a knack for solving mysteries and discussing true crime.',
          avatar: 'https://ui-avatars.com/api/?name=Det+Morris&background=ef4444&color=fff',
          category: 'Entertainment',
        },
      ];

      setCharacters(mockCharacters);
      setIsLoading(false);
    };

    fetchCharacters();
  }, []);

  // Filter characters by category
  const filteredCharacters = selectedCategory === "All" 
    ? characters 
    : characters.filter(char => char.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white pb-16">
      {/* Navbar */}
      <header className="navbar scrolled">
        <div className="container navbar-container">
          <Link href="/" className="navbar-logo">
            AI Companion
          </Link>
          
          <nav className="navbar-links">
            <Link href="/#features" className="navbar-link">
              Features
            </Link>
            <Link href="/characters" className="navbar-link active">
              Characters
            </Link>
            <Link href="/#about" className="navbar-link">
              About
            </Link>
          </nav>
          
          <div className="navbar-buttons">
            <Link href="/login" className="btn btn-secondary">
              Sign In
            </Link>
            <Link href="/register" className="btn btn-primary">
              Create Account
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-32">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4" style={{
            background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>
            Meet Our AI Companions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Browse our curated library of AI companions, each designed with unique personalities and expertise.
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                selectedCategory === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCharacters.map((character) => (
              <div key={character.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10">
                <div className="flex items-center mb-4">
                  <img
                    src={character.avatar}
                    alt={character.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">{character.name}</h3>
                    <span className="text-sm text-purple-400">{character.category}</span>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">{character.description}</p>
                <Link
                  href={`/login?next=/chat/${character.id}`}
                  className="block w-full py-2 px-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-md transition-colors"
                >
                  Start Chatting
                </Link>
              </div>
            ))}
          </div>
        )}

        {filteredCharacters.length === 0 && !isLoading && (
          <div className="text-center py-10">
            <p className="text-xl text-gray-400">No characters found in this category.</p>
            <button 
              onClick={() => setSelectedCategory("All")}
              className="mt-4 px-6 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition-colors"
            >
              View All Characters
            </button>
          </div>
        )}

        <div className="mt-16 text-center">
          <p className="text-xl text-gray-300 mb-4">
            Ready to start chatting with our AI companions?
          </p>
          <Link
            href="/register"
            className="inline-block py-2 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-md transition-colors"
          >
            Sign Up to Chat
          </Link>
        </div>
      </div>
    </div>
  );
}
