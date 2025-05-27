import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyAccount } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ActivationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isActivating, setIsActivating] = useState(true);

  const token = searchParams.get('token');

  useEffect(() => {
    const activate = async () => {
      if (!token) {
        setError('Missing activation token');
        setIsActivating(false);
        return;
      }

      try {
        const response = await verifyAccount(token);
        setMessage('Account activated successfully! Redirecting to dashboard...');
        
        // If the response includes a token (auto-login after activation)
        if (response.token) {
          localStorage.setItem('token', response.token);
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          }
          setTimeout(() => navigate('/dashboard'), 2000);
        } else {
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err: unknown) {
        let errorMessage = 'Activation failed';
        
        if (typeof err === 'object' && err !== null && 'response' in err) {
          const axiosError = err as {
            response?: {
              data?: {
                error?: string
              }
            }
          };
          errorMessage = axiosError.response?.data?.error || errorMessage;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        console.error('Activation error:', err);
      } finally {
        setIsActivating(false);
      }
    };
    
    activate();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="p-8 max-w-md w-full bg-white rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Activation</h1>
        
        {isActivating && (
          <div className="mb-4">
            <LoadingSpinner />
            <p className="text-gray-600 mt-2">Activating your account...</p>
          </div>
        )}
        
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {!isActivating && !message && (
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Go Home
          </button>
        )}
      </div>
    </div>
  );
};

export default ActivationPage;