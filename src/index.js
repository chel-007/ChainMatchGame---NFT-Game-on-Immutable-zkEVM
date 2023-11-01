import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import Logging from './Logging';
import Game from './Game';
import Logout from './Logout';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
export default function Home() {
  return (
    <BrowserRouter>
      <Routes>
          <Route exact path="/" element={<App />} />
          <Route path="/game" element={<Game />} />
          <Route path="/logging" element={<Logging />} />
          <Route path="/logout" element={<Logout />} />
      </Routes>
      </BrowserRouter>
      )
  }
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
