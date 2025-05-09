'use client';

import Link from 'next/link';

const characters = [
  {
    id: 'char-1',
    name: 'Luna',
    description: 'Friendly AI assistant who loves to help with creative tasks',
    avatar: 'https://ui-avatars.com/api/?name=Luna&background=random',
    category: 'Assistant',
  },
  {
    id: 'char-2',
    name: 'Professor Max',
    description: 'Knowledgeable tutor specializing in mathematics and science',
    avatar: 'https://ui-avatars.com/api/?name=Max&background=random',
    category: 'Education',
  },
  {
    id: 'char-3',
    name: 'Aria',
    description: 'Witty and philosophical companion for deep conversations',
    avatar: 'https://ui-avatars.com/api/?name=Aria&background=random',
    category: 'Philosophy',
  },
  {
    id: 'char-4',
    name: 'Sophia',
    description: 'Flirty and playful companion for lighthearted chat',
    avatar: 'https://ui-avatars.com/api/?name=Sophia&background=random',
    category: 'Entertainment',
  },
  {
    id: 'char-5',
    name: 'Alex',
    description: 'Fitness coach who helps with workout plans and motivation',
    avatar: 'https://ui-avatars.com/api/?name=Alex&background=random',
    category: 'Health',
  },
  {
    id: 'char-6',
    name: 'Isabella',
    description: 'Creative writer who can help with stories and poetry',
    avatar: 'https://ui-avatars.com/api/?name=Isabella&background=random',
    category: 'Creative',
  },
];

export default function CharactersPage() {
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
            Explore our collection of unique AI companions, each with their own personality and expertise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {characters.map((character) => (
            <div key={character.id} className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all">
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

        <div className="mt-16 text-center">
          <p className="text-xl text-gray-300 mb-4">
            Want to create your own unique AI companion?
          </p>
          <Link
            href="/register"
            className="inline-block py-2 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-md transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}
