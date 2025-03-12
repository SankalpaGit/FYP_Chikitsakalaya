
import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import TitleChanger from "./pages/TitleChanger";
import App from './App.jsx'
import './App.css'
window.global = window;


createRoot(document.getElementById('root')).render(
  < Router>
  <TitleChanger />
    <StrictMode>
      
      <App />
    </StrictMode>
  </Router>
)
