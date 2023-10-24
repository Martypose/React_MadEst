import axios from 'axios';

export const obtenerTablasDetectadas = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(`${process.env.REACT_APP_URL_API}/tablasdetectadas`, {
      headers: {
        'Content-Type': 'application/json',
        'accessToken': token,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener tablas detectadas', error);
    throw error;
  }
};
