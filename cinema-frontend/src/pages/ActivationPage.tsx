import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom'; // Changed imports
import { verifyAccount } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ActivationPage = () => {
  const [searchParams] = useSearchParams(); // Get query params
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  
  const token = searchParams.get('token'); 

  useEffect(() => {
    const activate = async () => {
      if (!token) {
        setError('Missing activation token');
        return;
      }

      try {
        const response = await verifyAccount(token);
        setMessage('Account activated! Redirecting...');
        setTimeout(() => navigate('/login'), 3000);
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
      }
    };
    
    activate();
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="p-6 max-w-md w-full bg-white rounded-lg shadow">
        {message && <div className="text-green-600">{message}</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!message && !error && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default ActivationPage;

