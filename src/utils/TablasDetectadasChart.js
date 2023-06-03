import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';

function TablasDetectadasChart() {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '',
                data: [],
                backgroundColor: '',
                borderColor: '',
                borderWidth: 0
            }
        ]
    });

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_URL_API}/tablasdetectadas`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    accessToken: localStorage.getItem("accessToken"),
                },
            })
            .then(response => {
                const data = response.data;
                console.log(data);

                // Creamos un objeto para contar las tablas por grosor
                let countByGrosor = data.reduce((acc, curr) => {
                    if (!acc[curr.grosor]) {
                        acc[curr.grosor] = 0;
                    }
                    acc[curr.grosor]++;
                    return acc;
                }, {});

                console.log(countByGrosor);  // Log the result
                console.log(Object.keys(countByGrosor));  // Log the result
                console.log(Object.values(countByGrosor));  // Log the result

                const labels = Object.keys(countByGrosor).map(grosor => `Grosor ${grosor}`);
                const quantities = Object.values(countByGrosor);

                console.log(labels);
                console.log(quantities);
                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: 'Tablas Detectadas',
                            data: quantities,
                            backgroundColor: 'rgba(75,192,192,0.6)',
                            borderColor: 'rgba(75,192,192,1)',
                            borderWidth: 1
                        }
                    ]
                });
            })
            .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        console.log(chartData);
    }, [chartData]);

    return (
        <div className="chart-container">
            <Bar
                data={chartData}
                options={{
                    plugins: {
                        title: {
                            display: true,
                            text: 'Tablas Detectadas por Grosor',
                        },
                        legend: {
                            display: true,
                            labels: {
                                color: 'black',
                                font: {
                                    size: 14,
                                },
                            },
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                    responsive: true,
                }}
            />
        </div>
    );
}

export default TablasDetectadasChart;
