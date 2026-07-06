import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

export const fetchPlaylist = async (url) => {
  try {
    const response = await api.post('/spotify/playlist', { url });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error conectando con el servidor');
  }
};

export const createGame = async (cards, gridSize) => {
  try {
    const response = await api.post('/game', { cards, gridSize });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error guardando sesión de bingo');
  }
};

export const getCard = async (gameId, cardId) => {
  try {
    const response = await api.get(`/game/${gameId}/card/${cardId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Error recuperando cartón');
  }
};

export default api;
