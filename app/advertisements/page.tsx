"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Pencil, Trash2, ImagePlus } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock database object
const db = {
  Branches: {
    branch1: {
      Services: {
        service1: {
          name: "Basic Wash",
          sedanPrice: 50,
          suvPrice: 75,
          pickupPrice: 100,
          estimatedTime: 30,
        },
        service2: {
          name: "Premium Wash",
          sedanPrice: 75,
          suvPrice: 100,
          pickupPrice: 125,
          estimatedTime: 45,
        },
      },
    },
    branch2: {
      Services: {
        service3: {
          name: "Deluxe Wash",
          sedanPrice: 100,
          suvPrice: 125,
          pickupPrice: 150,
          estimatedTime: 60,
        },
      },
    },
  },
}

type Advertisement = {
  id: string
  title: string
  description: string
  image: string
  type: "promotion" | "service"
  status: "active" | "inactive"
}

type Service = {
  id: string
  name: string
  description: string
  price: {
    sedan: number
    suv: number
    pickup: number
  }
  estimatedTime: number
  image: string
}

export default function AdvertisementsPage() {
  const { toast } = useToast()
  const [isAddAdDialogOpen, setIsAddAdDialogOpen] = useState(false)
  const [isEditAdDialogOpen, setIsEditAdDialogOpen] = useState(false)
  const [isDeleteAdDialogOpen, setIsDeleteAdDialogOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null)

  const [isAddServiceDialogOpen, setIsAddServiceDialogOpen] = useState(false)
  const [isEditServiceDialogOpen, setIsEditServiceDialogOpen] = useState(false)
  const [isDeleteServiceDialogOpen, setIsDeleteServiceDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // Sample advertisements
  const advertisements: Advertisement[] = [
    {
      id: "ad1",
      title: "Summer Special Discount",
      description: "Get 20% off on all premium washes this summer!",
      image: "/placeholder.svg?height=200&width=400",
      type: "promotion",
      status: "active",
    },
    {
      id: "ad2",
      title: "New Branch Opening",
      description: "Visit our new branch in Mandaue City and get a free air freshener!",
      image: "/placeholder.svg?height=200&width=400",
      type: "promotion",
      status: "active",
    },
    {
      id: "ad3",
      title: "Loyalty Program",
      description: "Join our loyalty program and get every 5th wash free!",
      image: "/placeholder.svg?height=200&width=400",
      type: "promotion",
      status: "inactive",
    },
  ]

  // Extract services from the database
  const services: Service[] = []
  Object.values(db.Branches).forEach((branch: any) => {
    if (branch.Services) {
      Object.entries(branch.Services).forEach(([id, service]: [string, any]) => {
        if (!services.some((s) => s.name === service.name)) {
          services.push({
            id,
            name: service.name,
            description: "Professional car wash service",
            price: {
              sedan: service.sedanPrice,
              suv: service.suvPrice,
              pickup: service.pickupPrice,
            },
            estimatedTime: service.estimatedTime,
            image: "/placeholder.svg?height=200&width=400",
          })
        }
      })
    }
  })

  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Advertisement Added",
      description: "The advertisement has been added successfully.",
    })
    setIsAddAdDialogOpen(false)
  }

  const handleEditAd = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Advertisement Updated",
      description: "The advertisement has been updated successfully.",
    })
    setIsEditAdDialogOpen(false)
  }

  const handleDeleteAd = () => {
    toast({
      title: "Advertisement Deleted",
      description: "The advertisement has been deleted successfully.",
    })
    setIsDeleteAdDialogOpen(false)
  }

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Service Added",
      description: "The service has been added successfully.",
    })
    setIsAddServiceDialogOpen(false)
  }

  const handleEditService = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Service Updated",
      description: "The service has been updated successfully.",
    })
    setIsEditServiceDialogOpen(false)
  }

  const handleDeleteService = () => {
    toast({
      title: "Service Deleted",
      description: "The service has been deleted successfully.",
    })
    setIsDeleteServiceDialogOpen(false)
  }

  const openEditAdDialog = (ad: Advertisement) => {
    setSelectedAd(ad)
    setIsEditAdDialogOpen(true)
  }

  const openDeleteAdDialog = (ad: Advertisement) => {
    setSelectedAd(ad)
    setIsDeleteAdDialogOpen(true)
  }

  const openEditServiceDialog = (service: Service) => {
    setSelectedService(service)
    setIsEditServiceDialogOpen(true)
  }

  const openDeleteServiceDialog = (service: Service) => {
    setSelectedService(service)
    setIsDeleteServiceDialogOpen(true)
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Advertisements & Services</h2>
        </div>
        <Tabs defaultValue="advertisements" className="space-y-4">
          <TabsList>
            <TabsTrigger
              value="advertisements"
              className="data-[state=active]:bg-[#FFD000] data-[state=active]:text-black"
            >
              Advertisements
            </TabsTrigger>
            <TabsTrigger value="services" className="data-[state=active]:bg-[#FFD000] data-[state=active]:text-black">
              Services
            </TabsTrigger>
          </TabsList>
          <TabsContent value="advertisements" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddAdDialogOpen} onOpenChange={setIsAddAdDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Advertisement
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Advertisement</DialogTitle>
                    <DialogDescription>Enter the details for the new advertisement.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddAd}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="title" className="text-right">
                          Title
                        </Label>
                        <Input id="title" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea id="description" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">
                          Type
                        </Label>
                        <Select>
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="promotion">Promotion</SelectItem>
                            <SelectItem value="service">Service</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">
                          Image
                        </Label>
                        <div className="col-span-3">
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImagePlus className="w-8 h-8 mb-3 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB)</p>
                              </div>
                              <input id="image" type="file" className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                        Add Advertisement
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {advertisements.map((ad) => (
                <Card key={ad.id} className="overflow-hidden">
                  <div className="relative">
                    <img src={ad.image || "/placeholder.svg"} alt={ad.title} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white"
                        onClick={() => openEditAdDialog(ad)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white"
                        onClick={() => openDeleteAdDialog(ad)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          ad.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {ad.status}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{ad.title}</CardTitle>
                    <CardDescription className="text-xs uppercase">{ad.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{ad.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="services" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isAddServiceDialogOpen} onOpenChange={setIsAddServiceDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Service</DialogTitle>
                    <DialogDescription>Enter the details for the new service.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddService}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input id="name" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          Description
                        </Label>
                        <Textarea id="description" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="sedan-price" className="text-right">
                          Sedan Price
                        </Label>
                        <Input id="sedan-price" type="number" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="suv-price" className="text-right">
                          SUV Price
                        </Label>
                        <Input id="suv-price" type="number" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="pickup-price" className="text-right">
                          Pickup Price
                        </Label>
                        <Input id="pickup-price" type="number" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="time" className="text-right">
                          Est. Time (min)
                        </Label>
                        <Input id="time" type="number" className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="service-image" className="text-right">
                          Image
                        </Label>
                        <div className="col-span-3">
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <ImagePlus className="w-8 h-8 mb-3 text-gray-500" />
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB)</p>
                              </div>
                              <input id="service-image" type="file" className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                        Add Service
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.id} className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={service.image || "/placeholder.svg"}
                      alt={service.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white"
                        onClick={() => openEditServiceDialog(service)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white"
                        onClick={() => openDeleteServiceDialog(service)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle>{service.name}</CardTitle>
                    <CardDescription>Estimated time: {service.estimatedTime} minutes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{service.description}</p>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-gray-100 p-2 rounded-md text-center">
                        <div className="font-medium">Sedan</div>
                        <div>₱{service.price.sedan}</div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded-md text-center">
                        <div className="font-medium">SUV</div>
                        <div>₱{service.price.suv}</div>
                      </div>
                      <div className="bg-gray-100 p-2 rounded-md text-center">
                        <div className="font-medium">Pickup</div>
                        <div>₱{service.price.pickup}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Advertisement Dialog */}
      <Dialog open={isEditAdDialogOpen} onOpenChange={setIsEditAdDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
            <DialogDescription>Update the advertisement details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditAd}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Title
                </Label>
                <Input id="edit-title" className="col-span-3" defaultValue={selectedAd?.title} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-description"
                  className="col-span-3"
                  defaultValue={selectedAd?.description}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Type
                </Label>
                <Select defaultValue={selectedAd?.type}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select defaultValue={selectedAd?.status}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-image" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB)</p>
                      </div>
                      <input id="edit-image" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
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

      {/* Delete Advertisement Dialog */}
      <Dialog open={isDeleteAdDialogOpen} onOpenChange={setIsDeleteAdDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Advertisement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this advertisement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">
              You are about to delete: <span className="font-bold">{selectedAd?.title}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteAdDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAd}>
              Delete Advertisement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Dialog */}
      <Dialog open={isEditServiceDialogOpen} onOpenChange={setIsEditServiceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>Update the service details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditService}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input id="edit-name" className="col-span-3" defaultValue={selectedService?.name} required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-service-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="edit-service-description"
                  className="col-span-3"
                  defaultValue={selectedService?.description}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-sedan-price" className="text-right">
                  Sedan Price
                </Label>
                <Input
                  id="edit-sedan-price"
                  type="number"
                  className="col-span-3"
                  defaultValue={selectedService?.price.sedan}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-suv-price" className="text-right">
                  SUV Price
                </Label>
                <Input
                  id="edit-suv-price"
                  type="number"
                  className="col-span-3"
                  defaultValue={selectedService?.price.suv}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-pickup-price" className="text-right">
                  Pickup Price
                </Label>
                <Input
                  id="edit-pickup-price"
                  type="number"
                  className="col-span-3"
                  defaultValue={selectedService?.price.pickup}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-time" className="text-right">
                  Est. Time (min)
                </Label>
                <Input
                  id="edit-time"
                  type="number"
                  className="col-span-3"
                  defaultValue={selectedService?.estimatedTime}
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-service-image" className="text-right">
                  Image
                </Label>
                <div className="col-span-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <ImagePlus className="w-8 h-8 mb-3 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 2MB)</p>
                      </div>
                      <input id="edit-service-image" type="file" className="hidden" />
                    </label>
                  </div>
                </div>
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

      {/* Delete Service Dialog */}
      <Dialog open={isDeleteServiceDialogOpen} onOpenChange={setIsDeleteServiceDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">
              You are about to delete: <span className="font-bold">{selectedService?.name}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteServiceDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
