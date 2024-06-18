// app/page.js
"use client";

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import "../styles/globals.css";
import Login from './components/Login';
import RevenueSimulation from "./components/RevenueSimulation";
import RewardDistribution from "./components/RewardDistribution";

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  
  useEffect(() => {
    // Sprawdź, czy użytkownik jest już zalogowany
    if (Cookies.get('auth-token') === 'logged-in') {
      setLoggedIn(true);
    }
  }, []);

  if (!loggedIn) {
    return <Login onLogin={setLoggedIn} />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">
        Candao Revenue and Reward Simulation
      </h1>
      <RevenueSimulation />
      {/* <RewardDistribution /> */}
    </div>
  );
}
