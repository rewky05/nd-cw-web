// app/services/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ref, onValue, push, set, update, remove } from "firebase/database";
import { database } from "@/lib/firebase";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "@/components/ui/data-table";
import type { ColumnDef } from "@tanstack/react-table";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

//
// --- Types ---
//
type Branch = { id: string; name: string };

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
  branches: string[];
};

type AddOn = {
  id: string;
  name: string;
  defaultPrice: number;
  estimatedTime: number;
  branches: string[];
};

//
// --- Blank templates ---
//
const blankService: Omit<Service, "id"> = {
  name: "",
  description: "",
  defaultPrices: { sedan: 0, suv: 0, pickup: 0, motorcycle: 0 },
  estimatedTime: 0,
  branches: [],
};

const blankAddOn: Omit<AddOn, "id"> = {
  name: "",
  defaultPrice: 0,
  estimatedTime: 0,
  branches: [],
};

export default function ServicesPage() {
  const { toast } = useToast();

  // load branches once
  const [branches, setBranches] = useState<Branch[]>([]);
  useEffect(() => {
    const bRef = ref(database, "Branches");
    return onValue(bRef, (snap) => {
      const data = snap.val() || {};
      setBranches(
        Object.entries(data).map(([id, b]: any) => ({
          id,
          name: b.profile?.name || id,
        }))
      );
    });
  }, []);

  // which tab?
  const [tab, setTab] = useState<"services" | "addons">("services");

  //
  // --- SERVICES CRUD & state ---
  //
  const [services, setServices] = useState<Service[]>([]);
  useEffect(() => {
    const sRef = ref(database, "services");
    return onValue(sRef, (snap) => {
      const data = snap.val() || {};
      setServices(
        Object.entries(data).map(([id, svc]: any) => ({
          id,
          name: svc.name,
          description: svc.description,
          defaultPrices: svc.defaultPrices,
          estimatedTime: svc.estimatedTime,
          branches: svc.branches || [],
        }))
      );
    });
  }, []);

  const [svcDialogOpen, setSvcDialogOpen] = useState(false);
  const [deletingSvc, setDeletingSvc] = useState<Service | null>(null);
  const [editingSvc, setEditingSvc] = useState<Service | null>(null);
  const [svcForm, setSvcForm] = useState(blankService);
  const [svcSaving, setSvcSaving] = useState(false);

  function openSvcDialog(svc: Service | null) {
    setEditingSvc(svc);
    setSvcForm(svc ? { ...svc } : blankService);
    setSvcDialogOpen(true);
  }

  function toggleSvcBranch(bid: string) {
    setSvcForm((f) => ({
      ...f,
      branches: f.branches.includes(bid)
        ? f.branches.filter((x) => x !== bid)
        : [...f.branches, bid],
    }));
  }

  async function saveService() {
    setSvcSaving(true);
    const payload = {
      name: svcForm.name,
      description: svcForm.description,
      defaultPrices: svcForm.defaultPrices,
      estimatedTime: svcForm.estimatedTime,
      branches: svcForm.branches,
    };
    try {
      if (editingSvc) {
        await update(ref(database, `services/${editingSvc.id}`), payload);
        toast({ title: "Service updated" });
      } else {
        const newRef = push(ref(database, "services"));
        await set(newRef, payload);
        toast({ title: "Service added" });
      }
      setSvcDialogOpen(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setSvcSaving(false);
  }

  async function confirmDeleteService() {
    if (!deletingSvc) return;
    try {
      await remove(ref(database, `services/${deletingSvc.id}`));
      toast({ title: "Service deleted" });
      setDeletingSvc(null);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  const svcColumns: ColumnDef<Service>[] = [
    { accessorKey: "name", header: "Service" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "estimatedTime", header: "Time (min)" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => openSvcDialog(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-red-500"
            onClick={() => setDeletingSvc(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  //
  // --- ADD-ONS CRUD & state ---
  //
  const [addOns, setAddOns] = useState<AddOn[]>([]);
  useEffect(() => {
    const aRef = ref(database, "addOns");
    return onValue(aRef, (snap) => {
      const data = snap.val() || {};
      setAddOns(
        Object.entries(data).map(([id, ao]: any) => ({
          id,
          name: ao.name,
          defaultPrice: ao.defaultPrice,
          estimatedTime: ao.estimatedTime,
          branches: ao.branches || [],
        }))
      );
    });
  }, []);

  const [aoDialogOpen, setAoDialogOpen] = useState(false);
  const [deletingAo, setDeletingAo] = useState<AddOn | null>(null);
  const [editingAo, setEditingAo] = useState<AddOn | null>(null);
  const [aoForm, setAoForm] = useState(blankAddOn);
  const [aoSaving, setAoSaving] = useState(false);

  function openAoDialog(ao: AddOn | null) {
    setEditingAo(ao);
    setAoForm(ao ? { ...ao } : blankAddOn);
    setAoDialogOpen(true);
  }

  function toggleAoBranch(bid: string) {
    setAoForm((f) => ({
      ...f,
      branches: f.branches.includes(bid)
        ? f.branches.filter((x) => x !== bid)
        : [...f.branches, bid],
    }));
  }

  async function saveAddOn() {
    setAoSaving(true);
    const payload = {
      name: aoForm.name,
      defaultPrice: aoForm.defaultPrice,
      estimatedTime: aoForm.estimatedTime,
      branches: aoForm.branches,
    };
    try {
      if (editingAo) {
        await update(ref(database, `addOns/${editingAo.id}`), payload);
        toast({ title: "Add-On updated" });
      } else {
        const newRef = push(ref(database, "addOns"));
        await set(newRef, payload);
        toast({ title: "Add-On added" });
      }
      setAoDialogOpen(false);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setAoSaving(false);
  }

  async function confirmDeleteAddOn() {
    if (!deletingAo) return;
    try {
      await remove(ref(database, `addOns/${deletingAo.id}`));
      toast({ title: "Add-On deleted" });
      setDeletingAo(null);
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  }

  const aoColumns: ColumnDef<AddOn>[] = [
    { accessorKey: "name", header: "Add-On" },
    {
      accessorKey: "defaultPrice",
      header: "Default Price",
      cell: ({ row }) => `₱${row.original.defaultPrice}`,
    },
    { accessorKey: "estimatedTime", header: "Time (min)" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => openAoDialog(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-red-500"
            onClick={() => setDeletingAo(row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Catalog</h2>

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as "services" | "addons")}
      >
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="addons">Add-Ons</TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-4">
          <Button
            onClick={() => openSvcDialog(null)}
            className="bg-[#FFD000] text-black hover:bg-[#FFDA44]"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Service
          </Button>
          <DataTable
            columns={svcColumns}
            data={services}
            searchKey="name"
            searchPlaceholder="Search services…"
          />
        </TabsContent>

        <TabsContent value="addons" className="space-y-4">
          <Button
            onClick={() => openAoDialog(null)}
            className="bg-[#FFD000] text-black hover:bg-[#FFDA44]"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Add-On
          </Button>
          <DataTable
            columns={aoColumns}
            data={addOns}
            searchKey="name"
            searchPlaceholder="Search add-ons…"
          />
        </TabsContent>
      </Tabs>

      {/* --- Service Dialog --- */}
      <Dialog open={svcDialogOpen} onOpenChange={setSvcDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSvc ? "Edit Service" : "Add Service"}
            </DialogTitle>
            {editingSvc && (
              <DialogDescription>ID: {editingSvc.id}</DialogDescription>
            )}
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveService();
            }}
            className="space-y-4 py-4"
          >
            {/* Name */}
            <div className="grid grid-cols-4 gap-2 items-center">
              <Label htmlFor="svc-name" className="text-right">
                Name
              </Label>
              <Input
                id="svc-name"
                className="col-span-3"
                value={svcForm.name}
                onChange={(e) =>
                  setSvcForm({ ...svcForm, name: e.target.value })
                }
                required
              />
            </div>
            {/* Description */}
            <div className="grid grid-cols-4 gap-2 items-start">
              <Label htmlFor="svc-desc" className="text-right">
                Description
              </Label>
              <Textarea
                id="svc-desc"
                className="col-span-3"
                value={svcForm.description}
                onChange={(e) =>
                  setSvcForm({ ...svcForm, description: e.target.value })
                }
                required
              />
            </div>
            {/* Default Prices */}
            {(["sedan", "suv", "pickup", "motorcycle"] as const).map((v) => (
              <div key={v} className="grid grid-cols-4 gap-2 items-center">
                <Label className="text-right capitalize">{v} (₱)</Label>
                <Input
                  type="number"
                  className="col-span-3"
                  value={svcForm.defaultPrices[v]}
                  onChange={(e) =>
                    setSvcForm({
                      ...svcForm,
                      defaultPrices: {
                        ...svcForm.defaultPrices,
                        [v]: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  required
                />
              </div>
            ))}
            {/* Time */}
            <div className="grid grid-cols-4 gap-2 items-center">
              <Label htmlFor="svc-time" className="text-right">
                Time (min)
              </Label>
              <Input
                id="svc-time"
                type="number"
                className="col-span-3"
                value={svcForm.estimatedTime}
                onChange={(e) =>
                  setSvcForm({
                    ...svcForm,
                    estimatedTime: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            {/* Branch Assignment */}
            <div>
              <h3 className="font-semibold">Assign to Branches</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                {branches.map((b) => {
                  const sel = svcForm.branches.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      onClick={() => toggleSvcBranch(b.id)}
                      className={`p-3 rounded-lg border cursor-pointer select-none ${
                        sel ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      {b.name}
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-[#FFD000] text-black hover:bg-[#FFDA44]"
                disabled={svcSaving}
              >
                {svcSaving ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Service */}
      <Dialog open={!!deletingSvc} onOpenChange={() => setDeletingSvc(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Service?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-bold">{deletingSvc?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingSvc(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteService}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- Add-On Dialog --- */}
      <Dialog open={aoDialogOpen} onOpenChange={setAoDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {editingAo ? "Edit Add-On" : "Add Add-On"}
            </DialogTitle>
            {editingAo && (
              <DialogDescription>ID: {editingAo.id}</DialogDescription>
            )}
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveAddOn();
            }}
            className="space-y-4 py-4"
          >
            {/* Name */}
            <div className="grid grid-cols-4 gap-2 items-center">
              <Label htmlFor="ao-name" className="text-right">
                Name
              </Label>
              <Input
                id="ao-name"
                className="col-span-3"
                value={aoForm.name}
                onChange={(e) => setAoForm({ ...aoForm, name: e.target.value })}
                required
              />
            </div>
            {/* Price */}
            <div className="grid grid-cols-4 gap-2 items-center">
              <Label htmlFor="ao-price" className="text-right">
                Price (₱)
              </Label>
              <Input
                id="ao-price"
                type="number"
                className="col-span-3"
                value={aoForm.defaultPrice}
                onChange={(e) =>
                  setAoForm({
                    ...aoForm,
                    defaultPrice: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            {/* Time */}
            <div className="grid grid-cols-4 gap-2 items-center">
              <Label htmlFor="ao-time" className="text-right">
                Time (min)
              </Label>
              <Input
                id="ao-time"
                type="number"
                className="col-span-3"
                value={aoForm.estimatedTime}
                onChange={(e) =>
                  setAoForm({
                    ...aoForm,
                    estimatedTime: parseInt(e.target.value) || 0,
                  })
                }
                required
              />
            </div>
            {/* Branch Assignment */}
            <div>
              <h3 className="font-semibold">Assign to Branches</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                {branches.map((b) => {
                  const sel = aoForm.branches.includes(b.id);
                  return (
                    <div
                      key={b.id}
                      onClick={() => toggleAoBranch(b.id)}
                      className={`p-3 rounded-lg border cursor-pointer select-none ${
                        sel ? "border-blue-500 bg-blue-50" : "border-gray-200"
                      }`}
                    >
                      {b.name}
                    </div>
                  );
                })}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="bg-[#FFD000] text-black hover:bg-[#FFDA44]"
                disabled={aoSaving}
              >
                {aoSaving ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirm Delete Add-On */}
      <Dialog open={!!deletingAo} onOpenChange={() => setDeletingAo(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Add-On?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-bold">{deletingAo?.name}</span>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletingAo(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAddOn}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
