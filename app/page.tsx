"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Overview } from "@/components/dashboard/overview"
import { FeedbackList } from "@/components/dashboard/feedback-list"
import { BranchPerformance } from "@/components/dashboard/branch-performance"
import { SalesTable } from "@/components/dashboard/sales-table"
import { db } from "@/lib/db"
import TotalRevenueCard from "@/components/dashboard/total-revenue-card"
import BookingsStatCard from "@/components/dashboard/bookings-stat-card"
import ActiveBranchesCard from "@/components/dashboard/active-branches-card"
import ActiveUsersCard from "@/components/dashboard/active-users-card"
import SalesBreakdown from "@/components/dashboard/salesBreakdown/salesBreakdown"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activeBranches: 0,
    activeUsers: 0,
  })

  useEffect(() => {
    // Calculate dashboard statistics from the database
    const calculateStats = () => {
      // Count branches
      const branchCount = Object.keys(db.Branches).length

      // Count total bookings
      let bookingCount = 0
      let revenue = 0

      // Process reservations by branch to get booking count and revenue
      Object.values(db.Reservations.ReservationsByBranch).forEach((branchReservations) => {
        Object.values(branchReservations).forEach((dateReservations) => {
          if (typeof dateReservations === "object" && dateReservations !== null) {
            Object.values(dateReservations).forEach((reservation: any) => {
              if (reservation.appointmentId) {
                bookingCount++
                revenue += reservation.amountDue || 0
              }
            })
          }
        })
      })

      // Count users
      const userCount = Object.keys(db.users).length

      setStats({
        totalRevenue: revenue,
        totalBookings: bookingCount,
        activeBranches: branchCount,
        activeUsers: userCount,
      })
    }

    calculateStats()
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#FFD000] data-[state=active]:text-black">
              Overview
            </TabsTrigger>
            <TabsTrigger value="sales" className="data-[state=active]:bg-[#FFD000] data-[state=active]:text-black">
              Sales
            </TabsTrigger>
            <TabsTrigger value="feedback" className="data-[state=active]:bg-[#FFD000] data-[state=active]:text-black">
              Feedback
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TotalRevenueCard/>
              <BookingsStatCard/>
              <ActiveBranchesCard/>
              <ActiveUsersCard/>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 bg-white border-gray-200">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3 bg-white border-gray-200">
                <CardHeader>
                  <CardTitle>Branch Performance</CardTitle>
                  <CardDescription>Revenue comparison across branches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[350px]">
                    <BranchPerformance />
                  </div>
                </CardContent>
              </Card>
            </div>
            <SalesBreakdown/>
          </TabsContent>
          <TabsContent value="sales" className="space-y-4">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <CardTitle>Sales Transactions</CardTitle>
                <CardDescription>All transactions across branches</CardDescription>
              </CardHeader>
              <CardContent>
                <SalesTable />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="feedback" className="space-y-4">
            <Card className="bg-white border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Customer Feedback</CardTitle>
                  <CardDescription>Recent feedback from customers across all branches</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-[#FFD000]"></div>
                    <span className="text-xs text-gray-500">Positive</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <span className="text-xs text-gray-500">Neutral</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-black"></div>
                    <span className="text-xs text-gray-500">Negative</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <FeedbackList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
