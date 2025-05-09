'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demopassword');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Store login info in localStorage for persistence in demo
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      
      // Import the supabase client for authentication
      const { supabase } = await import('@/lib/supabase/client');
      
      // Attempt to sign in with mock Supabase auth
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="hero" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="form-container"
      >
        <div className="form-title">
          <h2>Welcome Back</h2>
          <p>Sign in to continue to your AI companions</p>
          <p style={{ color: 'var(--primary)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Demo Mode: Just click Sign In
          </p>
        </div>

        {error && (
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            borderRadius: '10px', 
            marginBottom: '1.5rem',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              required
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            style={{ 
              width: '100%', 
              marginTop: '1.5rem',
              position: 'relative',
              zIndex: 999,
              cursor: 'pointer',
              pointerEvents: 'auto'
            }}
          >
            {loading ? (
              <span className="loading"></span>
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        <div className="form-footer">
          <p>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{
              position: 'relative',
              zIndex: 999,
              cursor: 'pointer',
              pointerEvents: 'auto',
              color: 'var(--primary)',
              fontWeight: 500
            }}>Create Account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
