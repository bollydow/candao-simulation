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

const RevenueSimulation = () => {
  // Parametry systemowe (stałe lub niezmieniane przez użytkownika)
  const [physicalFee, setPhysicalFee] = useState(0.05);
  const [digitalFee, setDigitalFee] = useState(0.1);
  const [fundraisingFee, setFundraisingFee] = useState(0.05);
  const [matchifyFee, setMatchifyFee] = useState(228);
  const [conversionRate, setConversionRate] = useState(0.5);
  const [operatingCost, setOperatingCost] = useState(0.2);

  // Parametry dostępne dla użytkownika
  const [socialMediaARPU, setSocialMediaARPU] = useState(120);
  const [physicalSpend, setPhysicalSpend] = useState(500);
  const [numTransactions, setNumTransactions] = useState(15);
  const [digitalSpend, setDigitalSpend] = useState(300);
  const [fundraisingAmount, setFundraisingAmount] = useState(200000);
  const [numProjects, setNumProjects] = useState(500);
  const [numUsers, setNumUsers] = useState(10000); // Mniejsza początkowa liczba użytkowników
  const [numInviteLevels, setNumInviteLevels] = useState(3); // Ustalona liczba poziomów zaproszeń

  // Dynamiczne obliczanie `Invited Users per User`
  const [invitedUsersPerUser, setInvitedUsersPerUser] = useState(0);

  useEffect(() => {
    const calculateInvitedUsersPerUser = () => {
      if (numInviteLevels === 0) return 0;

      // Obliczamy średnią liczbę zaproszonych użytkowników per użytkownik
      let usersPerLevel = Math.pow(numUsers, 1 / numInviteLevels);
      // usersPerLevel = Math.pow(10000, 1 / 3) ≈ 21.54
      setInvitedUsersPerUser(usersPerLevel);
    };

    calculateInvitedUsersPerUser();
  }, [numUsers, numInviteLevels]);

  // Funkcja obliczająca ARPU dla różnych strumieni przychodów
  const calculateARPU = () => {
    const physicalARPU = numTransactions * physicalSpend * physicalFee;
    const digitalARPU = digitalSpend * digitalFee;
    const fundraisingARPU =
      (fundraisingAmount * numProjects * fundraisingFee) / numUsers;
    const matchifyARPU = matchifyFee * conversionRate;
    const totalARPU =
      socialMediaARPU +
      physicalARPU +
      digitalARPU +
      fundraisingARPU +
      matchifyARPU;
    return {
      totalARPU,
      physicalARPU,
      digitalARPU,
      fundraisingARPU,
      matchifyARPU,
    };
  };

  // Funkcja obliczająca przychody i zyski
  const calculateProfit = () => {
    const arpu = calculateARPU();
    const totalRevenue = arpu.totalARPU * numUsers;
    const totalCost = totalRevenue * operatingCost;
    const totalProfit = totalRevenue - totalCost;
    return {
      arpu,
      totalRevenue,
      totalProfit,
    };
  };

  // Funkcja do generowania procentów przychodów z niższych poziomów
  const generateRevenueShares = (numLevels) => {
    const baseShare = 0.1; // Procent przychodów dla poziomu 1
    const reductionFactor = 0.5; // Każdy kolejny poziom dostaje mniejszy procent (można dostosować)

    const shares = [];
    for (let i = 0; i < numLevels; i++) {
      shares.push(baseShare * Math.pow(reductionFactor, i));
    }

    return shares;
  };

  // Obliczenie przychodów z zaproszonych użytkowników
  const calculateInvitedRevenue = () => {
    const arpu = calculateARPU();
    let totalInvitedRevenue = 0;
    let usersAtCurrentLevel = 1; // Zaczynamy od jednego użytkownika na najwyższym poziomie
    const maxUsers = numUsers; // Całkowita liczba użytkowników w sieci

    // Generowanie dynamicznych udziałów w przychodach dla każdego poziomu
    const revenueShares = generateRevenueShares(numInviteLevels);

    for (let i = 1; i <= numInviteLevels; i++) {
      let invitedUsersAtLevel = usersAtCurrentLevel * invitedUsersPerUser; // Liczba zaproszonych użytkowników na tym poziomie

      // Kontrola, aby liczba zaproszonych użytkowników nie przekroczyła całkowitej liczby użytkowników
      if (invitedUsersAtLevel > maxUsers) {
        invitedUsersAtLevel = maxUsers - usersAtCurrentLevel;
      }

      // Używamy revenueShares dla poziomu i-1 (bo index zaczyna się od 0)
      const revenueShare = revenueShares[i - 1] || 0; // Jeśli nie ma więcej poziomów w revenueShares, przyjmujemy 0

      // Przychody generowane przez zaproszonych użytkowników na tym poziomie
      const revenueAtLevel =
        invitedUsersAtLevel * arpu.totalARPU * revenueShare;
      totalInvitedRevenue += revenueAtLevel;

      // Aktualizujemy liczbę użytkowników na kolejnym poziomie
      usersAtCurrentLevel = invitedUsersAtLevel;
    }

    return totalInvitedRevenue;
  };
  // Obliczenie przychodów z zaproszonych użytkowników
  const calculateInvitedRevenue__ = () => {
    const arpu = calculateARPU();
    let totalInvitedRevenue = 0;
    let usersAtCurrentLevel = 1; // Zaczynamy od jednego użytkownika na najwyższym poziomie
    let cumulativeUsers = usersAtCurrentLevel; // Początkowa liczba użytkowników uwzględniająca kumulację na wszystkich poziomach

    // Generowanie dynamicznych udziałów w przychodach dla każdego poziomu
    const revenueShares = generateRevenueShares(numInviteLevels);

    for (let i = 1; i <= numInviteLevels; i++) {
      let invitedUsersAtLevel = usersAtCurrentLevel * invitedUsersPerUser; // Liczba zaproszonych użytkowników na tym poziomie

      console.log(
        "...........",
        numInviteLevels,
        usersAtCurrentLevel,
        invitedUsersPerUser,
        invitedUsersAtLevel,
      );
      // Kontrola, aby liczba zaproszonych użytkowników nie przekroczyła całkowitej liczby użytkowników
      if (cumulativeUsers + invitedUsersAtLevel > numUsers) {
        invitedUsersAtLevel = numUsers - cumulativeUsers; // Korekcja liczby użytkowników
      }

      // Używamy revenueShares dla poziomu i-1 (bo index zaczyna się od 0)
      const revenueShare = revenueShares[i - 1] || 0; // Jeśli nie ma więcej poziomów w revenueShares, przyjmujemy 0

      // Przychody generowane przez zaproszonych użytkowników na tym poziomie
      const revenueAtLevel =
        invitedUsersAtLevel * arpu.totalARPU * revenueShare;
      totalInvitedRevenue += revenueAtLevel;

      // Aktualizujemy liczbę użytkowników na kolejnym poziomie i kumulację
      usersAtCurrentLevel = invitedUsersAtLevel;
      cumulativeUsers += invitedUsersAtLevel;

      // Przerwij, jeśli osiągnięto maksymalną liczbę użytkowników
      if (cumulativeUsers >= numUsers) {
        break;
      }
    }

    return totalInvitedRevenue;
  };

  const results = calculateProfit();
  const invitedRevenue = calculateInvitedRevenue();
  const totalRevenueIncludingInvites = results.totalRevenue + invitedRevenue;

  // Formatowanie waluty USD
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Dane do wykresu
  const arpuData = {
    labels: [
      "Social Media ARPU",
      "Physical ARPU",
      "Digital ARPU",
      "Fundraising ARPU",
      "Matchify ARPU",
    ],
    datasets: [
      {
        label: "ARPU by Source (USD)",
        data: [
          socialMediaARPU,
          results.arpu.physicalARPU,
          results.arpu.digitalARPU,
          results.arpu.fundraisingARPU,
          results.arpu.matchifyARPU,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)", // Kolor dla Social Media ARPU
          "rgba(54, 162, 235, 0.2)", // Kolor dla Physical ARPU
          "rgba(255, 206, 86, 0.2)", // Kolor dla Digital ARPU
          "rgba(75, 192, 192, 0.2)", // Kolor dla Fundraising ARPU
          "rgba(153, 102, 255, 0.2)", // Kolor dla Matchify ARPU
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)", // Obrys dla Social Media ARPU
          "rgba(54, 162, 235, 1)", // Obrys dla Physical ARPU
          "rgba(255, 206, 86, 1)", // Obrys dla Digital ARPU
          "rgba(75, 192, 192, 1)", // Obrys dla Fundraising ARPU
          "rgba(153, 102, 255, 1)", // Obrys dla Matchify ARPU
        ],
        borderWidth: 1,
      },
    ],
  };

  const totalRevenueData = {
    labels: [
      "Total Revenue",
      "Revenue from Invited Users",
      "Total Revenue Including Invited Users",
    ],
    datasets: [
      {
        label: "Total Revenue by Source (USD)",
        data: [
          results.totalRevenue,
          invitedRevenue,
          totalRevenueIncludingInvites,
        ],
        backgroundColor: [
          "rgba(255, 159, 64, 0.2)", // Kolor dla Total Revenue
          "rgba(255, 99, 132, 0.2)", // Kolor dla Revenue from Invited Users
          "rgba(75, 192, 192, 0.2)", // Kolor dla Total Revenue Including Invited Users
        ],
        borderColor: [
          "rgba(255, 159, 64, 1)", // Obrys dla Total Revenue
          "rgba(255, 99, 132, 1)", // Obrys dla Revenue from Invited Users
          "rgba(75, 192, 192, 1)", // Obrys dla Total Revenue Including Invited Users
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className="mb-4 rounded-lg border bg-white p-6 shadow-lg">
      <h1 className="mb-4 text-2xl font-bold">Revenue Simulation</h1>

      {/* Sekcja dla parametrów systemowych */}
      <div className="mb-6 rounded-lg bg-gray-100 p-4 shadow-md">
        <h2 className="mb-4 text-xl font-bold">System Parameters (Fixed)</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <label className="block">
            <span className="text-gray-700">Physical Fee (%):</span>
            <input
              className="mt-1 block w-full"
              type="range"
              min="0"
              max="100"
              step="0.01"
              value={physicalFee * 100} // Przekonwertowanie na skalę 0-100 dla suwaka
              onChange={(e) => setPhysicalFee(Number(e.target.value) / 100)} // Przekonwertowanie z powrotem na skalę 0-1
            />
            <span>{(physicalFee * 100).toFixed(2)}%</span>
            <span className="block text-sm text-gray-500">
              Fee percentage applied to each physical transaction.
            </span>
          </label>

          <label className="block">
            <span className="text-gray-700">Digital Fee (%):</span>
            <input
              className="mt-1 block w-full"
              type="range"
              min="0"
              max="100"
              step="0.01"
              value={digitalFee * 100} // Przekonwertowanie na skalę 0-100 dla suwaka
              onChange={(e) => setDigitalFee(Number(e.target.value) / 100)} // Przekonwertowanie z powrotem na skalę 0-1
            />
            <span>{(digitalFee * 100).toFixed(2)}%</span>
            <span className="block text-sm text-gray-500">
              Fee percentage applied to digital goods purchases.
            </span>
          </label>

          <label className="block">
            <span className="text-gray-700">Fundraising Fee (%):</span>
            <input
              className="mt-1 block w-full"
              type="range"
              min="0"
              max="100"
              step="0.01"
              value={fundraisingFee * 100} // Przekonwertowanie na skalę 0-100 dla suwaka
              onChange={(e) => setFundraisingFee(Number(e.target.value) / 100)} // Przekonwertowanie z powrotem na skalę 0-1
            />
            <span>{(fundraisingFee * 100).toFixed(2)}%</span>
            <span className="block text-sm text-gray-500">
              Fee percentage applied to funds raised through projects.
            </span>
          </label>

          <label className="block">
            <span className="text-gray-700">Matchify Fee (USD):</span>
            <input
              className="focus:ring-opacity-50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
              type="number"
              value={matchifyFee}
              onChange={(e) => setMatchifyFee(Number(e.target.value))}
              min="0"
              step="0.01"
            />
            <span className="text-sm text-gray-500">
              Monthly fee for the Matchify subscription service.
            </span>
          </label>

          <label className="block">
            <span className="text-gray-700">Conversion Rate (%):</span>
            <input
              className="mt-1 block w-full"
              type="range"
              min="0"
              max="100"
              step="0.01"
              value={conversionRate * 100} // Przekonwertowanie na skalę 0-100 dla suwaka
              onChange={(e) => setConversionRate(Number(e.target.value) / 100)} // Przekonwertowanie z powrotem na skalę 0-1
            />
            <span>{(conversionRate * 100).toFixed(2)}%</span>
            <span className="block text-sm text-gray-500">
              Percentage of users who convert to paying subscribers.
            </span>
          </label>

          <label className="block">
            <span className="text-gray-700">Operating Cost (%):</span>
            <input
              className="mt-1 block w-full"
              type="range"
              min="0"
              max="100"
              step="0.01"
              value={operatingCost * 100} // Przekonwertowanie na skalę 0-100 dla suwaka
              onChange={(e) => setOperatingCost(Number(e.target.value) / 100)} // Przekonwertowanie z powrotem na skalę 0-1
            />
            <span>{(operatingCost * 100).toFixed(2)}%</span>
            <span className="block text-sm text-gray-500">
              Percentage of total revenue spent on operating costs.
            </span>
          </label>
        </div>
      </div>

      {/* Sekcja dla parametrów dostępnych dla użytkownika */}
      <div className="mt-6">
        <div className="mb-6 rounded-lg bg-gray-100 p-4 shadow-md">
          <h2 className="mb-4 text-xl font-bold">
            User-Configurable Parameters
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="text-gray-700">Social Media ARPU (USD):</span>
              <input
                className="focus:ring-opacity-50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                type="number"
                value={socialMediaARPU}
                onChange={(e) => setSocialMediaARPU(Number(e.target.value))}
                min="0"
                step="0.01"
              />
              <span className="text-sm text-gray-500">
                Average annual revenue per user from social media activities.
              </span>
            </label>

            <label className="block">
              <span className="text-gray-700">Digital Spend (USD):</span>
              <input
                className="focus:ring-opacity-50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                type="number"
                value={digitalSpend}
                onChange={(e) => setDigitalSpend(Number(e.target.value))}
                min="0"
                step="0.01"
              />
              <span className="text-sm text-gray-500">
                Average annual spend on digital goods per user.
              </span>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="text-gray-700">
                Physical Spend per Transaction (USD):
              </span>
              <input
                className="focus:ring-opacity-50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                type="number"
                value={physicalSpend}
                onChange={(e) => setPhysicalSpend(Number(e.target.value))}
                min="0"
                step="0.01"
              />
              <span className="text-sm text-gray-500">
                Average amount spent per physical transaction.
              </span>
            </label>

            <label className="block">
              <span className="text-gray-700">
                Number of Transactions per Year:
              </span>
              <input
                className="focus:ring-opacity-50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                type="number"
                value={numTransactions}
                onChange={(e) => setNumTransactions(Number(e.target.value))}
                min="0"
                step="1"
              />
              <span className="text-sm text-gray-500">
                Average number of physical transactions per user annually.
              </span>
            </label>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="text-gray-700">
                Fundraising Amount per Project (USD):
              </span>
              <input
                className="focus:ring-opacity-50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                type="number"
                value={fundraisingAmount}
                onChange={(e) => setFundraisingAmount(Number(e.target.value))}
                min="0"
                step="0.01"
              />
              <span className="text-sm text-gray-500">
                Average amount raised per fundraising project.
              </span>
            </label>

            <label className="block">
              <span className="text-gray-700">
                Number of Fundraising Projects:
              </span>
              <input
                className="focus:ring-opacity-50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                type="number"
                value={numProjects}
                onChange={(e) => setNumProjects(Number(e.target.value))}
                min="0"
                step="1"
              />
              <span className="text-sm text-gray-500">
                Number of fundraising projects initiated by users.
              </span>
            </label>
          </div>

          <hr className="mt-4" />

          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <label className="block">
              <span className="text-gray-700">Number of Users:</span>
              <input
                className="focus:ring-opacity-50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                type="number"
                value={numUsers}
                onChange={(e) => setNumUsers(Number(e.target.value))}
                min="0"
                step="1"
              />
              <span className="text-sm text-gray-500">
                Total number of users in the network.
              </span>
            </label>

            <label className="block">
              <span className="text-gray-700">Number of Invite Levels:</span>
              <input
                className="focus:ring-opacity-50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                type="number"
                value={numInviteLevels}
                onChange={(e) => setNumInviteLevels(Number(e.target.value))}
                min="0"
                step="1"
              />
              <span className="text-sm text-gray-500">
                Number of levels of invited users to consider.
              </span>
            </label>

            {/* block */}
            <label className="hidden">
              <span className="text-gray-700">
                Invited Users per User (Simulated):
              </span>
              <input
                className="focus:ring-opacity-50/50 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
                type="number"
                value={invitedUsersPerUser}
                readOnly // Pole tylko do odczytu, bo jest obliczane automatycznie
              />
              <span className="text-sm text-gray-500">
                Estimated number of users each existing user invites.
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Wyniki symulacji */}
      <h2 className="mb-4 mt-6 text-xl font-bold">Results</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="mb-2">
          <p>
            Total ARPU: <b>{formatCurrency(results.arpu.totalARPU)}</b>
          </p>
          <span className="text-sm text-gray-500">
            Average Revenue Per User (ARPU) is the average annual revenue
            generated by each user from all sources combined.
          </span>
        </div>

        <div className="mb-2">
          <p>
            Total Annual Revenue: <b>{formatCurrency(results.totalRevenue)}</b>
          </p>
          <span className="text-sm text-gray-500">
            Total Annual Revenue is the sum of all revenues generated by all
            users in the network over one year.
          </span>
        </div>

        <div className="mb-2">
          <p>
            Revenue from Invited Users: <b>{formatCurrency(invitedRevenue)}</b>
          </p>
          <span className="text-sm text-gray-500">
            Revenue from Invited Users represents the additional revenue
            generated by users who were invited by others in the network, across
            all levels.
          </span>
        </div>

        <div className="mb-2">
          <p>
            Total Revenue Including Invited Users:{" "}
            <b>{formatCurrency(totalRevenueIncludingInvites)}</b>
          </p>
          <span className="text-sm text-gray-500">
            Total Revenue Including Invited Users is the combined total of the
            direct annual revenue and the revenue generated from invited users.
          </span>
        </div>

        <div className="mb-2">
          <p>
            Total Annual Profit: <b>{formatCurrency(results.totalProfit)}</b>
          </p>
          <span className="text-sm text-gray-500">
            Total Annual Profit is the total annual revenue minus the operating
            costs, representing the net profit over one year.
          </span>
        </div>
      </div>

      {/* Dodajemy wykres słupkowy */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="mt-4">
          <h3 className="mb-4 text-lg font-bold">ARPU Breakdown by Source</h3>
          <Bar
            data={arpuData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "ARPU Breakdown" },
              },
            }}
          />
        </div>
        <div className="mt-4">
          <h3 className="mb-4 text-lg font-bold">
            Total Revenue Breakdown by Source
          </h3>
          <Bar
            data={totalRevenueData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: "top" },
                title: { display: true, text: "Total Revenue Breakdown" },
              },
            }}
          />
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="mb-4 rounded-lg border bg-white p-6 shadow-lg">
  //     <h1 className="mb-4 text-2xl font-bold">Revenue Simulation</h1>

  //     {/* Sekcja dla parametrów systemowych */}
  //     <div className="mb-6 rounded-lg bg-gray-100 p-4 shadow-md">
  //       <h2 className="mb-4 text-xl font-bold">System Parameters (Fixed)</h2>
  //       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  //         <label className="block">
  //           <span className="text-gray-700">Physical Fee (%):</span>
  //           <input
  //             className="mt-1 block w-full"
  //             type="range"
  //             min="0"
  //             max="100"
  //             step="0.01"
  //             value={physicalFee * 100} // Przekonwertowanie na skalę 0-100 dla suwaka
  //             onChange={(e) => setPhysicalFee(Number(e.target.value) / 100)} // Przekonwertowanie z powrotem na skalę 0-1
  //           />
  //           <span>{(physicalFee * 100).toFixed(2)}%</span>
  //           <span className="block text-sm text-gray-500">
  //             Fee percentage applied to each physical transaction.
  //           </span>
  //         </label>

  //         <label className="block">
  //           <span className="text-gray-700">Digital Fee (%):</span>
  //           <input
  //             className="mt-1 block w-full"
  //             type="range"
  //             min="0"
  //             max="100"
  //             step="0.01"
  //             value={digitalFee * 100} // Przekonwertowanie na skalę 0-100 dla suwaka
  //             onChange={(e) => setDigitalFee(Number(e.target.value) / 100)} // Przekonwertowanie z powrotem na skalę 0-1
  //           />
  //           <span>{(digitalFee * 100).toFixed(2)}%</span>
  //           <span className="block text-sm text-gray-500">
  //             Fee percentage applied to digital goods purchases.
  //           </span>
  //         </label>

  //         <label className="block">
  //           <span className="text-gray-700">Fundraising Fee (%):</span>
  //           <input
  //             className="mt-1 block w-full"
  //             type="range"
  //             min="0"
  //             max="100"
  //             step="0.01"
  //             value={fundraisingFee * 100} // Przekonwertowanie na skalę 0-100 dla suwaka
  //             onChange={(e) => setFundraisingFee(Number(e.target.value) / 100)} // Przekonwertowanie z powrotem na skalę 0-1
  //           />
  //           <span>{(fundraisingFee * 100).toFixed(2)}%</span>
  //           <span className="block text-sm text-gray-500">
  //             Fee percentage applied to funds raised through projects.
  //           </span>
  //         </label>

  //         <label className="block">
  //           <span className="text-gray-700">Matchify Fee (USD):</span>
  //           <input
  //             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50/50/50"
  //             type="number"
  //             value={matchifyFee}
  //             onChange={(e) => setMatchifyFee(Number(e.target.value))}
  //             min="0"
  //             step="0.01"
  //           />
  //           <span className="text-sm text-gray-500">
  //             Monthly fee for the Matchify subscription service.
  //           </span>
  //         </label>

  //         <label className="block">
  //           <span className="text-gray-700">Conversion Rate (%):</span>
  //           <input
  //             className="mt-1 block w-full"
  //             type="range"
  //             min="0"
  //             max="100"
  //             step="0.01"
  //             value={conversionRate * 100} // Przekonwertowanie na skalę 0-100 dla suwaka
  //             onChange={(e) => setConversionRate(Number(e.target.value) / 100)} // Przekonwertowanie z powrotem na skalę 0-1
  //           />
  //           <span>{(conversionRate * 100).toFixed(2)}%</span>
  //           <span className="block text-sm text-gray-500">
  //             Percentage of users who convert to paying subscribers.
  //           </span>
  //         </label>

  //         <label className="block">
  //           <span className="text-gray-700">Operating Cost (%):</span>
  //           <input
  //             className="mt-1 block w-full"
  //             type="range"
  //             min="0"
  //             max="100"
  //             step="0.01"
  //             value={operatingCost * 100} // Przekonwertowanie na skalę 0-100 dla suwaka
  //             onChange={(e) => setOperatingCost(Number(e.target.value) / 100)} // Przekonwertowanie z powrotem na skalę 0-1
  //           />
  //           <span>{(operatingCost * 100).toFixed(2)}%</span>
  //           <span className="block text-sm text-gray-500">
  //             Percentage of total revenue spent on operating costs.
  //           </span>
  //         </label>
  //       </div>
  //     </div>

  //     {/* Sekcja dla parametrów dostępnych dla użytkownika */}
  //     <div className="mt-6">
  //       <div className="mb-6 rounded-lg bg-gray-100 p-4 shadow-md">
  //         <h2 className="mb-4 text-xl font-bold">
  //           User-Configurable Parameters
  //         </h2>
  //         <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  //           <label className="block">
  //             <span className="text-gray-700">Social Media ARPU (USD):</span>
  //             <input
  //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50/50/50"
  //               type="number"
  //               value={socialMediaARPU}
  //               onChange={(e) => setSocialMediaARPU(Number(e.target.value))}
  //               min="0"
  //               step="0.01"
  //             />
  //             <span className="text-sm text-gray-500">
  //               Average annual revenue per user from social media activities.
  //             </span>
  //           </label>

  //           <label className="block">
  //             <span className="text-gray-700">Digital Spend (USD):</span>
  //             <input
  //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50/50/50"
  //               type="number"
  //               value={digitalSpend}
  //               onChange={(e) => setDigitalSpend(Number(e.target.value))}
  //               min="0"
  //               step="0.01"
  //             />
  //             <span className="text-sm text-gray-500">
  //               Average annual spend on digital goods per user.
  //             </span>
  //           </label>
  //         </div>

  //         <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  //           <label className="block">
  //             <span className="text-gray-700">
  //               Physical Spend per Transaction (USD):
  //             </span>
  //             <input
  //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50/50/50"
  //               type="number"
  //               value={physicalSpend}
  //               onChange={(e) => setPhysicalSpend(Number(e.target.value))}
  //               min="0"
  //               step="0.01"
  //             />
  //             <span className="text-sm text-gray-500">
  //               Average amount spent per physical transaction.
  //             </span>
  //           </label>

  //           <label className="block">
  //             <span className="text-gray-700">
  //               Number of Transactions per Year:
  //             </span>
  //             <input
  //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50/50/50"
  //               type="number"
  //               value={numTransactions}
  //               onChange={(e) => setNumTransactions(Number(e.target.value))}
  //               min="0"
  //               step="1"
  //             />
  //             <span className="text-sm text-gray-500">
  //               Average number of physical transactions per user annually.
  //             </span>
  //           </label>
  //         </div>

  //         <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  //           <label className="block">
  //             <span className="text-gray-700">
  //               Fundraising Amount per Project (USD):
  //             </span>
  //             <input
  //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50/50/50"
  //               type="number"
  //               value={fundraisingAmount}
  //               onChange={(e) => setFundraisingAmount(Number(e.target.value))}
  //               min="0"
  //               step="0.01"
  //             />
  //             <span className="text-sm text-gray-500">
  //               Average amount raised per fundraising project.
  //             </span>
  //           </label>

  //           <label className="block">
  //             <span className="text-gray-700">
  //               Number of Fundraising Projects:
  //             </span>
  //             <input
  //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50/50/50"
  //               type="number"
  //               value={numProjects}
  //               onChange={(e) => setNumProjects(Number(e.target.value))}
  //               min="0"
  //               step="1"
  //             />
  //             <span className="text-sm text-gray-500">
  //               Number of fundraising projects initiated by users.
  //             </span>
  //           </label>
  //         </div>

  //         <hr className="mt-4" />

  //         <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
  //           <label className="block">
  //             <span className="text-gray-700">Number of Users:</span>
  //             <input
  //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50/50/50"
  //               type="number"
  //               value={numUsers}
  //               onChange={(e) => setNumUsers(Number(e.target.value))}
  //               min="0"
  //               step="1"
  //             />
  //             <span className="text-sm text-gray-500">
  //               Total number of users in the network.
  //             </span>
  //           </label>

  //           <label className="block">
  //             <span className="text-gray-700">Number of Invite Levels:</span>
  //             <input
  //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50/50/50"
  //               type="number"
  //               value={numInviteLevels}
  //               onChange={(e) => setNumInviteLevels(Number(e.target.value))}
  //               min="0"
  //               step="1"
  //             />
  //             <span className="text-sm text-gray-500">
  //               Number of levels of invited users to consider.
  //             </span>
  //           </label>

  //           <label className="block hidden">
  //             <span className="text-gray-700">
  //               Invited Users per User (Simulated):
  //             </span>
  //             <input
  //               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50/50/50"
  //               type="number"
  //               value={invitedUsersPerUser}
  //               readOnly // Pole tylko do odczytu, bo jest obliczane automatycznie
  //             />
  //             <span className="text-sm text-gray-500">
  //               Estimated number of users each existing user invites.
  //             </span>
  //           </label>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Wyniki symulacji */}
  //     <h2 className="mb-4 mt-6 text-xl font-bold">Results</h2>
  //     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  //       <div className="mb-2">
  //         <p>
  //           Total ARPU: <b>{formatCurrency(results.arpu.totalARPU)}</b>
  //         </p>
  //         <span className="text-sm text-gray-500">
  //           Average Revenue Per User (ARPU) is the average annual revenue
  //           generated by each user from all sources combined.
  //         </span>
  //       </div>

  //       <div className="mb-2">
  //         <p>
  //           Total Annual Revenue: <b>{formatCurrency(results.totalRevenue)}</b>
  //         </p>
  //         <span className="text-sm text-gray-500">
  //           Total Annual Revenue is the sum of all revenues generated by all
  //           users in the network over one year.
  //         </span>
  //       </div>

  //       <div className="mb-2">
  //         <p>
  //           Revenue from Invited Users: <b>{formatCurrency(invitedRevenue)}</b>
  //         </p>
  //         <span className="text-sm text-gray-500">
  //           Revenue from Invited Users represents the additional revenue
  //           generated by users who were invited by others in the network, across
  //           all levels.
  //         </span>
  //       </div>

  //       <div className="mb-2">
  //         <p>
  //           Total Revenue Including Invited Users:{" "}
  //           <b>{formatCurrency(totalRevenueIncludingInvites)}</b>
  //         </p>
  //         <span className="text-sm text-gray-500">
  //           Total Revenue Including Invited Users is the combined total of the
  //           direct annual revenue and the revenue generated from invited users.
  //         </span>
  //       </div>

  //       <div className="mb-2">
  //         <p>
  //           Total Annual Profit: <b>{formatCurrency(results.totalProfit)}</b>
  //         </p>
  //         <span className="text-sm text-gray-500">
  //           Total Annual Profit is the total annual revenue minus the operating
  //           costs, representing the net profit over one year.
  //         </span>
  //       </div>
  //     </div>

  //     {/* Dodajemy wykres słupkowy */}
  //     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  //       <div className="mt-4">
  //         <h3 className="mb-4 text-lg font-bold">ARPU Breakdown by Source</h3>
  //         <Bar
  //           data={arpuData}
  //           options={{
  //             responsive: true,
  //             plugins: {
  //               legend: { position: "top" },
  //               title: { display: true, text: "ARPU Breakdown" },
  //             },
  //           }}
  //         />
  //       </div>
  //       <div className="mt-4">
  //         <h3 className="mb-4 text-lg font-bold">
  //           Total Revenue Breakdown by Source
  //         </h3>
  //         <Bar
  //           data={totalRevenueData}
  //           options={{
  //             responsive: true,
  //             plugins: {
  //               legend: { position: "top" },
  //               title: { display: true, text: "Total Revenue Breakdown" },
  //             },
  //           }}
  //         />
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default RevenueSimulation;
