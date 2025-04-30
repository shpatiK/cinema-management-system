import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; 



export const fetchMovies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/movies`, {
    });
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
};

export const login = async (username: string, password: string) => {
  const response = await axios.post(`http://localhost:3000/auth/login`, {
    username,
    password,
  });
  return response.data; // should include { token }
};

export const register = async (username: string, password: string) => {
  const response = await axios.post(`http://localhost:3000/auth/register`, {
    username,
    password,
  });
  return response.data;
};


