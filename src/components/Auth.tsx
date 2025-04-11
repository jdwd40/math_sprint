import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const Auth: React.FC = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { signIn, signUp } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (!isLogin && !username) {
      setError('Username is required for sign up');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        if (username.length < 3) {
          setError('Username must be at least 3 characters long');
          return;
        }
        await signUp(email, password, username);
      }
      navigate('/');
    } catch (err: any) {
      if (err.message === 'Invalid login credentials') {
        setError('Invalid email or password');
      } else if (err.message.includes('User already registered')) {
        setError('Email is already registered');
      } else {
        setError(err.message || 'An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center p-6 mt-4">
      <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-lg max-w-md w-full transition-colors duration-300">
        <div className="flex justify-center mb-6">
          <img 
            src="/images/logo.png" 
            alt="Math Sprint Logo" 
            className="w-24 h-24 object-contain" 
          />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center transition-colors duration-300">
          {isLogin ? 'Welcome Back!' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-200 p-3 rounded-lg mb-4 text-sm transition-colors duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.trim())}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
                placeholder="Enter your username"
                minLength={3}
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors duration-300"
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors font-medium"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
            setEmail('');
            setPassword('');
            setUsername('');
          }}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 block w-full text-center transition-colors duration-300"
        >
          {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
        </button>
      </div>
    </div>
  );
};