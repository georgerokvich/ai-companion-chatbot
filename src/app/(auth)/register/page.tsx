'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('demopassword');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Demo mode - just simulate success
      // Store login info in localStorage for persistence in demo
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error: any) {
      setError('Registration failed. Please try again.');
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
          <h2>Create Account</h2>
          <p>Join thousands of users enjoying AI companionship</p>
          <p style={{ color: 'var(--primary)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
            Demo Mode: Just click Create Account
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

        <form onSubmit={handleRegister}>
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
              minLength={6}
            />
            <p style={{ 
              fontSize: '0.75rem', 
              color: 'var(--gray-400)', 
              marginTop: '0.5rem' 
            }}>
              Password must be at least 6 characters
            </p>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
          >
            {loading ? (
              <span className="loading"></span>
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        <div className="form-footer">
          <p>
            Already have an account?{' '}
            <Link href="/login">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
