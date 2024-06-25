import axios from "axios";

export const obtenerTablasDetectadas = async () => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL_API}/tablasdetectadas`,
      {
        headers: {
          "Content-Type": "application/json",
          accessToken: token,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener tablas detectadas", error);
    throw error;
  }
};

export const obtenerCubicoFiltrado = async (
  startDate,
  endDate,
  agrupamiento
) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL_API}/tablasdetectadas/cubico-por-fecha`,
      {
        headers: {
          "Content-Type": "application/json",
          accessToken: token,
        },
        params: {
          startDate,
          endDate,
          agrupamiento,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener tablas filtradas", error);
    throw error;
  }
};

export const obtenerTablasPorMedidaYFecha = async (
  startDate,
  endDate,
  agrupamiento
) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL_API}/tablasdetectadas/tablas-por-medida-y-fecha`,
      {
        headers: {
          "Content-Type": "application/json",
          accessToken: token,
        },
        params: {
          startDate,
          endDate,
          agrupamiento,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener tablas por medida y fecha", error);
    throw error;
  }
};

export const obtenerVolumenPorGrosor = async (
  startDate,
  endDate,
  agrupamiento
) => {
  const token = localStorage.getItem("accessToken");
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_URL_API}/tablasdetectadas/volumen-por-grosor`,
      {
        headers: {
          "Content-Type": "application/json",
          accessToken: token,
        },
        params: {
          startDate,
          endDate,
          agrupamiento,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener volumen por grosor", error);
    throw error;
  }
};
