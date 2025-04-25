"use client";

import { useState, useEffect } from "react";
import {
  ref,
  onValue,
  push,
  set,
  update,
  remove,
} from "firebase/database";
import { database } from "@/lib/firebase";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type Advertisement = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  type: "promotion" | "service";
  status: "active" | "inactive";
};

const DEFAULT_IMAGE = "/placeholder.svg";

export default function AdvertisementsPage() {
  const { toast } = useToast();

  // all ads
  const [ads, setAds] = useState<Advertisement[]>([]);

  // modal state
  const [isAddAdOpen, setIsAddAdOpen] = useState(false);
  const [isAddSvcOpen, setIsAddSvcOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // what ad we're editing/deleting
  const [selectedAd, setSelectedAd] = useState<Advertisement | null>(null);

  // load from RTDB
  useEffect(() => {
    const adsRef = ref(database, "advertisements");
    return onValue(adsRef, (snap) => {
      const data = snap.val() || {};
      const list: Advertisement[] = Object.entries(data).map(
        ([id, a]: any) => ({ id, ...a })
      );
      setAds(list);
    });
  }, []);

  const promotions = ads.filter((a) => a.type === "promotion");
  const serviceAds = ads.filter((a) => a.type === "service");

  // open handlers
  function openAddAd() {
    setSelectedAd(null);
    setIsAddAdOpen(true);
  }
  function openAddSvc() {
    setSelectedAd(null);
    setIsAddSvcOpen(true);
  }
  function openEdit(ad: Advertisement) {
    setSelectedAd(ad);
    setIsEditOpen(true);
  }
  function openDelete(ad: Advertisement) {
    setSelectedAd(ad);
    setIsDeleteOpen(true);
  }

  // common delete
  async function handleDelete() {
    if (!selectedAd) return;
    await remove(ref(database, `advertisements/${selectedAd.id}`));
    toast({ title: "Advertisement Deleted" });
    setIsDeleteOpen(false);
  }

  // add promotion
  async function handleAddAd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.title as HTMLInputElement).value;
    const description = (form.description as HTMLTextAreaElement).value;
    const imageUrl = (form.imageUrl as HTMLInputElement).value || DEFAULT_IMAGE;

    const payload = {
      title,
      description,
      imageUrl,
      type: "promotion" as const,
      status: "active" as const,
    };

    await set(push(ref(database, "advertisements")), payload);
    toast({ title: "Promotion Added" });
    setIsAddAdOpen(false);
  }

  // add service-type ad
  async function handleAddSvc(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const title = (form.title as HTMLInputElement).value;
    const description = (form.description as HTMLTextAreaElement).value;
    const imageUrl = (form.imageUrl as HTMLInputElement).value || DEFAULT_IMAGE;

    const payload = {
      title,
      description,
      imageUrl,
      type: "service" as const,
      status: "active" as const,
    };

    await set(push(ref(database, "advertisements")), payload);
    toast({ title: "Service Ad Added" });
    setIsAddSvcOpen(false);
  }

  // edit existing ad
  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedAd) return;
    const form = e.currentTarget;
    const title = (form.title as HTMLInputElement).value;
    const description = (form.description as HTMLTextAreaElement).value;
    const imageUrl = (form.imageUrl as HTMLInputElement).value || DEFAULT_IMAGE;
    const status = (form.status as any).value as Advertisement["status"];

    const updates = { title, description, imageUrl, status };
    await update(ref(database, `advertisements/${selectedAd.id}`), updates);
    toast({ title: "Advertisement Updated" });
    setIsEditOpen(false);
  }

  return (
    <div className="p-6 space-y-12">
      {/* ─── Promotions ─── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Promotions</h2>
          <Button onClick={openAddAd}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Promotion
          </Button>
        </div>
        <ScrollArea>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {promotions.map((ad) => (
              <Card key={ad.id}>
                <div className="relative">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button size="icon" onClick={() => openEdit(ad)}>
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => openDelete(ad)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <span
                    className={`absolute bottom-2 left-2 px-2 py-1 text-xs rounded-full ${
                      ad.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ad.status}
                  </span>
                </div>
                <CardHeader className="pt-2">
                  <CardTitle>{ad.title}</CardTitle>
                  <CardDescription className="uppercase text-xs">
                    Promotion
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{ad.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </section>

      {/* ─── Service Ads ─── */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Service Ads</h2>
          <Button onClick={openAddSvc}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Service Ad
          </Button>
        </div>
        <ScrollArea>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {serviceAds.map((ad) => (
              <Card key={ad.id}>
                <div className="relative">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button size="icon" onClick={() => openEdit(ad)}>
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => openDelete(ad)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                  <span
                    className={`absolute bottom-2 left-2 px-2 py-1 text-xs rounded-full ${
                      ad.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {ad.status}
                  </span>
                </div>
                <CardHeader className="pt-2">
                  <CardTitle>{ad.title}</CardTitle>
                  <CardDescription className="uppercase text-xs">
                    Service
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{ad.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </section>

      {/* ─── Add Promotion Modal ─── */}
      <Dialog open={isAddAdOpen} onOpenChange={setIsAddAdOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add Promotion</DialogTitle>
            <DialogDescription>Enter the details for your new promotion.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddAd} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" name="title" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" name="description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="https://..."
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                Add Promotion
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Add Service Ad Modal ─── */}
      <Dialog open={isAddSvcOpen} onOpenChange={setIsAddSvcOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Add Service Ad</DialogTitle>
            <DialogDescription>Enter the details for your new service ad.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSvc} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input id="title" name="title" className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea id="description" name="description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="https://..."
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                Add Service Ad
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Modal (promotion or service) ─── */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
            <DialogDescription>Update the details below.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">Title</Label>
              <Input
                id="title"
                name="title"
                defaultValue={selectedAd?.title}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="description" className="text-right">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={selectedAd?.description}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select
                name="status"
                defaultValue={selectedAd?.status}
                className="col-span-3"
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                defaultValue={selectedAd?.imageUrl}
                placeholder="https://..."
                className="col-span-3"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-[#FFD000] hover:bg-[#FFDA44] text-black">
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Confirm ─── */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Advertisement</DialogTitle>
            <DialogDescription>
              Are you sure? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
