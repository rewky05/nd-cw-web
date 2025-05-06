"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { database } from "@/lib/firebase"
import { ref, get } from "firebase/database"

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

export function Overview() {
  const [monthlyData, setMonthlyData] = useState(
    MONTH_NAMES.map((name) => ({ name, total: 0 }))
  )

  useEffect(() => {
    const fetchMonthlyRevenue = async () => {
      const snapshot = await get(ref(database, "Reservations/ReservationsByBranch"))
      const reservationsByBranch = snapshot.val()
      if (!reservationsByBranch) return

      const currentYear = new Date().getFullYear()
      const monthlyTotals: number[] = Array(12).fill(0) // Index 0 = Jan

      for (const branchId in reservationsByBranch) {
        const dates = reservationsByBranch[branchId]

        for (const dateKey in dates) {
          const [monthStr, dayStr, yearStr] = dateKey.split("-") // "MM-DD-YYYY"
          const year = parseInt(yearStr)
          const month = parseInt(monthStr) - 1 // to match JS 0-indexed months

          if (year !== currentYear) continue

          const reservations = dates[dateKey]
          for (const txnId in reservations) {
            const txn = reservations[txnId]
            if (txn.status === "completed" && typeof txn.amountDue === "number") {
              monthlyTotals[month] += txn.amountDue
            }
          }
        }
      }

      const chartData = MONTH_NAMES.map((name, index) => ({
        name,
        total: monthlyTotals[index],
      }))

      setMonthlyData(chartData)
    }

    fetchMonthlyRevenue()
  }, [])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={monthlyData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₱${value.toLocaleString()}`}
        />
        <Tooltip formatter={(value) => [`₱${value.toLocaleString()}`, "Revenue"]} labelFormatter={(label) => `Month: ${label}`} />
        <Bar dataKey="total" fill="#FFD000" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
