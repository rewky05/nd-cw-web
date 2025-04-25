"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { db } from "@/lib/db"
import { DataTable } from "@/components/ui/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { useToast } from "@/components/ui/use-toast"

type SalesTransaction = {
  id: string
  customerName: string
  customerEmail: string
  branch: string
  service: string
  amount: number
  date: string
}

export function SalesTable() {
  const { toast } = useToast()
  const [transactions, setTransactions] = useState<SalesTransaction[]>([])

  useEffect(() => {
    // Extract transactions from the database
    const extractTransactions = () => {
      const sales: SalesTransaction[] = []

      // Process reservations by branch to get sales transactions
      Object.values(db.Reservations.ReservationsByBranch).forEach((branchReservations) => {
        Object.entries(branchReservations).forEach(([date, dateReservations]) => {
          if (typeof dateReservations === "object" && dateReservations !== null && date !== "Bays") {
            Object.entries(dateReservations).forEach(([id, reservation]: [string, any]) => {
              if (reservation.appointmentId) {
                // Find user info
                const userId = Object.keys(db.Reservations.ReservationsByUser).find(
                  (userId) => db.Reservations.ReservationsByUser[userId]?.[date]?.[id],
                )

                const user = userId ? db.users[userId] : null

                if (user) {
                  // Get primary service
                  const primaryService =
                    reservation.services && reservation.services.length > 0
                      ? reservation.services[0].name
                      : "Unknown Service"

                  // Format date for display
                  const formattedDate = date.replace(/-/g, "/")

                  sales.push({
                    id: reservation.appointmentId,
                    customerName: `${user.firstName} ${user.lastName}`,
                    customerEmail: user.email,
                    branch: reservation.branchName || "Unknown Branch",
                    service: primaryService,
                    amount: reservation.amountDue || 0,
                    date: formattedDate,
                  })
                }
              }
            })
          }
        })
      })

      // Add dummy data if no transactions found
      if (sales.length < 10) {
        const dummyData: SalesTransaction[] = [
          {
            id: "ND-123456",
            customerName: "John Smith",
            customerEmail: "john.smith@example.com",
            branch: "P. Mabolo",
            service: "Body Wash",
            amount: 180,
            date: "04/15/2025",
          },
          {
            id: "ND-123457",
            customerName: "Maria Garcia",
            customerEmail: "maria.garcia@example.com",
            branch: "Bacolod",
            service: "Premium Wash",
            amount: 350,
            date: "04/15/2025",
          },
          {
            id: "ND-123458",
            customerName: "David Lee",
            customerEmail: "david.lee@example.com",
            branch: "Urgello",
            service: "Value Wash",
            amount: 250,
            date: "04/14/2025",
          },
          {
            id: "ND-123459",
            customerName: "Sarah Johnson",
            customerEmail: "sarah.johnson@example.com",
            branch: "P. Mabolo",
            service: "Executive Wash",
            amount: 450,
            date: "04/14/2025",
          },
          {
            id: "ND-123460",
            customerName: "Michael Chen",
            customerEmail: "michael.chen@example.com",
            branch: "Bacolod",
            service: "Body Wash",
            amount: 180,
            date: "04/13/2025",
          },
          {
            id: "ND-123461",
            customerName: "Emma Wilson",
            customerEmail: "emma.wilson@example.com",
            branch: "Urgello",
            service: "Interior Detailing",
            amount: 800,
            date: "04/13/2025",
          },
          {
            id: "ND-123462",
            customerName: "James Rodriguez",
            customerEmail: "james.rodriguez@example.com",
            branch: "P. Mabolo",
            service: "Ceramic Coating",
            amount: 3500,
            date: "04/12/2025",
          },
          {
            id: "ND-123463",
            customerName: "Sophia Kim",
            customerEmail: "sophia.kim@example.com",
            branch: "Bacolod",
            service: "Full Detailing",
            amount: 1500,
            date: "04/12/2025",
          },
          {
            id: "ND-123464",
            customerName: "Daniel Martinez",
            customerEmail: "daniel.martinez@example.com",
            branch: "Urgello",
            service: "Engine Wash",
            amount: 300,
            date: "04/11/2025",
          },
          {
            id: "ND-123465",
            customerName: "Olivia Brown",
            customerEmail: "olivia.brown@example.com",
            branch: "P. Mabolo",
            service: "Headlight Restoration",
            amount: 500,
            date: "04/11/2025",
          },
        ]

        sales.push(...dummyData)
      }

      // Sort by date (most recent first)
      sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      setTransactions(sales)
    }

    extractTransactions()
  }, [])

  const handleView = (transaction: SalesTransaction) => {
    toast({
      title: "Viewing Transaction",
      description: `Viewing details for transaction ${transaction.id}`,
    })
  }

  const handleEdit = (transaction: SalesTransaction) => {
    toast({
      title: "Editing Transaction",
      description: `Editing transaction ${transaction.id}`,
    })
  }

  const handleDelete = (transaction: SalesTransaction) => {
    toast({
      title: "Deleting Transaction",
      description: `Deleting transaction ${transaction.id}`,
    })
  }

  const columns: ColumnDef<SalesTransaction>[] = [
    {
      accessorKey: "id",
      header: "Transaction ID",
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => {
        const transaction = row.original
        return (
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/placeholder.svg" alt={transaction.customerName} />
              <AvatarFallback>
                {transaction.customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{transaction.customerName}</div>
              <div className="text-sm text-muted-foreground">{transaction.customerEmail}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "branch",
      header: "Branch",
    },
    {
      accessorKey: "service",
      header: "Service",
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => {
        return <div>₱{row.original.amount.toLocaleString()}</div>
      },
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const transaction = row.original
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleView(transaction)}
              className="h-8 w-8 p-0"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEdit(transaction)}
              className="h-8 w-8 p-0"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDelete(transaction)}
              className="h-8 w-8 p-0 text-red-500"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={transactions}
      searchKey="customerName"
      searchPlaceholder="Search by customer name..."
    />
  )
}
