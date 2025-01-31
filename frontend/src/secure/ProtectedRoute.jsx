import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = parseInt(localStorage.getItem("tokenExpiry"), 10);
    return token && tokenExpiry > Date.now();
  });

  // Track whether authentication check is completed
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const tokenExpiry = parseInt(localStorage.getItem("tokenExpiry"), 10);

      if (token && tokenExpiry > Date.now()) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        localStorage.clear();
        navigate("/admin");
      }
      setCheckingAuth(false);
    };

    checkAuth();

    const timer = setTimeout(() => {
      window.alert("Session expired. You will be redirected shortly.");
      setTimeout(() => {
        localStorage.clear();
        setIsAuthenticated(false);
        navigate("/admin");
      }, 1000);
    }, 10 * 60 * 1000); // 10-minute session timeout

    return () => clearTimeout(timer);
  }, []);

  // Prevent redirect before checking authentication
  if (checkingAuth) {
    return <div>Loading...</div>;
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
