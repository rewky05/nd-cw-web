import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getMonthlySalesComparison } from "./sales";

const SalesBreakdown: React.FC = () => {
  const [data, setData] = useState<Awaited<ReturnType<typeof getMonthlySalesComparison>> | null>(null);

  useEffect(() => {
    getMonthlySalesComparison().then(setData);
  }, []);

  if (!data) {
    return (
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle>Sales Breakdown</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const {
    bookingFees,
    servicePayments,
    bookingPctChange,
    servicePctChange,
    categoryPct,
  } = data;

  // Online transactions are not yet implemented
  const onlineTransactions = 0;
  const onlinePctChange = 0;

  const formatCurrency = (value: number) =>
    `₱${value.toLocaleString(undefined, { minimumFractionDigits: 0 })}`;
  const formatPct = (value: number) =>
    `${value.toFixed(1)}%`;

  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle>Sales Breakdown</CardTitle>
        <CardDescription>
          Booking fees, service payments, and online transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Booking Fees */}
            <div className="col-span-1 bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-medium text-gray-600 mb-2">
                Booking Fees
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(bookingFees)}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <svg
                  className="w-3 h-3 text-[#FFD000] mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {formatPct(bookingPctChange)} from last month
              </div>
            </div>
            {/* Service Payments */}
            <div className="col-span-1 bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-medium text-gray-600 mb-2">
                Service Payments
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(servicePayments)}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <svg
                  className="w-3 h-3 text-[#FFD000] mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {formatPct(servicePctChange)} from last month
              </div>
            </div>
            {/* Online Transactions */}
            <div className="col-span-1 bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-sm font-medium text-gray-600 mb-2">
                Online Transactions
              </div>
              <div className="text-2xl font-bold">
                {formatCurrency(onlineTransactions)}
              </div>
              <div className="text-xs text-gray-500 mt-1 flex items-center">
                <svg
                  className="w-3 h-3 text-[#FFD000] mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
                {formatPct(onlinePctChange)} from last month
              </div>
            </div>
          </div>

          {/* Category Bars */}
          <div className="grid grid-cols-3 gap-8 w-full">
            {[
              { label: "Body Wash", pct: categoryPct.bodyWash },
              { label: "Value Wash", pct: categoryPct.valueWash },
              { label: "Add-ons", pct: categoryPct.addOns },
            ].map(({ label, pct }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="text-lg font-semibold mb-2">{label}</div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-[#FFD000] h-4 rounded-full"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {formatPct(pct)} of sales
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SalesBreakdown;