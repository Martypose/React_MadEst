import { Bar } from "react-chartjs-2";

export const BarChart = ({ chartData }) => {
  return (
    <div className="chart-container">
      <h2 style={{ textAlign: "center" }}>Existencias</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Existencias 2023",
            },
            legend: {
              display: false,
              labels: {
                color: 'red',
                backgroundColor: 'black'
              }
            }
          },
          scales: {
            y: {
              ticks: { color: 'black', beginAtZero: true }
            },
            x: {
              ticks: { color: 'black', beginAtZero: true }
            }
          }
        }}
      />
    </div>
  );
};