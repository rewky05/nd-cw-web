import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { parse, isAfter, subWeeks } from "date-fns";

const ActiveUsersCard: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const usersSnapshot = await get(ref(database, "users"));
        if (!usersSnapshot.exists()) {
          setActiveUsers(0);
          return;
        }

        const usersData = usersSnapshot.val();
        const defaultUserUIDs = Object.entries(usersData)
          .filter(([_uid, user]: any) => user.role === "default")
          .map(([uid]) => uid);

        const reservationsSnapshot = await get(ref(database, "Reservations/ReservationsByUser"));
        if (!reservationsSnapshot.exists()) {
          setActiveUsers(0);
          return;
        }

        const reservationsData = reservationsSnapshot.val();
        const oneWeekAgo = subWeeks(new Date(), 1);
        let count = 0;

        for (const uid of defaultUserUIDs) {
          const userReservations = reservationsData[uid];
          if (userReservations) {
            const hasRecentTransaction = Object.keys(userReservations).some(dateStr => {
              try {
                const parsedDate = parse(dateStr, "MM-dd-yyyy", new Date());
                return isAfter(parsedDate, oneWeekAgo);
              } catch {
                return false;
              }
            });

            if (hasRecentTransaction) {
              count++;
            }
          }
        }

        setActiveUsers(count);
      } catch (error) {
        console.error("Error fetching active users:", error);
        setActiveUsers(0);
      }
    };

    fetchActiveUsers();
  }, []);

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
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
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activeUsers}</div>
        <p className="text-xs text-muted-foreground">+{activeUsers} since last week</p>
      </CardContent>
    </Card>
  );
};

export default ActiveUsersCard;
