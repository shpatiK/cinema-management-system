import React, { useState } from 'react';
import { useAuthModal } from '../context/AuthModalContext';
import { login, register } from '../services/api';

type AuthMode = 'login' | 'register';

interface AuthFormData {
  username: string;
  email?: string;
  password: string;
}

const AuthModal: React.FC = () => {
  const { isOpen, closeModal } = useAuthModal();
  const [mode, setMode] = useState<AuthMode>('login');
  const [formData, setFormData] = useState<AuthFormData>({
    username: '',
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'login') {
        const data = await login(formData.username, formData.password);
        localStorage.setItem('token', data.token);
        closeModal();
        window.location.reload();
      } else {
        if (!formData.email) throw new Error('Email is required');
        await register(formData.username, formData.password, formData.email);
        setSuccess('Check your email to activate your account.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && closeModal()}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Login' : 'Register'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="Email"
                value={formData.email || ''}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-400 flex justify-center items-center"
          >
            {isLoading ? <span className="animate-spin mr-2">↻</span> : null}
            {mode === 'login' ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError(null);
              setSuccess(null);
              setFormData({ ...formData, password: '', email: '' });
            }}
            className="text-blue-600 hover:underline text-sm"
          >
            {mode === 'login'
              ? "Don't have an account? Register"
              : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
