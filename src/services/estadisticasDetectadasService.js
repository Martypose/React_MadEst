import axios from "axios";

export const obtenerEstadisticas = async (fromDate, toDate, limit, offset) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL_API}/estadisticas`,
      {
        headers: {
          "Content-Type": "application/json",
          accessToken: token,
        },
        params: {
          fromDate,
          toDate,
          limit,
          offset,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Hubo un error al obtener las estadísticas:", error);
    return null;
  }
};
