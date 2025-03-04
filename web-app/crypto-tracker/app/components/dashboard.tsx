"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchCryptoPrices } from "../utils/fetchCryptoPrices";
import { useState } from "react";

// Define TypeScript type for API response
interface CryptoData {
  [key: string]: { usd: number };
}

const Dashboard: React.FC = () => {
  // Fetch crypto prices using React Query
  const { data, error, isLoading, refetch } = useQuery<CryptoData, Error>({
    queryKey: ["cryptoPrices"],
    queryFn: fetchCryptoPrices,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });

  // Custom loading state for the refresh button
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [search, setSearch] = useState(""); // 🔹 Add search state

  // Function to handle refresh with delay
  const handleRefresh = async () => {
    setIsRefreshing(true); // Show loading state
    await new Promise((resolve) => setTimeout(resolve, 5000)); // Delay for 5 seconds
    await refetch(); // Fetch new data
    setIsRefreshing(false); // Remove loading state
  };

  // Handle loading & error states
  if (isLoading) return <p className="text-center text-white text-2xl">Loading...</p>;
  if (error) return <p className="text-center text-red-500 text-2xl">Error fetching data.</p>;

  // 🔹 Filter Crypto Prices Based on Search Query
  const filteredData = data
    ? Object.entries(data).filter(([key]) => key.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
     
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#E6E6FA]">

    
      {/* Transparent Card */}
      <div className="bg-white/20 backdrop-blur-md p-8 rounded-lg shadow-lg max-w-2xl w-full text-center">

        <h1 className="text-3xl font-bold text-indigo-500 mb-4">🚀 Crypto Prices Dashboard</h1>

        {/* 🔹 Search Bar */}
        <input
          type="text"
          placeholder="🔍 Search cryptocurrency..."
          value={search} // 🔹 Connect input to state
          onChange={(e) => setSearch(e.target.value)} // 🔹 Update state on change
          className="w-full p-2 border-indigo-500 text-indigo-700 placeholder-indigo-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        {/* 🔹 Filtered Crypto List */}
        <ul className="mt-4 grid grid-cols-2 gap-4">
          {filteredData.length > 0 ? (
            filteredData.map(([key, value]) => (
              <li
                key={key}
                className="p-4 bg-indigo-500 text-white rounded-lg shadow-md text-lg font-semibold flex justify-center"
                style={{ minWidth: "45%" }}
              >
                {key.toUpperCase()}: ${value.usd.toLocaleString()}
              </li>
            ))
          ) : (
            <p className="col-span-2 text-indigo-700 text-lg">No matching cryptocurrencies.</p>
          )}
        </ul>

        {/* Refresh Prices Button */}
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`mt-6 px-6 py-2 text-white font-bold rounded-md shadow-md transition duration-200 ${
            isRefreshing ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isRefreshing ? "🔄 Fetching New Prices..." : "🔄 Refresh Prices"}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
