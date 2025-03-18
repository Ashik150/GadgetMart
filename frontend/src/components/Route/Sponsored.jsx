import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom"; // Import useNavigate

ChartJS.register(ArcElement, Tooltip, Legend);

const Sponsored = () => {
  const navigate = useNavigate(); // Initialize navigation
  const { user } = useAuthStore();
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect to login if user is null (logged out)
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchCategoryDistribution = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/order/get-category-distribution/${user.email}`
        );

        console.log("API Response:", response.data);

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
  }, [user, navigate]); 

  
  if (!user) {
    return null; 
  }


  if (loading) {
    return <div>Loading...</div>;
  }

  if (categoryData.length === 0) {
    return <div>No category data available</div>;
  }

 
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

  return (
    <div className="flex justify-center items-center bg-white py-10 px-5 mb-12 cursor-pointer rounded-xl">
      <div className="w-full max-w-lg">
        <h2 className="text-center text-xl font-semibold mb-4">
          Customer Purchase Distribution
        </h2>
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default Sponsored;
