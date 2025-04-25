"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { db } from "@/lib/db"

type StatusCount = {
  date: string
  completed: number
  cancelled: number
  pending: number
}

export function ReservationTrendChart() {
  const [trendData, setTrendData] = useState<StatusCount[]>([])

  useEffect(() => {
    // Count reservations by status over time
    const countReservationsByStatusOverTime = () => {
      const statusByDate: Record<string, StatusCount> = {}

      // Process reservations by branch to count by status and date
      Object.values(db.Reservations.ReservationsByBranch).forEach((branchReservations) => {
        Object.entries(branchReservations).forEach(([dateStr, dateReservations]) => {
          // Skip non-reservation entries like "Bays"
          if (dateStr === "Bays" || typeof dateReservations !== "object" || dateReservations === null) {
            return
          }

          // Format date for display (MM-DD)
          const dateParts = dateStr.split("-")
          const formattedDate = dateParts.length >= 2 ? `${dateParts[0]}/${dateParts[1]}` : dateStr

          // Initialize date entry if it doesn't exist
          if (!statusByDate[formattedDate]) {
            statusByDate[formattedDate] = {
              date: formattedDate,
              completed: 0,
              cancelled: 0,
              pending: 0,
            }
          }

          // Count reservations by status
          Object.values(dateReservations).forEach((reservation: any) => {
            if (reservation.status) {
              statusByDate[formattedDate][reservation.status as keyof Omit<StatusCount, "date">]++
            }
          })
        })
      })

      // Convert to array and sort by date
      const chartData = Object.values(statusByDate).sort((a, b) => {
        // Extract month and day for comparison
        const [aMonth, aDay] = a.date.split("/").map(Number)
        const [bMonth, bDay] = b.date.split("/").map(Number)

        // Compare months first, then days
        return aMonth !== bMonth ? aMonth - bMonth : aDay - bDay
      })

      setTrendData(chartData)
    }

    countReservationsByStatusOverTime()
  }, [])

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={trendData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip
          formatter={(value, name) => [`${value} reservations`, name.charAt(0).toUpperCase() + name.slice(1)]}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="completed"
          stroke="#B45309"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="Completed"
        />
        <Line
          type="monotone"
          dataKey="cancelled"
          stroke="#000000"
          strokeWidth={2}
          activeDot={{ r: 8 }}
          name="Cancelled"
        />
        <Line type="monotone" dataKey="pending" stroke="#D4D4D8" strokeWidth={2} activeDot={{ r: 8 }} name="Pending" />
      </LineChart>
    </ResponsiveContainer>
  )
}
