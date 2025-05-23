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
const labels = ["Vata", "Pitta", "Kapha"];
const values = labels.map(label => dataObject[label] || 0);
  console.log("Chart data:", dataObject);
  const barColors = ["#FF6384", "#36A2EB", "#FFCE56"]; // Kapha, Pitta, Vata

  const data = {
    labels,
    datasets: [
      {
        label: "",
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
        text: "Vikrithi Composition",
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
        },
        title: {
          display: true,
          text: "Percentage",
        },
      },
    },
  };

  return <Bar data={data} options={options} height={250} />;
};
