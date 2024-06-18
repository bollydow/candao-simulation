"use client";

import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const RewardDistribution = () => {
  const [numUsers, setNumUsers] = useState(1000000);
  const [levels, setLevels] = useState(5);
  const [totalRewards, setTotalRewards] = useState(1000000);
  const [equalDistribution, setEqualDistribution] = useState(50);
  const [tokenDistribution, setTokenDistribution] = useState(50);
  const [userTokens, setUserTokens] = useState(1000);

  // Formatter do waluty USD
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // Maksymalna liczba poziomów na podstawie liczby użytkowników
  const maxLevels = Math.floor(Math.log2(numUsers)) + 2;

  console.log("maxLevels", maxLevels);

  // Funkcja do obsługi zmian wartości procentowych
  const handlePercentageChange = (setter) => (e) => {
    const value = Math.max(0, Math.min(100, Number(e.target.value)));
    setter(value);
  };

  // Funkcja do obsługi zmian liczby poziomów z walidacją
  const handleLevelsChange = (e) => {
    const value = Number(e.target.value);
    if (value > maxLevels) {
      setLevels(maxLevels);
    } else if (value < 1) {
      setLevels(1);
    } else {
      setLevels(value);
    }
  };

  // Generowanie struktury sieci zgodnie z wykładniczym wzrostem
  const generateNetworkStructure = () => {
    const structure = [];
    let remainingUsers = numUsers;

    for (let i = 0; i < levels; i++) {
      const usersAtLevel = Math.min(remainingUsers, Math.pow(2, i));
      structure.push({ level: i + 1, users: usersAtLevel });
      remainingUsers -= usersAtLevel;
      if (remainingUsers <= 0) break;
    }

    // Jeśli pozostało więcej użytkowników, dodaj ich do najwyższego poziomu
    if (remainingUsers > 0) {
      structure[structure.length - 1].users += remainingUsers;
    }

    return structure;
  };

  // Obliczanie dystrybucji nagród
  const calculateRewardsDistribution = () => {
    const network = generateNetworkStructure();

    // Obliczenie całkowitych nagród na podstawie procentów dystrybucji
    const totalEqualRewards = totalRewards * (equalDistribution / 100);
    const totalTokenRewards = totalRewards * (tokenDistribution / 100);

    // Obliczenie nagród równych na użytkownika
    let equalRewardsPerUser = numUsers > 0 ? totalEqualRewards / numUsers : 0;

    // Obliczenie nagród na podstawie tokenów
    const totalTokensInNetwork = network.reduce(
      (sum, level) => sum + level.users * userTokens,
      0,
    );
    let tokenRewardsPerToken =
      totalTokensInNetwork > 0 ? totalTokenRewards / totalTokensInNetwork : 0;

    // Zapewnienie minimalnej dystrybucji nagród przy zerowych wartościach procentowych
    if (equalDistribution === 0 && tokenDistribution === 0) {
      equalRewardsPerUser = totalRewards / numUsers; // Dystrybucja równa na wszystkich użytkowników
      tokenRewardsPerToken = 0; // Brak nagród opartych na tokenach
    }

    // Akumulacja nagród od najwyższego poziomu do niższych
    let accumulatedRewards = 0;
    const rewardsDistribution = [];

    for (let i = network.length - 1; i >= 0; i--) {
      const { level, users } = network[i];

      // Nagrody na użytkownika na tym poziomie, bez akumulacji z niższych poziomów
      const baseRewardsPerUser =
        equalRewardsPerUser + tokenRewardsPerToken * userTokens;

      // Dodanie nagród akumulowanych z wyższych poziomów
      const totalRewardsPerUser =
        baseRewardsPerUser + accumulatedRewards / users;

      // Całkowite nagrody dla poziomu
      const totalRewardsForLevel = totalRewardsPerUser * users;

      // Akumulowanie nagród dla niższych poziomów
      accumulatedRewards += baseRewardsPerUser * users; // Używamy baseRewardsPerUser do akumulacji

      rewardsDistribution.unshift({
        level,
        users,
        totalRewards: totalRewardsForLevel,
        rewardsPerUser: totalRewardsPerUser,
      });
      console.log("rewardsDistribution", rewardsDistribution);
    }

    // Korekta, aby suma nagród nie przekraczała całkowitych dostępnych nagród
    const totalDistributedRewards = rewardsDistribution.reduce(
      (sum, level) => sum + level.totalRewards,
      0,
    );
    if (totalDistributedRewards > totalRewards) {
      const correctionFactor = totalRewards / totalDistributedRewards;
      return rewardsDistribution.map((level) => ({
        ...level,
        totalRewards: level.totalRewards * correctionFactor,
        rewardsPerUser: level.rewardsPerUser * correctionFactor,
      }));
    }

    return rewardsDistribution;
  };

  // Dynamicznie aktualizowane dane
  const [rewardsDistribution, setRewardsDistribution] = useState([]);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    console.log("useEffect ", equalDistribution, tokenDistribution);
    const distribution = calculateRewardsDistribution();
    setRewardsDistribution(distribution);
    setChartData({
      labels: distribution.map((level) => `Level ${level.level}`),
      datasets: [
        {
          label: "Total Rewards (USD)",
          data: distribution.map((level) => level.totalRewards),
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
        {
          label: "Number of Users",
          data: distribution.map((level) => level.users),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  }, [
    numUsers,
    levels,
    totalRewards,
    equalDistribution,
    tokenDistribution,
    userTokens,
    calculateRewardsDistribution,
  ]);

  // Obliczenia do podsumowania
  const totalUsers = rewardsDistribution.reduce(
    (acc, level) => acc + level.users,
    0,
  );
  const totalRewardSum = rewardsDistribution.reduce(
    (acc, level) => acc + level.totalRewards,
    0,
  );

  return (
    <div className="mb-4 rounded-lg border bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">
        Reward Distribution Simulation
      </h1>
      <div className="mb-6 rounded-lg bg-gray-100 p-4 shadow-md">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="text-gray-700">Total Number of Users:</span>
            <input
              className="focus:ring-opacity-50/50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              type="number"
              min="1"
              value={numUsers}
              onChange={(e) => setNumUsers(Math.max(1, Number(e.target.value)))}
            />
          </label>
          <label className="block">
            <span className="text-gray-700">
              Number of Levels in Network (Max: {maxLevels}):
            </span>
            <input
              className="focus:ring-opacity-50/50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              type="number"
              min="1"
              max={maxLevels}
              value={levels}
              onChange={handleLevelsChange}
            />
          </label>
          <label className="block">
            <span className="text-gray-700">
              Total Rewards to Distribute (USD):
            </span>
            <input
              className="focus:ring-opacity-50/50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              type="number"
              value={totalRewards}
              onChange={(e) =>
                setTotalRewards(Math.max(0, Number(e.target.value)))
              }
            />
          </label>
          <label className="block">
            <span className="text-gray-700">
              Percentage of Rewards Distributed Equally (%):
            </span>
            <input
              className="mt-1 block w-full"
              type="range"
              min="0"
              max="100"
              value={equalDistribution}
              onChange={handlePercentageChange(setEqualDistribution)}
            />
            <span>{equalDistribution}%</span>
          </label>
          <label className="block">
            <span className="text-gray-700">
              Percentage of Rewards Distributed Based on Tokens (%):
            </span>
            <input
              className="mt-1 block w-full"
              type="range"
              min="0"
              max="100"
              value={tokenDistribution}
              onChange={handlePercentageChange(setTokenDistribution)}
            />
            <span>{tokenDistribution}%</span>
          </label>
          <label className="block">
            <span className="text-gray-700">
              Average Number of Tokens per User:
            </span>
            <input
              className="focus:ring-opacity-50/50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              type="number"
              value={userTokens}
              onChange={(e) =>
                setUserTokens(Math.max(0, Number(e.target.value)))
              }
            />
          </label>
        </div>
      </div>
      <h2 className="mb-4 mt-6 text-xl font-bold">Results</h2>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Level</th>
            <th className="border p-2">Number of Users</th>
            <th className="border p-2">Total Rewards (USD)</th>
            <th className="border p-2">Rewards per User (USD)</th>
          </tr>
        </thead>
        <tbody>
          {rewardsDistribution.map((levelInfo, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">{levelInfo.level}</td>
              <td className="border p-2 text-center">{levelInfo.users}</td>
              <td className="border p-2 text-center">
                {currencyFormatter.format(levelInfo.totalRewards)}
              </td>
              <td className="border p-2 text-center">
                {currencyFormatter.format(levelInfo.rewardsPerUser)}
              </td>
            </tr>
          ))}
          {/* Dodajemy wiersz podsumowania */}
          <tr className="font-bold">
            <td className="border p-2 text-center">Total</td>
            <td className="border p-2 text-center">{totalUsers}</td>
            <td className="border p-2 text-center">
              {currencyFormatter.format(totalRewardSum)}
            </td>
            <td className="border p-2 text-center">-</td>
          </tr>
        </tbody>
      </table>

      {/* Dodajemy wykres słupkowy */}
      <div className="mt-4">
        <h3 className="mb-4 text-lg font-bold">
          Rewards Distribution by Level
        </h3>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Rewards Distribution" },
            },
          }}
        />
      </div>
    </div>
  );
};

export default RewardDistribution;
