import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ActiveUsersCard: React.FC = () => {
  const [activeUsers, setActiveUsers] = useState<number>(0);

  useEffect(() => {
    // Simulated user data – replace with actual API or Firebase data
    const fetchUsers = async () => {
      const users = [
        { id: 1, name: "Alice", isActive: true },
        { id: 2, name: "Bob", isActive: true },
        { id: 3, name: "Carol", isActive: false },
        { id: 4, name: "David", isActive: true },
      ];

      const activeCount = users.filter(user => user.isActive).length;
      setActiveUsers(activeCount);
    };

    fetchUsers();
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
        <p className="text-xs text-muted-foreground">+3 since last week</p>
      </CardContent>
    </Card>
  );
};

export default ActiveUsersCard;
