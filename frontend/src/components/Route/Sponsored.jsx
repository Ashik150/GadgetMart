import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import axios from "axios"; // Make sure axios is installed for API calls
import { useAuthStore } from "../../store/authStore";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Import datalabels plugin

// Register the required Chart.js components and the datalabels plugin
ChartJS.register(ArcElement, Tooltip, Legend, Title, ChartDataLabels);

const Sponsored = () => {
  const { user } = useAuthStore();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get the logged-in user's email
  const userEmail = user.email;

  // Fetch category distribution from the backend
  useEffect(() => {
    if (!userEmail) {
      console.error("User email not found in localStorage");
      setLoading(false);
      return;
    }

    const fetchCategoryDistribution = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/order/get-category-distribution/${userEmail}`
        );

        console.log("API Response:", response.data); // Log API response

        if (response.data.success) {
          setCategoryData(response.data.categoryPercentage);
        } else {
          console.error("Failed to fetch category distribution");
        }
      } catch (error) {
        console.error("Error fetching category distribution:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDistribution();
  }, [userEmail]);

  // Calculate total value for category data
  const totalPercentage = categoryData.reduce(
    (total, item) => total + parseFloat(item.percentage),
    0
  );

  // Format the data for the Pie chart
  const chartData = {
    labels: categoryData.map((item) => item.category),
    datasets: [
      {
        label: "Product Categories",
        data: categoryData.map((item) => parseFloat(item.percentage)),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      },
    ],
  };

  // Options for displaying percentage labels inside the pie chart
  const chartOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.label || "";
            let value = context.raw;
            let percentage = ((value / totalPercentage) * 100).toFixed(2);
            return `${label}: ${percentage}%`; // Show percentage in tooltip
          },
        },
      },
      datalabels: {
        display: true,
        formatter: (value) => {
          let percentage = ((value / totalPercentage) * 100).toFixed(2);
          return `${percentage}%`; // Show percentage inside the pie chart
        },
        color: "#fff", // Set the color of the labels (optional)
        font: {
          weight: "bold",
          size: 14, // Adjust the font size
        },
      },
    },
  };

  // Handle loading and empty data
  if (loading) {
    return <div>Loading...</div>;
  }

  if (categoryData.length === 0) {
    return <div>No category data available</div>;
  }

  return (
    <div className="flex justify-center items-center bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl">
      <div className="w-full max-w-lg">
        <h2 className="text-center text-xl font-semibold mb-4">
          Purchase Breakdown by Category
        </h2>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Sponsored;
