import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchMovies = async () => {
  const response = await axios.get(`${API_URL}/movies`);
  return response.data;
};

export const bookTicket = async (ticketData: any) => {
  const response = await axios.post(`${API_URL}/booking`, ticketData);
  return response.data;
};