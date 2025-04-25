"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { db } from "@/lib/db"

type RecentSale = {
  id: string
  name: string
  email: string
  amount: number
  date: string
  branch: string
}

export function RecentSales() {
  const [recentSales, setRecentSales] = useState<RecentSale[]>([])

  useEffect(() => {
    // Extract recent sales from the database
    const extractRecentSales = () => {
      const sales: RecentSale[] = []

      // Process reservations by branch to get recent sales
      Object.values(db.Reservations.ReservationsByBranch).forEach((branchReservations) => {
        Object.entries(branchReservations).forEach(([date, dateReservations]) => {
          if (typeof dateReservations === "object" && dateReservations !== null) {
            Object.entries(dateReservations).forEach(([id, reservation]: [string, any]) => {
              if (reservation.appointmentId && reservation.status === "completed") {
                // Find user info
                const userId = Object.keys(db.Reservations.ReservationsByUser).find(
                  (userId) => db.Reservations.ReservationsByUser[userId]?.[date]?.[id],
                )

                const user = userId ? db.users[userId] : null

                if (user) {
                  sales.push({
                    id: reservation.appointmentId,
                    name: `${user.firstName} ${user.lastName}`,
                    email: user.email,
                    amount: reservation.amountDue || 0,
                    date: date,
                    branch: reservation.branchName,
                  })
                }
              }
            })
          }
        })
      })

      // Sort by date (most recent first) and take the top 5
      sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setRecentSales(sales.slice(0, 5))
    }

    extractRecentSales()
  }, [])

  return (
    <div className="space-y-8">
      {recentSales.length > 0 ? (
        recentSales.map((sale) => (
          <div key={sale.id} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>
                {sale.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{sale.name}</p>
              <p className="text-sm text-muted-foreground">{sale.email}</p>
            </div>
            <div className="ml-auto font-medium">₱{sale.amount.toLocaleString()}</div>
          </div>
        ))
      ) : (
        <>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>JL</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Jackson Lee</p>
              <p className="text-sm text-muted-foreground">jackson.lee@example.com</p>
            </div>
            <div className="ml-auto font-medium">₱890.00</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>SD</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Sofia Davis</p>
              <p className="text-sm text-muted-foreground">sofia.davis@example.com</p>
            </div>
            <div className="ml-auto font-medium">₱390.00</div>
          </div>
          <div className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg" alt="Avatar" />
              <AvatarFallback>IN</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
              <p className="text-sm text-muted-foreground">isabella.nguyen@example.com</p>
            </div>
            <div className="ml-auto font-medium">₱299.00</div>
          </div>
        </>
      )}
    </div>
  )
}
