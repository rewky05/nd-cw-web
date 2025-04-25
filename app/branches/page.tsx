"use client";

import type React from "react";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Trash2, Eye } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

import { ref, push, update, set, remove, onValue } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { sendInitialPasswordReset } from "@/utils/pwreset";

type DefaultPrices = {
  sedan: number;
  suv: number;
  pickup: number;
  motorcycle: number;
};

type Service = {
  id: string;
  name: string;
  description: string;
  defaultPrices: DefaultPrices;
  estimatedTime: number;
  branchPrices: { [branchId: string]: Partial<DefaultPrices> };
};

type AddOn = {
  id: string;
  name: string;
  defaultPrice: number;
  estimatedTime: number;
  branches?: string[];
  branchPrices?: Record<string, { price: number }>;
};

type Branch = {
  id: string;
  name: string;
  address: string;
  contact: string;
  schedule: string;
  bays: number;
  services: number;
  addOns: number;
};

export default function BranchesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);

  const [activeTab, setActiveTab] = useState("information");
  const [isLoading, setIsLoading] = useState(false);

  const [enabledServices, setEnabledServices] = useState<
    Record<string, boolean>
  >({});
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  const [enabledAddOns, setEnabledAddOns] = useState<Record<string, boolean>>(
    {}
  );
  const [addOnOverrides, setAddOnOverrides] = useState<Record<string, number>>(
    {}
  );

  const [overrides, setOverrides] = useState<
    Record<string, Partial<DefaultPrices>>
  >({});

  const [branches, setBranches] = useState<Branch[]>([]);
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const sRef = ref(database, "services");
    return onValue(sRef, (snap) => {
      const data = snap.val() || {};
      const list: Service[] = Object.entries(data).map(([id, svc]: any) => ({
        id,
        name: svc.name,
        description: svc.description,
        defaultPrices: svc.defaultPrices,
        estimatedTime: svc.estimatedTime,
        branchPrices: svc.branchPrices || {},
      }));
      setServices(list);
    });
  }, []);

  useEffect(() => {
    const refAll = ref(database, "addOns");
    return onValue(refAll, (snap) => {
      const data = snap.val() || {};
      const list = Object.entries(data).map(([id, a]: any) => ({
        id,
        name: a.name,
        estimatedTime: a.estimatedTime,
        defaultPrice: a.defaultPrice,
        branches: a.branches || [],
        branchPrices: a.branchPrices || {},
      }));
      setAddOns(list);
    });
  }, []);

  useEffect(() => {
    const branchesRef = ref(database, "Branches");

    const unsubscribe = onValue(branchesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const loadedBranches: Branch[] = Object.entries(data).map(
        ([id, branch]: [string, any]) => ({
          id,
          name: branch.profile?.name ?? "Unnamed",
          address: branch.profile?.address ?? "No address",
          contact: branch.profile?.contact_number ?? "N/A",
          schedule: branch.profile?.schedule ?? "No schedule",
          services: Object.keys(branch.Services ?? {}).length,
          addOns: Object.keys(branch.AddOns ?? {}).length,
          bays: branch.Bays ? Object.keys(branch.Bays).length : 0,
        })
      );

      setBranches(loadedBranches);
    });

    return () => unsubscribe();
  }, []);

  const [newBranch, setNewBranch] = useState({
    name: "",
    address: "",
    contact: "",
    schedule: "",
    bays: 1,
    visorFirstName: "",
    visorLastName: "",
    visorEmail: "",
    visorLocation: "",
  });

  const [visor, setVisor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "supervisor",
    location: "",
  });

  const servicesById = useMemo(
    () => Object.fromEntries(services.map((s) => [s.id, s])),
    [services]
  );

  async function handleAddBranch(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        newBranch.visorEmail,
        "defaultPassword123"
      );

      await sendInitialPasswordReset(newBranch.visorEmail);

      const newBranchId = `branch-${branches.length + 1}`;
      const branchRef = ref(database, `Branches/${newBranchId}`);

      const bayData: any = {};
      for (let i = 1; i <= newBranch.bays; i++) {
        bayData[`Bay${i}`] = { status: "available" };
      }

      const svcFlags: Record<string, boolean> = {};
      Object.entries(enabledServices).forEach(([svcId, on]) => {
        if (on) svcFlags[svcId] = true;
      });

      await set(branchRef, {
        profile: {
          name: newBranch.name,
          address: newBranch.address,
          contact_number: newBranch.contact,
          schedule: newBranch.schedule,
        },
        Bays: bayData,
        Services: svcFlags,
        AddOns: {},
      });

      await set(ref(database, `users/${user.uid}`), {
        branchId: newBranchId,
        email: newBranch.visorEmail,
        firstName: newBranch.visorFirstName,
        lastName: newBranch.visorLastName,
        role: "supervisor",
        location: newBranch.visorLocation,
      });

      toast({
        title: "Branch & Supervisor Added",
        description: `Branch "${newBranch.name}" and supervisor "${newBranch.visorFirstName}" were successfully created.`,
      });

      setNewBranch({
        name: "",
        address: "",
        contact: "",
        schedule: "",
        bays: 1,
        visorFirstName: "",
        visorLastName: "",
        visorEmail: "",
        visorLocation: "",
      });
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteBranch() {
    if (!selectedBranch) return;

    try {
      const branchRef = ref(database, `Branches/${selectedBranch.id}`);
      await remove(branchRef);

      toast({
        title: "Branch Deleted",
        description: `Branch "${selectedBranch.name}" was successfully removed.`,
      });

      setSelectedBranch(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete the branch. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleViewBranch = (branch: Branch) => {
    router.push(`/branches/${branch.id}`);
  };

  async function handleEditBranch(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedBranch) return;
    const branchId = selectedBranch.id;

    // 1) Gather the basic profile + bays payload
    const updatedProfile = {
      name: (document.getElementById("edit-name") as HTMLInputElement).value,
      address: (document.getElementById("edit-address") as HTMLTextAreaElement)
        .value,
      contact_number: (
        document.getElementById("edit-contact") as HTMLInputElement
      ).value,
      schedule: (document.getElementById("edit-schedule") as HTMLInputElement)
        .value,
    };
    const bayCount = Number(
      (document.getElementById("edit-bays") as HTMLInputElement).value
    );
    const bayData: Record<string, { status: string }> = {};
    for (let i = 1; i <= bayCount; i++) {
      bayData[`Bay${i}`] = { status: "available" };
    }

    // 2) Write profile + bays in one shot
    await update(ref(database, `Branches/${branchId}`), {
      profile: updatedProfile,
      Bays: bayData,
    });

    // 3) Sync service toggles under `Branches/{branchId}/Services`
    for (const [svcId, isOn] of Object.entries(enabledServices)) {
      const svcRef = ref(database, `Branches/${branchId}/Services/${svcId}`);
      if (isOn) {
        // enable it
        await set(svcRef, true);

        // initialize override in /services if not already
        const def = services.find((s) => s.id === svcId)!.defaultPrices;
        await set(
          ref(database, `services/${svcId}/branchPrices/${branchId}`),
          def
        );
      } else {
        // disable it
        await remove(svcRef);
        await remove(
          ref(database, `services/${svcId}/branchPrices/${branchId}`)
        );
      }
    }

    // 4) Sync add-on toggles under `Branches/{branchId}/AddOns`
    for (const [addonId, isOn] of Object.entries(enabledAddOns)) {
      const aRef = ref(database, `Branches/${branchId}/AddOns/${addonId}`);
      if (isOn) await set(aRef, true);
      else await remove(aRef);
    }

    // 5) (Optional) If you keep a local `overrides` state for services,
    //    iterate it here and push any edits of price overrides:
    for (const [svcId, override] of Object.entries(overrides)) {
      // override is Partial<DefaultPrices>
      await update(
        ref(database, `services/${svcId}/branchPrices/${branchId}`),
        override as object
      );
    }

    toast({
      title: "Branch Updated",
      description: `${updatedProfile.name} has been saved.`,
    });
    setIsEditDialogOpen(false);
  }

  function openEditDialog(branch: Branch) {
    setSelectedBranch(branch);

    const branchRef = ref(database, `Branches/${branch.id}`);

    onValue(
      branchRef,
      (snapshot) => {
        const branchData = snapshot.val();
        if (!branchData) return;

        const svcToggles: Record<string, boolean> = {};
        services.forEach((s) => {
          svcToggles[s.id] = !!branchData.Services?.[s.id];
        });
        setEnabledServices(svcToggles);

        // pull any existing per‐branch overrides from servicesById
        const ovs: Record<string, Partial<DefaultPrices>> = {};
        Object.entries(servicesById).forEach(([svcId, svc]) => {
          const bp = svc.branchPrices?.[branch.id];
          if (bp) ovs[svcId] = { ...bp };
        });
        setOverrides(ovs);

        setActiveTab("information");
        setIsEditDialogOpen(true);
      },
      { onlyOnce: true }
    );
  }

  const openDeleteDialog = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  function toggleService(svcId: string) {
    if (!selectedBranch) return;
    const branchId = selectedBranch.id;
    const now = !enabledServices[svcId];
    setEnabledServices((prev) => ({ ...prev, [svcId]: now }));

    const branchSvcRef = ref(
      database,
      `Branches/${branchId}/Services/${svcId}`
    );
    if (now) {
      set(branchSvcRef, true);
      const def = services.find((s) => s.id === svcId)!.defaultPrices;
      set(ref(database, `services/${svcId}/branchPrices/${branchId}`), def);
      setOverrides((o) => ({ ...o, [svcId]: { ...def } }));
    } else {
      remove(branchSvcRef);
      remove(ref(database, `services/${svcId}/branchPrices/${branchId}`));
      setOverrides((o) => {
        const copy = { ...o };
        delete copy[svcId];
        return copy;
      });
    }
  }

  function updateOverride(
    svcId: string,
    veh: keyof DefaultPrices,
    price: number
  ) {
    if (!selectedBranch) return;
    const branchId = selectedBranch.id;
    setOverrides((o) => ({
      ...o,
      [svcId]: { ...(o[svcId] || {}), [veh]: price },
    }));
    const vehRef = ref(database, `services/${svcId}/branchPrices/${branchId}`);
    update(vehRef, { [veh]: price });
  }

  function toggleAddOn(addOnId: string) {
    if (!selectedBranch) return;
    const branchId = selectedBranch.id;
    const now = !enabledAddOns[addOnId];

    setEnabledAddOns((prev) => ({ ...prev, [addOnId]: now }));

    const branchAddOnsRef = ref(database, `Branches/${branchId}/AddOns`);

    if (now) {
      update(branchAddOnsRef, { [addOnId]: true });

      const initPrice = addOns.find((a) => a.id === addOnId)!.defaultPrice;
      setAddOnOverrides((prev) => ({ ...prev, [addOnId]: initPrice }));

      update(ref(database, `addOns/${addOnId}/branchPrices/${branchId}`), {
        price: initPrice,
      });
    } else {
      update(branchAddOnsRef, { [addOnId]: null });

      setAddOnOverrides((prev) => {
        const next = { ...prev };
        delete next[addOnId];
        return next;
      });

      remove(ref(database, `addOns/${addOnId}/branchPrices/${branchId}`));
    }
  }

  function updateAddOnOverride(addOnId: string, price: number) {
    if (!selectedBranch) return;
    const branchId = selectedBranch.id;

    setAddOnOverrides((prev) => ({ ...prev, [addOnId]: price }));

    update(ref(database, `addOns/${addOnId}/branchPrices/${branchId}`), {
      price,
    });
  }

  const columns: ColumnDef<Branch>[] = [
    {
      accessorKey: "name",
      header: "Branch Name",
    },
    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "contact",
      header: "Contact Number",
    },
    {
      accessorKey: "schedule",
      header: "Open Days",
    },
    {
      accessorKey: "bays",
      header: "Bays",
    },
    {
      accessorKey: "services",
      header: "Services",
    },
    {
      accessorKey: "addOns",
      header: "Add Ons",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const branch = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleViewBranch(branch)}
              className="h-8 w-8 p-0"
              title="View"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openEditDialog(branch)}
              className="h-8 w-8 p-0"
              title="Edit"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => openDeleteDialog(branch)}
              className="h-8 w-8 p-0 text-red-500"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Branches</h2>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Branch</DialogTitle>
                <DialogDescription>
                  Enter the details for the new branch. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="information" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="information">
                    Branch Information
                  </TabsTrigger>
                  <TabsTrigger value="services">Services & Add-ons</TabsTrigger>
                </TabsList>
                <TabsContent value="information">
                  <form id="add-branch-form" onSubmit={handleAddBranch}>
                    <div className="grid gap-4 py-4 max-h-[300px] overflow-y-scroll">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          className="col-span-3"
                          required
                          value={newBranch.name}
                          onChange={(e) =>
                            setNewBranch({ ...newBranch, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="address" className="text-right">
                          Address
                        </Label>
                        <Textarea
                          id="address"
                          className="col-span-3"
                          required
                          value={newBranch.address}
                          onChange={(e) =>
                            setNewBranch({
                              ...newBranch,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="contact" className="text-right">
                          Contact
                        </Label>
                        <Input
                          id="contact"
                          className="col-span-3"
                          required
                          value={newBranch.contact}
                          onChange={(e) =>
                            setNewBranch({
                              ...newBranch,
                              contact: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="schedule" className="text-right">
                          Schedule
                        </Label>
                        <Input
                          id="schedule"
                          className="col-span-3"
                          required
                          value={newBranch.schedule}
                          onChange={(e) =>
                            setNewBranch({
                              ...newBranch,
                              schedule: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="bays" className="text-right">
                          Number of Bays
                        </Label>
                        <Input
                          id="bays"
                          type="number"
                          min="1"
                          className="col-span-3"
                          required
                          value={newBranch.bays}
                          onChange={(e) =>
                            setNewBranch({
                              ...newBranch,
                              bays: parseInt(e.target.value) || 1, // Fallback to 1
                            })
                          }
                        />
                      </div>
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-lg font-semibold mb-2">
                          Supervisor Info
                        </h4>

                        <div className="space-y-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="visorFirstName"
                              className="text-right"
                            >
                              First Name
                            </Label>
                            <Input
                              id="visorFirstName"
                              className="col-span-3"
                              required
                              value={newBranch.visorFirstName}
                              onChange={(e) =>
                                setNewBranch({
                                  ...newBranch,
                                  visorFirstName: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="visorLastName"
                              className="text-right"
                            >
                              Last Name
                            </Label>
                            <Input
                              id="visorLastName"
                              className="col-span-3"
                              required
                              value={newBranch.visorLastName}
                              onChange={(e) =>
                                setNewBranch({
                                  ...newBranch,
                                  visorLastName: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="visorLocation"
                              className="text-right"
                            >
                              Location
                            </Label>
                            <Input
                              id="visorLocation"
                              className="col-span-3"
                              required
                              value={newBranch.visorLocation}
                              onChange={(e) =>
                                setNewBranch({
                                  ...newBranch,
                                  visorLocation: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="visorEmail" className="text-right">
                              Email
                            </Label>
                            <Input
                              id="visorEmail"
                              type="email"
                              className="col-span-3"
                              required
                              value={newBranch.visorEmail}
                              onChange={(e) =>
                                setNewBranch({
                                  ...newBranch,
                                  visorEmail: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </TabsContent>
                <TabsContent value="services">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="py-4 space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Available Services
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {services.map((svc) => (
                            <div
                              key={svc.id}
                              className="flex justify-between items-center"
                            >
                              <div>
                                <p className="font-medium">{svc.name} • {svc.estimatedTime} mins</p>
                                <p className="text-sm text-gray-500">
                                  {svc.description}
                                </p>
                              </div>
                              <Switch
                                checked={!!enabledServices[svc.id]}
                                onCheckedChange={() => toggleService(svc.id)}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3 className="text-lg font-medium mb-4">
                          Available Add-ons
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                          {addOns.map((a) => (
                            <div key={a.id} className="mb-4">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="font-medium">
                                    {a.name} • {a.estimatedTime} mins
                                  </p>
                                </div>
                                <Switch
                                  checked={enabledAddOns[a.id] || false}
                                  onCheckedChange={() => toggleAddOn(a.id)}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button
                  type="submit"
                  form="add-branch-form"
                  className="bg-[#FFD000] hover:bg-[#FFDA44] text-black"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Branch"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white rounded-md shadow-sm border border-gray-200">
          <DataTable
            columns={columns}
            data={branches}
            searchKey="name"
            searchPlaceholder="Search branches..."
          />
        </div>
      </div>

      {/* Edit Branch Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>
              Update the branch details. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="information">Branch Information</TabsTrigger>
              <TabsTrigger value="services">Services & Add-ons</TabsTrigger>
            </TabsList>
            <TabsContent value="information">
              <form id="edit-branch-form" onSubmit={handleEditBranch}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="edit-name"
                      className="col-span-3"
                      defaultValue={selectedBranch?.name}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-address" className="text-right">
                      Address
                    </Label>
                    <Textarea
                      id="edit-address"
                      className="col-span-3"
                      defaultValue={selectedBranch?.address}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-contact" className="text-right">
                      Contact
                    </Label>
                    <Input
                      id="edit-contact"
                      className="col-span-3"
                      defaultValue={selectedBranch?.contact}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-schedule" className="text-right">
                      Schedule
                    </Label>
                    <Input
                      id="edit-schedule"
                      className="col-span-3"
                      defaultValue={selectedBranch?.schedule}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="edit-bays" className="text-right">
                      Number of Bays
                    </Label>
                    <Input
                      id="edit-bays"
                      type="number"
                      min="1"
                      className="col-span-3"
                      defaultValue={selectedBranch?.bays}
                      required
                    />
                  </div>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="services">
              <ScrollArea className="h-[400px] pr-4">
                <div className="py-4 space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Available Services
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {services.map((svc) => (
                        <div key={svc.id}>
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{svc.name} • {svc.estimatedTime} mins</p>
                              <p className="text-sm text-gray-500">
                                {svc.description}
                              </p>
                            </div>
                            <Switch
                              checked={!!enabledServices[svc.id]}
                              onCheckedChange={() => toggleService(svc.id)}
                            />
                          </div>
                          {enabledServices[svc.id] && (
                            <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                              {(
                                [
                                  "sedan",
                                  "suv",
                                  "pickup",
                                  "motorcycle",
                                ] as const
                              ).map((v) => (
                                <div key={v} className="flex flex-col">
                                  <Label className="text-xs mb-1 capitalize">
                                    {v}
                                  </Label>
                                  <Input
                                    type="number"
                                    value={
                                      overrides[svc.id]?.[v] ??
                                      svc.defaultPrices[v]
                                    }
                                    onChange={(e) =>
                                      updateOverride(
                                        svc.id,
                                        v,
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Available Add-ons
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      {addOns.map((a) => (
                        <div key={a.id} className="mb-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                {a.name} • {a.estimatedTime} mins
                              </p>
                            </div>
                            <Switch
                              checked={enabledAddOns[a.id] || false}
                              onCheckedChange={() => toggleAddOn(a.id)}
                            />
                          </div>

                          {enabledAddOns[a.id] && (
                            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex flex-col">
                                <Label className="text-xs mb-1">
                                  Price (₱)
                                </Label>
                                <Input
                                  type="number"
                                  value={addOnOverrides[a.id] ?? a.defaultPrice}
                                  onChange={(e) =>
                                    updateAddOnOverride(
                                      a.id,
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button
              type="submit"
              form="edit-branch-form"
              className="bg-[#FFD000] hover:bg-[#FFDA44] text-black"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Branch Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Branch</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this branch? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">
              You are about to delete:{" "}
              <span className="font-bold">{selectedBranch?.name}</span>
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteBranch}>
              Delete Branch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
