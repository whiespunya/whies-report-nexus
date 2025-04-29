
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "@/utils/routes";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login page
    navigate(ROUTES.LOGIN);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Whies Industri Indonesia</h1>
        <p className="text-xl text-gray-600">Redirecting you to the login page...</p>
      </div>
    </div>
  );
};

export default Index;
