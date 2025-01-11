import React, { useEffect, useMemo, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState(false);

  const isAuthenticated = useMemo(() => {
    const token = localStorage.getItem("token");
    const tokenExpiry = parseInt(localStorage.getItem("tokenExpiry"), 10);
    return token && tokenExpiry > Date.now();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
      return;
    }

    const timer = setTimeout(() => {
      window.alert("Session expired. You will be redirected shortly.");
      setTimeout(() => {
        localStorage.clear();
        setRedirect(true);
      }, 1000);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated || redirect) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;