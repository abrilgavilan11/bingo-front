import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const fetchPlaylist = async (url) => {
  try {
    const response = await api.post('/spotify/playlist', { url });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error conectando con el servidor');
  }
};

export default api;
