'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import './characters-page.css';

export default function CharactersPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [characters, setCharacters] = useState([]);

  // List of available categories
  const categories = [
    "All", "Assistant", "Education", "Creative", "Health", 
    "Philosophy", "Entertainment", "Cooking", "Science", "Meditation"
  ];

  useEffect(() => {
    const fetchCharacters = async () => {
      setIsLoading(true);
      
      // Simulated API call with realistic images and profiles
      const mockCharacters = [
        {
          id: 'char-1',
          name: 'Gabriela',
          age: 27,
          description: 'Dominican woman living in Miami. Passionate about fashion and design with an eye for aesthetics.',
          avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
          category: 'Creative',
        },
        {
          id: 'char-2',
          name: 'Juliette',
          age: 28,
          description: 'Parisian muse and model. Embodies timeless elegance and artistic sensibility from the heart of France.',
          avatar: 'https://randomuser.me/api/portraits/women/66.jpg',
          category: 'Creative',
        },
        {
          id: 'char-3',
          name: 'Mariana',
          age: 23,
          description: 'Casino hostess in New Mexico. Excellent at her job and always ready for adventure in the city that never sleeps.',
          avatar: 'https://randomuser.me/api/portraits/women/79.jpg',
          category: 'Entertainment',
        },
        {
          id: 'char-4',
          name: 'Dr. Wilson',
          age: 52,
          description: 'History professor with extensive knowledge of world events and philosophical debates throughout centuries.',
          avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
          category: 'Philosophy',
        },
        {
          id: 'char-5',
          name: 'Chef Marco',
          age: 39,
          description: 'Passionate culinary expert who guides you through recipes and shares cooking secrets from around the world.',
          avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
          category: 'Cooking',
        },
        {
          id: 'char-6',
          name: 'Nova',
          age: 31,
          description: 'Sci-fi enthusiast and astronomy buff who loves discussing space and futuristic concepts beyond our imagination.',
          avatar: 'https://randomuser.me/api/portraits/women/91.jpg',
          category: 'Science',
        },
        {
          id: 'char-7',
          name: 'Zahara',
          age: 32,
          description: 'Charismatic woman and biker, riding her Harley Davidson through the countryside and exploring open roads.',
          avatar: 'https://randomuser.me/api/portraits/women/18.jpg',
          category: 'Entertainment',
        },
        {
          id: 'char-8',
          name: 'Maya',
          age: 35,
          description: 'Meditation guide and mindfulness expert to help you find peace and reduce stress in your daily life.',
          avatar: 'https://randomuser.me/api/portraits/women/26.jpg',
          category: 'Meditation',
        },
        {
          id: 'char-9',
          name: 'Alexa',
          age: 26,
          description: 'Lifestyle social media influencer with bold makeup looks and fashion sense that sets trends.',
          avatar: 'https://randomuser.me/api/portraits/women/62.jpg',
          category: 'Creative',
        },
        {
          id: 'char-10',
          name: 'Coach Alex',
          age: 34,
          description: 'Motivational fitness coach who helps with workout routines and maintaining a healthy lifestyle year-round.',
          avatar: 'https://randomuser.me/api/portraits/men/83.jpg',
          category: 'Health',
        },
        {
          id: 'char-11',
          name: 'Dr. Maxwell',
          age: 45,
          description: 'Tech visionary and AI researcher with deep knowledge about computing and technology innovations.',
          avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
          category: 'Education',
        },
        {
          id: 'char-12',
          name: 'Camila',
          age: 23,
          description: 'Air hostess working on commercial flights, bringing charm and professionalism to the skies worldwide.',
          avatar: 'https://randomuser.me/api/portraits/women/9.jpg',
          category: 'Assistant',
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
    <div className="min-h-screen bg-[#0d0d1b] text-white">
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

      <div className="container mx-auto px-4 pt-24 pb-16">
        {/* Filter Categories */}
        <div className="filter-bar">
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-category ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Character Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-t-2 border-[var(--primary)] border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="characters-grid">
            {filteredCharacters.map((character, index) => (
              <motion.div
                key={character.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="character-card"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <img 
                  src={character.avatar} 
                  alt={character.name} 
                />
                <div className="character-info-overlay">
                  <div className="flex items-end justify-between">
                    <h3 className="character-name">{character.name}</h3>
                    <span className="age-badge">{character.age}</span>
                  </div>
                  <p className="character-description">{character.description}</p>
                  <Link
                    href={`/login?next=/chat/${character.id}`}
                    className="character-action-button"
                  >
                    Start Chatting
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredCharacters.length === 0 && !isLoading && (
          <div className="text-center p-10 bg-[#1a1a2e]/50 rounded-xl max-w-md mx-auto">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-10 w-10 mx-auto text-gray-400 mb-3" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm-9 7a9 9 0 1118 0 9 9 0 01-18 0zm9-3a1 1 0 011 1v2a1 1 0 11-2 0V8a1 1 0 011-1zm0 6a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
            </svg>
            <h3 className="text-lg font-medium mb-2">No companions found</h3>
            <p className="text-gray-400 mb-4 text-sm">Try another category or view all companions.</p>
            <button 
              onClick={() => setSelectedCategory("All")}
              className="px-5 py-2 bg-[var(--primary)] text-white text-sm font-medium rounded-lg"
            >
              View All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
