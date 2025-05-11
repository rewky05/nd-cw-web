import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { parse, isWithinInterval, startOfQuarter, endOfQuarter } from "date-fns";

const ActiveBranchesCard: React.FC = () => {
  const [activeBranches, setActiveBranches] = useState<number>(0);
  const [newBranchesThisQuarter, setNewBranchesThisQuarter] = useState<number>(0);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const snapshot = await get(ref(database, "Branches"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const branches = Object.values(data);

          setActiveBranches(branches.length);

          const now = new Date();
          const startQuarter = startOfQuarter(now);
          const endQuarter = endOfQuarter(now);

          const newBranches = branches.filter((branch: any) => {
            const dateCreatedStr = branch?.profile?.dateCreated;
            if (!dateCreatedStr) return false;

            try {
              const parsedDate = parse(dateCreatedStr, "MM-dd-yyyy", new Date());
              return isWithinInterval(parsedDate, { start: startQuarter, end: endQuarter });
            } catch {
              return false;
            }
          });

          setNewBranchesThisQuarter(newBranches.length);
        } else {
          setActiveBranches(0);
          setNewBranchesThisQuarter(0);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
        setActiveBranches(0);
        setNewBranchesThisQuarter(0);
      }
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
        <p className="text-xs text-muted-foreground">
          +{newBranchesThisQuarter} new branches this quarter
        </p>
      </CardContent>
    </Card>
  );
};

export default ActiveBranchesCard;