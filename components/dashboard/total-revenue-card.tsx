import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock or real data fetching can be added here
const TotalRevenueCard: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);

  useEffect(() => {
    // Simulate calculating revenue (replace with real logic or API call)
    const fetchRevenue = async () => {
      // Example: hardcoded or simulated data
      const simulatedStats = {
        orders: [
          { amount: 5000 },
          { amount: 3500 },
          { amount: 6200 },
          { amount: 8500 },
        ],
      };

      const revenue = simulatedStats.orders.reduce(
        (sum, order) => sum + order.amount,
        0
      );

      setTotalRevenue(revenue);
    };

    fetchRevenue();
  }, []);

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-[#FFD000]"
        >
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">₱{totalRevenue.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
      </CardContent>
    </Card>
  );
};

export default TotalRevenueCard;
