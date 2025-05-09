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

const TotalRevenueCard: React.FC = () => {
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [revenueGrowth, setRevenueGrowth] = useState<number>(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      const reservationsRef = ref(database, "Reservations/ReservationsByBranch");
      const snapshot = await get(reservationsRef);

      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const now = new Date();
      const lastMonth = subMonths(now, 1);

      let currentMonthRevenue = 0;
      let previousMonthRevenue = 0;

      Object.values(data).forEach((branch: any) => {
        Object.keys(branch).forEach((dateKey) => {
          const parsedDate = parse(dateKey, "MM-dd-yyyy", new Date());

          Object.values(branch[dateKey]).forEach((transaction: any) => {
            if (transaction.status === "completed") {
              const amount = Number(transaction.amountDue || 0);
              if (isSameMonth(parsedDate, now)) {
                currentMonthRevenue += amount;
              } else if (isSameMonth(parsedDate, lastMonth)) {
                previousMonthRevenue += amount;
              }
            }
          });
        });
      });

      setTotalRevenue(currentMonthRevenue);

      if (previousMonthRevenue > 0) {
        const growth = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
        setRevenueGrowth(parseFloat(growth.toFixed(1)));
      } else {
        setRevenueGrowth(0);
      }
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
        <p className="text-xs text-muted-foreground">
          {revenueGrowth >= 0 ? `+${revenueGrowth}%` : `${revenueGrowth}%`} from last month
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalRevenueCard;