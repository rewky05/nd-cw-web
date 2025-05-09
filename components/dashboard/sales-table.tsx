import React, { useEffect, useState } from 'react';
import { database } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { DataTable } from '@/components/ui/data-table';
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Transaction = {
  id: string;
  customer: string;
  profileImage?: string;
  email: string;
  date: string;
  branch: string;
  service: string;
  amount: number;
  status: string;
};

const columns = [
  {
    accessorKey: 'id',
    header: 'Transaction ID',
  },
  {
    accessorKey: "customer",
    header: "Customer",
    cell: ({ row }: any) => {
      const transaction = row.original
      return (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={transaction.profileImage || '/placeholder.svg'} alt={transaction.customer} />
            <AvatarFallback>
              {transaction.customer
                .split(' ')
                .map((n: string) => n[0])
                .join(' ')}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{transaction.customer}</div>
            <div className="text-sm text-muted-foreground">{transaction.customerEmail}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'branch',
    header: 'Branch',
  },
  {
    accessorKey: 'service',
    header: 'Services',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }: any) => `₱${row.getValue('amount')}`,
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    d: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const transaction = row.original
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              // onClick={}
              className="h-8 w-8 p-0"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              // onClick={}
              className="h-8 w-8 p-0"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              // onClick={}
              className="h-8 w-8 p-0 text-red-500"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )
      },
  },
];

export function SalesTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const reservationsRef = ref(database, 'Reservations/ReservationsByUser');
        const reservationsSnap = await get(reservationsRef);
        const reservationsData = reservationsSnap.val();

        if (!reservationsData) {
          setTransactions([]);
          return;
        }

        const usersRef = ref(database, 'users');
        const usersSnap = await get(usersRef);
        const usersData = usersSnap.val();

        const fetchedTransactions: Transaction[] = [];

        for (const uid in reservationsData) {
          const userReservations = reservationsData[uid];

          for (const dateKey in userReservations) {
            const transactionsForDate = userReservations[dateKey];

            for (const transactionId in transactionsForDate) {
              const transaction = transactionsForDate[transactionId];

              if (transaction.status === 'completed') {
                const services = transaction.services || {};
                const serviceNames = Object.values(services).map((service: any) => service.name);

                const user = usersData?.[uid] || {};
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();

                fetchedTransactions.push({
                  id: transactionId,
                  customer: fullName,
                  profileImage: user.profileImage || '',
                  email: user.email || '',
                  date: dateKey,
                  branch: transaction.branchName || '',
                  service: serviceNames.join(', '),
                  amount: transaction.amountDue || 0,
                  status: transaction.status
                });
              }
            }
          }
        }

        setTransactions(fetchedTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
        toast({ title: 'Error', description: 'Failed to fetch transactions.' });
      }
    };

    fetchTransactions();
  }, []);

  return (
    <DataTable 
      columns={columns} 
      data={transactions} 
      searchKey="customer" 
      searchPlaceholder="Search by customer name..."/>
  );
}
