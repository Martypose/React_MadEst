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
        console.log(response.data)
        Paquetes = response.data;
        Paquetes.forEach((paquete,i) => {
          
          if (paquete.estado === "vendido"){
            console.log(paquete, i)
            PaquetesVendidos.push(paquete)
            numerosPaquetes[1] = numerosPaquetes[1] + 1
          }
          if (paquete.estado === "stock"){
            console.log(paquete, i)
            PaquetesStock.push(paquete)
            numerosPaquetes[2] = numerosPaquetes[2] + 1
          }
          if (paquete.estado === "bajado"){
            console.log(paquete, i)
            PaquetesBajados.push(paquete)
            numerosPaquetes[3] = numerosPaquetes[3] + 1
          }

          numerosPaquetes[0] = numerosPaquetes[0] + 1
          console.log(PaquetesBajados)
          console.log(PaquetesStock)
          console.log(PaquetesVendidos)

          setNumerosPaquetes(numerosPaquetes)


          
        })
        
        setChartData({
          labels: ["Todos", "Vendidos", "Stock", "Bajados"],
          datasets: [
            {

              label: "Paquetes",
              data: numerosPaquetes.map((numero) => numero),
              backgroundColor: [
                "black",
                "#50AF95",
                "#f3ba2f",
                "#2a71d0"
              ],
              borderColor: "black",
              borderWidth: 3,
              barThickness: 200,
              minBarLength: 0,
            }
          ]
        })
        
     
   
      });
  }

  const [chartData, setChartData] = useState({
    labels: ["Vendidos", "Stock", "Bajados"],
    datasets: [
      {
        label: "Paquetes",
        data: numerosPaquetes.map((numero) => numero),
        backgroundColor: [
          "rgba(75,192,192,1)",
          "#ecf0f1",
          "#50AF95",
          "#f3ba2f",
          "#2a71d0"
        ],
        borderColor: "black",
        borderWidth: 3
      }
    ]
  });

  return (
    <div className="App">
      <BarChart chartData={chartData} />
    </div>
  );
}

export default Home;
