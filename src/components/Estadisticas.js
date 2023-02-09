import React, {useState,useEffect,useRef} from 'react'
import { BarChart }  from '../utils/chartStockPaquetes';
import Chart from 'chart.js/auto';
import axios from "axios";

function Home() {
  let [Paquetes, setPaquetes] = useState([])
  let [numerosPaquetes, setNumerosPaquetes] = useState([0,0,0,0])
  let [PaquetesVendidos, setPaquetesVendidos] = useState([])
  let [PaquetesStock, setPaquetesStock] = useState([])
  let [PaquetesBajados, setPaquetesBajados] = useState([])
  const montadoRef = useRef(null);



  useEffect(() => {
    montadoRef.current = true;
    fetchPaquetes();
    return () => (montadoRef.current = false);
  }, []);


  const fetchPaquetes = async () => {
    axios
      .get(`${process.env.REACT_APP_URL_API}/paquetes`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        numerosPaquetes = [0,0,0,0]
        setNumerosPaquetes(numerosPaquetes)
        Paquetes = response.data;
        Paquetes.forEach((paquete,i) => {
          
          if (paquete.estado === "vendido"){
            PaquetesVendidos.push(paquete)
            numerosPaquetes[1] = numerosPaquetes[1] + 1
          }
          if (paquete.estado === "stock"){
            PaquetesStock.push(paquete)
            numerosPaquetes[2] = numerosPaquetes[2] + 1
          }
          if (paquete.estado === "bajado"){
            PaquetesBajados.push(paquete)
            numerosPaquetes[3] = numerosPaquetes[3] + 1
          }

          numerosPaquetes[0] = numerosPaquetes[0] + 1

          setNumerosPaquetes(numerosPaquetes)
        })
        
        setChartData({
          labels: ["Todos", "Vendidos", "Stock", "Bajados"],
          datasets: [
            {

              label: "Paquetes",
              data: numerosPaquetes.map((numero) => numero),
              backgroundColor: [
                "rgba(75,192,192,1)",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0"
              ],
              borderColor: "black",
              borderWidth: 3,
              hoverBackgroundColor: 'red',
              hoverBorderColor: 'black',
              hoverBorderWidth : '3'
            }
          ]
        })
        
     
   
      });
  }

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: numerosPaquetes.map((numero) => numero),
        backgroundColor: [
        ],
        borderColor: "",
        borderWidth: 3,
        hoverBackgroundColor: 'red',
        hoverBorderColor: 'black',
        hoverBorderWidth : '4'
      }
    ]
  });

  return (
    <div className="Chart">
      <BarChart chartData={chartData} />
    </div>
  );
}

export default Home;
