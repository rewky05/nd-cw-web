"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { db } from "@/lib/db"

type BranchPerformance = {
  name: string
  revenue: number
  bookings: number
}

export function BranchPerformance() {
  const [branchData, setBranchData] = useState<BranchPerformance[]>([])

  useEffect(() => {
    // Calculate branch performance metrics
    const calculateBranchPerformance = () => {
      const branchPerformance: Record<string, BranchPerformance> = {}

      // Initialize branch data
      Object.values(db.Branches).forEach((branch: any) => {
        const branchName = branch.profile.name
        branchPerformance[branchName] = {
          name: branchName,
          revenue: 0,
          bookings: 0,
        }
      })

      // Process reservations by branch to calculate metrics
      Object.entries(db.Reservations.ReservationsByBranch).forEach(([branchId, branchReservations]) => {
        Object.values(branchReservations).forEach((dateReservations) => {
          if (typeof dateReservations === "object" && dateReservations !== null) {
            Object.values(dateReservations).forEach((reservation: any) => {
              if (reservation.branchName && reservation.amountDue) {
                branchPerformance[reservation.branchName].revenue += reservation.amountDue
                branchPerformance[reservation.branchName].bookings += 1
              }
            })
          }
        })
      })

      setBranchData(Object.values(branchPerformance))
    }

    calculateBranchPerformance()
  }, [])

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded-md shadow-md">
          <p className="font-bold text-gray-800">{label}</p>
          <p className="text-[#FFD000]">Revenue: ₱{payload[0].value.toLocaleString()}</p>
          <p className="text-black">Bookings: {payload[1].value}</p>
        </div>
      )
    }

    return null
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={branchData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#FFD000" />
        <YAxis yAxisId="right" orientation="right" stroke="#000000" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ paddingTop: "10px" }}
          formatter={(value) => <span className="text-sm font-medium">{value}</span>}
        />
        <Bar yAxisId="left" dataKey="revenue" fill="#FFD000" name="Revenue" radius={[4, 4, 0, 0]} />
        <Bar yAxisId="right" dataKey="bookings" fill="#000000" name="Bookings" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
