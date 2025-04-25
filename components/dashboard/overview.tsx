"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Jan",
    total: 8500,
  },
  {
    name: "Feb",
    total: 9200,
  },
  {
    name: "Mar",
    total: 7800,
  },
  {
    name: "Apr",
    total: 8900,
  },
  {
    name: "May",
    total: 10500,
  },
  {
    name: "Jun",
    total: 11200,
  },
  {
    name: "Jul",
    total: 9800,
  },
  {
    name: "Aug",
    total: 12500,
  },
  {
    name: "Sep",
    total: 13200,
  },
  {
    name: "Oct",
    total: 14500,
  },
  {
    name: "Nov",
    total: 15800,
  },
  {
    name: "Dec",
    total: 16900,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₱${value}`}
        />
        <Tooltip formatter={(value) => [`₱${value}`, "Revenue"]} labelFormatter={(label) => `Month: ${label}`} />
        <Bar dataKey="total" fill="#FFD000" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
