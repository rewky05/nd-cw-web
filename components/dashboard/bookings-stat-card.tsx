import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { parse, isSameMonth, subMonths } from "date-fns";

const BookingsStatCard: React.FC = () => {
  const [totalBookings, setTotalBookings] = useState<number>(0);
  const [bookingGrowth, setBookingGrowth] = useState<number>(0);

  useEffect(() => {
    const fetchBookings = async () => {
      const reservationsRef = ref(database, "Reservations/ReservationsByBranch");
      const snapshot = await get(reservationsRef);

      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const now = new Date();
      const lastMonth = subMonths(now, 1);

      let currentMonthBookings = 0;
      let previousMonthBookings = 0;

      // Iterate through branches
      Object.values(data).forEach((branch: any) => {
        // Iterate through dates in each branch
        Object.keys(branch).forEach((dateKey) => {
          const parsedDate = parse(dateKey, "MM-dd-yyyy", new Date());

          // Check for completed transactions in each date
          Object.values(branch[dateKey]).forEach((transaction: any) => {
            if (transaction.status === "completed") {
              // If the transaction is from the current month
              if (isSameMonth(parsedDate, now)) {
                currentMonthBookings++;
              }
              // If the transaction is from the previous month
              else if (isSameMonth(parsedDate, lastMonth)) {
                previousMonthBookings++;
              }
            }
          });
        });
      });

      // Set the total bookings for the current month
      setTotalBookings(currentMonthBookings);

      // Calculate booking growth if there were previous bookings
      if (previousMonthBookings > 0) {
        const growth = ((currentMonthBookings - previousMonthBookings) / previousMonthBookings) * 100;
        setBookingGrowth(parseFloat(growth.toFixed(1)));
      } else {
        setBookingGrowth(0); // Set growth to 0 if there were no bookings last month
      }
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
        <p className="text-xs text-muted-foreground">
          {bookingGrowth >= 0 ? `+${bookingGrowth}%` : `${bookingGrowth}%`} from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default BookingsStatCard;
