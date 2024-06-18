// app/page.js
"use client";

import RevenueSimulation from "./components/RevenueSimulation";
import RewardDistribution from "./components/RewardDistribution";

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-3xl font-bold">Welcome to Candao Simulation</h1>
      <RevenueSimulation />
      <RewardDistribution />
    </div>
  );
}
