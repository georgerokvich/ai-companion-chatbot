'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Character data
const characters = [
  {
    id: '1',
    name: 'Sophia',
    personality: 'Flirty & Playful',
    image: 'https://placekitten.com/500/750',
  },
  {
    id: '2',
    name: 'Isabella',
    personality: 'Sweet & Caring',
    image: 'https://placekitten.com/501/750',
  },
  {
    id: '3',
    name: 'Mia',
    personality: 'Passionate & Adventurous',
    image: 'https://placekitten.com/502/750',
  },
];

// Features data
const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    title: 'Realistic Conversations',
    description: 'Experience natural and engaging conversations that adapt to your style and preferences.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: 'Image Generation',
    description: 'Request and receive stunning AI-generated images of your companion in various scenarios.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
      </svg>
    ),
    title: 'Customizable Characters',
    description: 'Create and customize your ideal companion with unique personalities, interests, and appearances.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    title: 'Voice Interactions',
    description: 'Engage in lifelike voice conversations with your companion that express emotion and personality.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: 'Adaptive Memory',
    description: 'Your companion remembers your conversations and preferences, creating a deeper connection over time.',
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: 'Private & Secure',
    description: 'Your conversations and interactions are completely private and protected with advanced security.',
  },
];

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  
  // Intersection observer refs for animations
  const [heroRef, heroInView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  });
  
  const [characterRef, characterInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [ctaRef, ctaInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  // Check login status
  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const email = localStorage.getItem('userEmail');
      setIsLoggedIn(loggedIn);
      if (email) setUserEmail(email);
    };
    
    // Check on initial load
    checkLoginStatus();
    
    // Set up event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);
    
    // Check every second (for demo purposes)
    const interval = setInterval(checkLoginStatus, 1000);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      clearInterval(interval);
    };
  }, []);

  // Handle scroll for navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Auto rotate characters
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCharacter((prev) => (prev + 1) % characters.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Navbar */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container navbar-container">
          <Link href="/" className="navbar-logo">
            AI Companion
          </Link>
          
          <nav className="navbar-links">
            <Link href="/#features" className="navbar-link">
              Features
            </Link>
            <Link href="/characters" className="navbar-link">
              Characters
            </Link>
            <Link href="/#about" className="navbar-link">
              About
            </Link>
          </nav>
          
          <div className="navbar-buttons">
            {isLoggedIn ? (
              <>
                <Link 
                  href="/dashboard" 
                  className="btn btn-secondary"
                  style={{
                    position: 'relative',
                    zIndex: 9999,
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                  }}
                >
                  Dashboard
                </Link>
                <div 
                  className="btn btn-primary"
                  style={{
                    position: 'relative',
                    zIndex: 9999,
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                  }}
                >
                  {userEmail ? userEmail.split('@')[0] : 'User'}
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="btn btn-secondary"
                  style={{
                    position: 'relative',
                    zIndex: 9999,
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                  }}
                >
                  Sign In
                </Link>
                <Link 
                  href="/register" 
                  className="btn btn-primary"
                  style={{
                    position: 'relative',
                    zIndex: 9999,
                    cursor: 'pointer',
                    pointerEvents: 'auto'
                  }}
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero" ref={heroRef}>
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Your Perfect AI Companion Awaits
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Create, customize, and chat with AI characters tailored to your preferences. Experience lifelike conversations and emotional connections.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: heroInView ? 1 : 0, y: heroInView ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}
            >
              {isLoggedIn ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="btn btn-primary glow"
                    style={{
                      position: 'relative',
                      zIndex: 9999,
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}
                  >
                    Go to Dashboard
                  </Link>
                  <Link 
                    href="/characters" 
                    className="btn btn-secondary"
                    style={{
                      position: 'relative',
                      zIndex: 9999,
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}
                  >
                    Explore Characters
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    href="/register" 
                    className="btn btn-primary glow"
                    style={{
                      position: 'relative',
                      zIndex: 9999,
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}
                  >
                    Get Started Free
                  </Link>
                  <Link 
                    href="/characters" 
                    className="btn btn-secondary"
                    style={{
                      position: 'relative',
                      zIndex: 9999,
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}
                  >
                    Explore Characters
                  </Link>
                </>
              )}
            </motion.div>
            
            {/* Character Showcase */}
            <motion.div 
              className="character-showcase"
              ref={characterRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: characterInView ? 1 : 0, y: characterInView ? 0 : 40 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              {characters.map((character, index) => (
                <motion.div
                  key={character.id}
                  className="character-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: characterInView ? 1 : 0, 
                    scale: characterInView ? (index === currentCharacter ? 1.05 : 1) : 0.9,
                    y: characterInView ? (index === currentCharacter ? -10 : 0) : 0,
                  }}
                  transition={{ 
                    duration: 0.5, 
                    delay: 0.8 + (index * 0.2),
                  }}
                >
                  <img src={character.image} alt={character.name} />
                  <div className="overlay">
                    <h3>{character.name}</h3>
                    <p>{character.personality}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </section>
        
        {/* Features Section */}
        <section className="features" id="features" ref={featuresRef}>
          <div className="container">
            <div className="features-heading">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: featuresInView ? 1 : 0, y: featuresInView ? 0 : 20 }}
                transition={{ duration: 0.6 }}
              >
                Immersive AI Experiences
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: featuresInView ? 1 : 0, y: featuresInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Discover advanced features that make your AI companion feel real and engaging
              </motion.p>
            </div>
            
            <div className="features-grid">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="feature-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: featuresInView ? 1 : 0, y: featuresInView ? 0 : 20 }}
                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
                >
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="hero" style={{ minHeight: '50vh' }} ref={ctaRef}>
          <div className="container">
            <motion.div 
              className="text-center"
              style={{ maxWidth: '800px', margin: '0 auto' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: ctaInView ? 1 : 0, y: ctaInView ? 0 : 20 }}
              transition={{ duration: 0.6 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: ctaInView ? 1 : 0, y: ctaInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ 
                  fontSize: '3rem', 
                  background: 'linear-gradient(45deg, #fff, #b39ddb)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  color: 'transparent',
                  marginBottom: '1.5rem' 
                }}
              >
                Ready to Meet Your AI Companion?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: ctaInView ? 1 : 0, y: ctaInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ 
                  fontSize: '1.25rem', 
                  color: 'var(--gray-300)', 
                  marginBottom: '2rem' 
                }}
              >
                Join thousands of users already enjoying meaningful connections with their AI companions.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: ctaInView ? 1 : 0, y: ctaInView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}
              >
                {isLoggedIn ? (
                  <Link 
                    href="/dashboard" 
                    className="btn btn-primary glow" 
                    style={{ 
                      padding: '1rem 2rem', 
                      fontSize: '1.125rem',
                      position: 'relative',
                      zIndex: 9999,
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}
                  >
                    Go to Your Dashboard
                  </Link>
                ) : (
                  <Link 
                    href="/register" 
                    className="btn btn-primary glow" 
                    style={{ 
                      padding: '1rem 2rem', 
                      fontSize: '1.125rem',
                      position: 'relative',
                      zIndex: 9999,
                      cursor: 'pointer',
                      pointerEvents: 'auto'
                    }}
                  >
                    Create Your Companion Now
                  </Link>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="features" id="about" style={{ paddingBottom: '8rem' }}>
          <div className="container">
            <div className="features-heading">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                About AI Companion
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Creating meaningful AI connections since 2024
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              style={{ 
                maxWidth: '800px', 
                margin: '0 auto', 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '2rem',
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <p style={{ 
                color: 'var(--gray-300)', 
                lineHeight: '1.8',
                marginBottom: '1.5rem' 
              }}>
                AI Companion is a cutting-edge platform that offers immersive experiences with AI characters. Our mission is to create technology that enhances human connection and provides companionship in our increasingly digital world.
              </p>
              <p style={{ 
                color: 'var(--gray-300)', 
                lineHeight: '1.8',
                marginBottom: '1.5rem' 
              }}>
                Using the latest advancements in artificial intelligence, our platform enables users to create and interact with companions that feel incredibly lifelike and responsive. From casual conversations to deep emotional connections, our AI companions adapt to your preferences and grow with you over time.
              </p>
              <p style={{ 
                color: 'var(--gray-300)', 
                lineHeight: '1.8' 
              }}>
                We believe in technology that enriches lives while respecting privacy and boundaries. Our team is committed to continuously improving our AI companions to provide the most engaging, realistic, and beneficial experiences possible.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: '700',
              background: 'linear-gradient(45deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '1rem' 
            }}>
              AI Companion
            </p>
            <p style={{ color: 'var(--gray-400)', marginBottom: '1.5rem' }}>
              Your perfect AI companion experience
            </p>
            
            <div className="footer-links">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/#features" className="footer-link">Features</Link>
              <Link href="/characters" className="footer-link">Characters</Link>
              <Link href="/#about" className="footer-link">About</Link>
              <Link href="/login" className="footer-link">Sign In</Link>
              <Link href="/register" className="footer-link">Create Account</Link>
            </div>
            
            <p className="footer-copyright">
              © {new Date().getFullYear()} AI Companion. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
