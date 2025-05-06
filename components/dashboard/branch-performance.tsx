import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { getDatabase, ref, get } from "firebase/database"
import { database } from "@/lib/firebase"

type BranchPerformance = {
  name: string
  revenue: number
  bookings: number
}

export function BranchPerformance() {
  const [branchData, setBranchData] = useState<BranchPerformance[]>([])

  useEffect(() => {
    const fetchPerformanceData = async () => {
      const branchPerformance: Record<string, BranchPerformance> = {}
  
      // Step 1: Fetch Branches
      const branchesSnap = await get(ref(database, "Branches"))
      const branches = branchesSnap.val()
  
      if (!branches) return
  
      // Initialize branch performance with names
      for (const branchId in branches) {
        const name = branches[branchId]?.profile?.name || "Unknown"
        branchPerformance[branchId] = {
          name,
          revenue: 0,
          bookings: 0,
        }
      }
  
      // Step 2: Fetch Reservations
      const reservationsSnap = await get(ref(database, "Reservations/ReservationsByBranch"))
      const reservationsByBranch = reservationsSnap.val()
  
      if (reservationsByBranch) {
        for (const branchId in reservationsByBranch) {
          const dates = reservationsByBranch[branchId]
  
          for (const date in dates) {
            const transactions = dates[date]
  
            for (const txnId in transactions) {
              const txn = transactions[txnId]
  
              if (txn.status === "completed" && typeof txn.amountDue === "number") {
                if (!branchPerformance[branchId]) continue
  
                branchPerformance[branchId].revenue += txn.amountDue
                branchPerformance[branchId].bookings += 1
              }
            }
          }
        }
      }
  
      setBranchData(Object.values(branchPerformance))
    }
  
    fetchPerformanceData()
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
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
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
