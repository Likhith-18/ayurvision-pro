// BarChart.js
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const BarChart = ({ dataObject }) => {
  const labels = Object.keys(dataObject);
  const values = Object.values(dataObject);
  console.log("Chart data:", dataObject);
  const barColors = ["#FF6384", "#36A2EB", "#FFCE56"]; // Kapha, Pitta, Vata

  const data = {
    labels,
    datasets: [
      {
        label: "Percentage",
        data: values,
        backgroundColor: barColors,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw}%`,
        },
      },
      title: {
        display: true,
        text: "Prakriti Composition",
        font: {
          size: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: (value) => `${value}%`,
        },
        title: {
          display: true,
          text: "Percentage",
        },
      },
      x: {
        title: {
          display: true,
          text: "Doshas",
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};
