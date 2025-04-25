"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts"
import { db } from "@/lib/db"

type StatusCount = {
  name: string
  value: number
  color: string
}

export function ReservationStatusChart() {
  const [statusData, setStatusData] = useState<StatusCount[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    // Count reservations by status
    const countReservationsByStatus = () => {
      const statusCounts = {
        completed: 0,
        pending: 0,
        cancelled: 0,
      }

      // Process reservations by branch to count by status
      Object.values(db.Reservations.ReservationsByBranch).forEach((branchReservations) => {
        Object.values(branchReservations).forEach((dateReservations) => {
          if (typeof dateReservations === "object" && dateReservations !== null) {
            Object.values(dateReservations).forEach((reservation: any) => {
              if (reservation.status) {
                statusCounts[reservation.status as keyof typeof statusCounts]++
              }
            })
          }
        })
      })

      // Format data for the chart
      const chartData: StatusCount[] = [
        { name: "Completed", value: statusCounts.completed, color: "#B45309" },
        { name: "Pending", value: statusCounts.pending, color: "#D4D4D8" },
        { name: "Cancelled", value: statusCounts.cancelled, color: "#000000" },
      ]

      setStatusData(chartData)
    }

    countReservationsByStatus()
  }, [])

  const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? "start" : "end"

    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-lg font-semibold">
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text
          x={ex + (cos >= 0 ? 1 : -1) * 12}
          y={ey}
          textAnchor={textAnchor}
          fill="#333"
        >{`${value} reservations`}</text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    )
  }

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
          data={statusData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        >
          {statusData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} reservations`, "Count"]} />
        <Legend
          layout="vertical"
          verticalAlign="middle"
          align="right"
          payload={statusData.map((item, index) => ({
            id: item.name,
            type: "square",
            value: `${item.name} (${item.value})`,
            color: item.color,
          }))}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
