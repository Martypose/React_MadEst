import axios from 'axios';

export const obtenerEstadisticas = async (params) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${process.env.REACT_APP_URL_API}/estadisticas`, {
      headers: {
        'Content-Type': 'application/json',
        'accessToken': token,
      },
      params: params  // Para filtrar por fechas, etc.
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener estadísticas', error);
    throw error;
  }
};
