"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react"
import { db } from "@/lib/db"
import { DataTable } from "@/components/ui/data-table"
import { database } from '@/lib/firebase'; // adjust path if needed
import { ref, get } from 'firebase/database';
import type { ColumnDef } from "@tanstack/react-table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

type Customer = {
  id: string
  firstName: string
  lastName: string
  email: string
  contactNumber: string
}

export default function CustomersPage() {
  const { toast } = useToast()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([]);

useEffect(() => {
  async function loadCustomers() {
    const fetchedCustomers = await fetchCustomers();
    setCustomers(fetchedCustomers);
  }

  loadCustomers();
}, []);

  // // Extract customers from the database
  // const customers: Customer[] = Object.entries(db.users)
  //   .filter(([_, user]: [string, any]) => user.role !== "admin" || !user.role)
  //   .map(([id, user]: [string, any]) => {
  //     return {
  //       id,
  //       firstName: user.firstName,
  //       lastName: user.lastName,
  //       email: user.email,
  //       contactNumber: user.contactNumber || "+63 9XX XXX XXXX", // Default contact number if not available
  //     }
  //   })

  async function fetchCustomers() {
    const usersRef = ref(database, 'users'); // points to the 'users' node
    const snapshot = await get(usersRef);
  
    if (!snapshot.exists()) {
      console.log('No users found');
      return [];
    }
  
    const usersData = snapshot.val(); // This is your users object
  
    const customers: Customer[] = Object.entries(usersData)
      .filter(([_, user]: [string, any]) => user.role !== "admin" || !user.role)
      .map(([id, user]: [string, any]) => {
        return {
          id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          contactNumber: user.contactNumber || "+63 9XX XXX XXXX",
        };
      });
  
    return customers;
  }
  

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Customer Added",
      description: "The customer has been added successfully.",
    })
    setIsAddDialogOpen(false)
  }

  const handleEditCustomer = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Customer Updated",
      description: "The customer has been updated successfully.",
    })
    setIsEditDialogOpen(false)
  }

  const handleDeleteCustomer = (customer: Customer) => {
    toast({
      title: "Customer Deleted",
      description: `${customer.firstName} ${customer.lastName} has been deleted.`,
    })
    setIsDeleteDialogOpen(false)
  }

  const handleViewCustomer = (customer: Customer) => {
    toast({
      title: "Viewing Customer",
      description: `Viewing details for ${customer.firstName} ${customer.lastName}`,
    })
  }

  const openEditDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDeleteDialogOpen(true)
  }

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src="/placeholder.svg" alt={`${customer.firstName} ${customer.lastName}`} />
              <AvatarFallback>
                {customer.firstName.charAt(0)}
                {customer.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {customer.firstName} {customer.lastName}
              </div>
              <div className="text-sm text-muted-foreground">{customer.email}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "contactNumber",
      header: "Contact Number",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const customer = row.original
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewCustomer(customer)}
              className="h-8 w-8 p-0"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEditDialog(customer)}
              className="h-8 w-8 p-0"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDeleteDialog(customer)}
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
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>Enter the details for the new customer.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddCustomer}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstName" className="text-right">
                      First Name
                    </Label>
                    <Input id="firstName" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastName" className="text-right">
                      Last Name
                    </Label>
                    <Input id="lastName" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input id="email" type="email" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contactNumber" className="text-right">
                      Contact Number
                    </Label>
                    <Input id="contactNumber" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input id="password" type="password" className="col-span-3" required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                    Add Customer
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white rounded-md shadow-sm border border-gray-200">
          <DataTable columns={columns} data={customers} searchKey="email" searchPlaceholder="Search by email..." />
        </div>
      </div>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>Update the customer details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCustomer}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-firstName" className="text-right">
                  First Name
                </Label>
                <Input id="edit-firstName" className="col-span-3" defaultValue={selectedCustomer?.firstName} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-lastName" className="text-right">
                  Last Name
                </Label>
                <Input id="edit-lastName" className="col-span-3" defaultValue={selectedCustomer?.lastName} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  className="col-span-3"
                  defaultValue={selectedCustomer?.email}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contactNumber" className="text-right">
                  Contact Number
                </Label>
                <Input
                  id="edit-contactNumber"
                  className="col-span-3"
                  defaultValue={selectedCustomer?.contactNumber}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Customer Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">
              You are about to delete:{" "}
              <span className="font-bold">
                {selectedCustomer?.firstName} {selectedCustomer?.lastName}
              </span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleDeleteCustomer(selectedCustomer!)}>
              Delete Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
