'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CharactersPage() {
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // List of available categories
  const categories = [
    "All", "Assistant", "Education", "Creative", "Health", 
    "Philosophy", "Entertainment", "Cooking", "Science", "Meditation"
  ];

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      
      // Simulated API call
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
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

      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{
            background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>
            Meet Our AI Companions
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Browse our curated library of AI companions, each designed with unique personalities and expertise.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex flex-wrap justify-center gap-2 p-1">
            {categories.map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/70'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Character Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-t-4 border-[var(--primary)] border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCharacters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
                className="character-card relative bg-gray-800/30 rounded-xl overflow-hidden backdrop-blur-sm border border-gray-700/50 hover:border-[var(--primary)]/30 transition-all duration-300 group"
              >
                <div className="p-5">
                  <div className="flex gap-4 items-center mb-3">
                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-[var(--primary)]/10 border border-[var(--primary)]/20 p-0.5">
                      <img 
                        src={character.avatar} 
                        alt={character.name} 
                        className="w-full h-full rounded-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{character.name}</h3>
                      <span className="text-sm px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                        {character.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {character.description}
                  </p>
                  <Link
                    href={`/login?next=/chat/${character.id}`}
                    className="block w-full py-2 text-center text-white font-medium rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary-dark)] hover:to-[var(--secondary-dark)] transition-colors duration-300"
                  >
                    Start Chatting
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {filteredCharacters.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center p-10 bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 max-w-xl mx-auto"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-12 w-12 mx-auto text-gray-400 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-bold mb-2">No characters found</h3>
            <p className="text-gray-400 mb-4">No characters available in this category.</p>
            <button 
              onClick={() => setSelectedCategory("All")}
              className="px-6 py-2 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-medium rounded-lg"
            >
              View All Characters
            </button>
          </motion.div>
        )}

        {/* CTA Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="max-w-2xl mx-auto p-8 rounded-xl bg-gradient-to-br from-gray-800/20 to-gray-900/20 backdrop-blur-sm border border-gray-700/30">
            <h2 className="text-2xl md:text-3xl font-bold mb-4" style={{
              background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>
              Ready to start chatting?
            </h2>
            <p className="text-gray-300 mb-6">
              Create an account to start meaningful conversations with our AI companions.
            </p>
            <Link
              href="/register"
              className="inline-block py-3 px-8 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] hover:from-[var(--primary-dark)] hover:to-[var(--secondary-dark)] text-white font-medium rounded-lg shadow-lg shadow-[var(--primary)]/10 transition-all duration-300"
            >
              Create Account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
