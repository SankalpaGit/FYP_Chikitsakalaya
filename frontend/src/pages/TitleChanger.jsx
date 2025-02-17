import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TitleChanger = () => {
  const location = useLocation();

  useEffect(() => {
    let title = "Chikitsakalaya"; // Default title

    // Change title based on the route
    switch (location.pathname) {
      case "/login":
        title = "Chikitsakalaya | Login";
        break;
      case "/profile":
        title = "Profile";
        break;
      case "/about":
        title = "Chikitsakalaya | About Us";
        break;
      case "/prescription":
        title = "Prescription - Chikitsakalaya";
        break;

      case "/doctor/schedule":
        title = "Your Schedule";
        break;
        case "/doctor/dashboard":
          title = "Doctor Dashboard";
          break;
        case "/doctor/tasks":
          title = "Tasks List";
          break;
      default:
        title = "Chikitsakalaya | Home";
        break;
    }

    document.title = title; // Update the document title
  }, [location]);

  return null; // This component does not render anything
};

export default TitleChanger;
