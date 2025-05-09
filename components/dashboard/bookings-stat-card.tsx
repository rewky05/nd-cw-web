import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BookingsStatCard: React.FC = () => {
  const [totalBookings, setTotalBookings] = useState<number>(0);

  useEffect(() => {
    // Simulate booking data or replace with real fetch logic
    const fetchBookings = async () => {
      const simulatedBookings = [
        { id: 1, name: "John Doe" },
        { id: 2, name: "Jane Smith" },
        { id: 3, name: "Alice Johnson" },
        { id: 4, name: "Bob Brown" },
      ];

      setTotalBookings(simulatedBookings.length);
    };

    fetchBookings();
  }, []);

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bookings</CardTitle>
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
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{totalBookings}</div>
        <p className="text-xs text-muted-foreground">+12.5% from last month</p>
      </CardContent>
    </Card>
  );
};

export default BookingsStatCard;
