import { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout(); // call the logout action from your store
        toast.success("Logout successful!");
        navigate("/"); // redirect to HomePage (assuming HomePage is at "/")
      } catch (error) {
        toast.error("Error logging out");
      }
    };

    performLogout();
  }, [logout, navigate]);

  // Return null because no UI is needed on this page.
  return null;
};

export default DashboardPage;
