'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

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
      
      // Simulated API call - these would come from a real backend in production
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

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h1 className="text-5xl font-bold mb-6" style={{
            background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>
            Our AI Companions
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our curated collection of AI companions, each with unique personalities and expertise.
          </p>
        </motion.div>

        {/* Stylish Category Filter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative mb-12"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl blur-xl"></div>
          <div className="relative bg-gray-900/40 backdrop-blur-md rounded-xl p-4 border border-gray-800">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20'
                      : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80 hover:text-white'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredCharacters.map((character) => (
              <motion.div
                key={character.id}
                variants={itemVariants}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-800/50 overflow-hidden group-hover:border-gray-700/70 transition-all">
                  <div className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-primary/40 to-secondary/40 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <div className="flex items-center gap-4 mb-4 relative">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-sm rounded-full opacity-0 group-hover:opacity-70 -m-0.5 transition-opacity duration-300"></div>
                      <img
                        src={character.avatar}
                        alt={character.name}
                        className="relative w-16 h-16 rounded-full object-cover border-2 border-transparent group-hover:border-white/20 transition-all"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{character.name}</h3>
                      <span className="inline-block px-3 py-1 text-xs rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 text-primary-dark group-hover:from-primary/30 group-hover:to-secondary/30 transition-colors">
                        {character.category}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6 leading-relaxed">{character.description}</p>
                  
                  <Link
                    href={`/login?next=/chat/${character.id}`}
                    className="relative block w-full py-3 px-6 text-center font-medium rounded-xl overflow-hidden group-hover:shadow-lg group-hover:shadow-primary/20 transition-all"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-secondary"></span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary-dark to-secondary-dark opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="relative flex items-center justify-center gap-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                        />
                      </svg>
                      Start Chatting
                    </span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredCharacters.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 bg-gray-900/30 backdrop-blur-sm rounded-2xl border border-gray-800/50"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 mx-auto text-gray-500 mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
            <p className="text-2xl font-medium text-gray-300 mb-4">No characters found in this category</p>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">We couldn't find any companions matching this filter. Try another category.</p>
            <button 
              onClick={() => setSelectedCategory("All")}
              className="px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
            >
              View All Characters
            </button>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-xl rounded-2xl"></div>
            <div className="relative bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-800/50">
              <h2 className="text-3xl font-bold mb-4" style={{
                background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}>
                Ready to Start Chatting?
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Sign up now to start conversations with our AI companions and explore a world of engaging interactions.
              </p>
              <Link
                href="/register"
                className="inline-block py-3 px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-medium rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                Create Your Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
