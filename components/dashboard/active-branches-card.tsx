import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ActiveBranchesCard: React.FC = () => {
  const [activeBranches, setActiveBranches] = useState<number>(0);

  useEffect(() => {
    // Simulated data – replace with real API/Firebase call if needed
    const fetchBranches = async () => {
      const branches = [
        { id: 1, name: "Manila", isActive: true },
        { id: 2, name: "Cebu", isActive: true },
        { id: 3, name: "Davao", isActive: false },
        { id: 4, name: "Baguio", isActive: true },
      ];

      const activeCount = branches.filter(branch => branch.isActive).length;
      setActiveBranches(activeCount);
    };

    fetchBranches();
  }, []);

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
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
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{activeBranches}</div>
        <p className="text-xs text-muted-foreground">+0 new branches this quarter</p>
      </CardContent>
    </Card>
  );
};

export default ActiveBranchesCard;
