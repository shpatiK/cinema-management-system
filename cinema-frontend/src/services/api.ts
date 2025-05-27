import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const fetchMovies = async () => {
  try {
    const response = await api.get('/api/movies');
    return response.data;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export type Movie = {
  id: number;
  title: string;
  duration: number;
  release_year: number;
  poster_url: string;
  description?: string;
  director?: string;
  actors?: string;
};

export const login = async (username: string, password: string) => {
  const response = await api.post('/api/auth/login', {
    username,
    password,
  });
  return response.data; // Returns { token, user }
};

export const register = async (
  username: string,
  password: string,
  email: string
) => {
  const response = await api.post('/api/auth/register', {
    username,
    email,
    password,
  });
  return response.data;
};

export const verifyAccount = async (token: string) => {
  const response = await api.get('/api/auth/activate', {
    params: { token },
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me');
  return response.data;
};

export const updateProfile = async (username: string, email: string) => {
  const response = await api.put('/api/auth/update-profile', {
    username,
    email,
  });
  return response.data;
};

export default api;