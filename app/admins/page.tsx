"use client";

import { useEffect, useState } from "react";
import { ref, set, onValue, remove, update } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { sendInitialPasswordReset } from "@/utils/pwreset";
import { Key } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Supervisor = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  branchId: string;
  branchName: string;
  location?: string;
};

export default function ManageSupervisorsPage() {
  const { toast } = useToast();
  const [supervisors, setSupervisors] = useState<Supervisor[]>([]);
  const [selectedSupervisor, setSelectedSupervisor] =
    useState<Supervisor | null>(null);
  const [reassignSupervisorUid, setReassignSupervisorUid] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [branches, setBranches] = useState<{ id: string; name: string }[]>([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newSupervisor, setNewSupervisor] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    branchId: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const [resetDialogUser, setResetDialogUser] = useState<Supervisor | null>(
    null
  );
  const [isSending, setIsSending] = useState(false);

  // Load branches once
  useEffect(() => {
    const branchRef = ref(database, "Branches");
    onValue(branchRef, (snapshot) => {
      const data = snapshot.val() || {};
      const loaded = Object.entries(data).map(([id, b]: any) => ({
        id,
        name: b.profile?.name || id,
      }));
      setBranches(loaded);
    });
  }, []);

  // Load supervisors and attach branch name
  useEffect(() => {
    const userRef = ref(database, "users");
    const branchRef = ref(database, "Branches");

    onValue(userRef, (snap) => {
      const users = snap.val() || {};
      onValue(branchRef, (bSnap) => {
        const bData = bSnap.val() || {};
        const result = Object.entries(users)
          .filter(([_, u]: any) => u.role === "supervisor")
          .map(([id, u]: any) => {

            return {
              id,
              firstName: u.firstName,
              lastName: u.lastName,
              email: u.email,
              branchId: u.branchId,
              branchName: bData[u.branchId]?.profile?.name || "Unknown",
              location: u.location || "Unknown",
            };
          });

        setSupervisors(result);
        setLoading(false);
      });
    });
  }, []);

  const handleSave = async () => {
    if (!selectedSupervisor) return;

    setIsSaving(true);

    try {
      await update(ref(database, `users/${selectedSupervisor.id}`), {
        firstName: editData.firstName,
        lastName: editData.lastName,
        email: editData.email,
        branchId: editData.branchId,
      });

      toast({
        title: "Supervisor Updated",
        description: `${editData.firstName} ${editData.lastName}'s details have been updated.`,
      });

      setEditDialogOpen(false);
      setSelectedSupervisor(null);
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedSupervisor || !reassignSupervisorUid) return;

    setDeleting(true);

    try {
      const reassignRef = ref(database, `users/${reassignSupervisorUid}`);
      const reassignedSnap = await new Promise<any>((resolve) => {
        onValue(reassignRef, (snap) => resolve(snap.val()), { onlyOnce: true });
      });

      if (!reassignedSnap || reassignedSnap.role !== "supervisor") {
        toast({
          title: "Invalid Reassignment",
          description: "User ID is invalid or not a supervisor.",
          variant: "destructive",
        });
        setDeleting(false);
        return;
      }

      await remove(ref(database, `users/${selectedSupervisor.id}`));

      toast({
        title: "Supervisor Removed",
        description: `Removed ${selectedSupervisor.firstName} and reassigned to ${reassignSupervisorUid}.`,
      });

      setSelectedSupervisor(null);
      setReassignSupervisorUid("");
    } catch (err: any) {
      toast({
        title: "Deletion Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }: any) => {
        const s: Supervisor = row.original;
        return (
          <div>
            <div className="font-medium">
              {s.firstName} {s.lastName}
            </div>
            <div className="text-xs text-muted-foreground">{s.email}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "branchName",
      header: "Branch",
    },
    // {
    //   accessorKey: "email",
    //   header: "Email",
    //   cell: () => null, // hide it
    //   enableSorting: false,
    //   enableHiding: false,
    // },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const s: Supervisor = row.original;
        return (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              title="Send Reset Password Link"
              onClick={() => setResetDialogUser(s)}
            >
              <Key className="w-4 h-4 text-blue-600" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              title="Edit"
              onClick={() => {
                setSelectedSupervisor(s);
                setEditData({
                  firstName: s.firstName,
                  lastName: s.lastName,
                  email: s.email,
                  branchId: s.branchId,
                });
                setEditDialogOpen(true);
              }}
            >
              <Pencil className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              title="Delete"
              onClick={() => {
                setSelectedSupervisor(s);
                setDeleteDialogOpen(true);
              }}
              className="text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Supervisors</h2>
        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="bg-[#FFD000] hover:bg-[#FFDA44] text-black"
        >
          Add Supervisor
        </Button>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm">Loading supervisors...</div>
      ) : (
        <DataTable
          columns={columns}
          data={supervisors}
          searchKey="name"
          searchPlaceholder="Search supervisors..."
        />
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Supervisor</DialogTitle>
            <DialogDescription>
              Assign a replacement before deletion.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-black">
            Current Branch:{" "}
            <span className="font-semibold">
              {selectedSupervisor?.branchName}
            </span>
          </p>
          <Label>Reassign to New Supervisor</Label>
          {supervisors.filter(
            (s) =>
              s.id !== selectedSupervisor?.id &&
              (!s.branchId || s.branchId.trim() === "")
          ).length > 0 ? (
            <Select
              value={reassignSupervisorUid}
              onValueChange={setReassignSupervisorUid}
            >
              <SelectTrigger className="col-span-1">
                <SelectValue placeholder="Select a new supervisor" />
              </SelectTrigger>
              <SelectContent>
                {supervisors
                  .filter(
                    (s) =>
                      s.id !== selectedSupervisor?.id &&
                      (!s.branchId || s.branchId.trim() === "")
                  )
                  .map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} (
                      {s.location || "Unknown Location"})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-sm text-muted-foreground max-w-[450px]">
              No unassigned supervisors available. Please{" "}
              <span className="text-blue-600 font-medium">
                create a new one
              </span>{" "}
              using the <b>“Add Supervisor”</b> button.
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supervisor</DialogTitle>
            <DialogDescription>
              Update their profile and branch.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>First Name</Label>
              <Input
                value={editData.firstName}
                onChange={(e) =>
                  setEditData({ ...editData, firstName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Last Name</Label>
              <Input
                value={editData.lastName}
                onChange={(e) =>
                  setEditData({ ...editData, lastName: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Email</Label>
              <Input
                value={editData.email}
                onChange={(e) =>
                  setEditData({ ...editData, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Branch</Label>
              <Select
                value={editData.branchId}
                onValueChange={(val) =>
                  setEditData({ ...editData, branchId: val })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Supervisor</DialogTitle>
            <DialogDescription>
              A default password will be used.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>First Name</Label>
              <Input
                value={newSupervisor.firstName}
                onChange={(e) =>
                  setNewSupervisor({
                    ...newSupervisor,
                    firstName: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Last Name</Label>
              <Input
                value={newSupervisor.lastName}
                onChange={(e) =>
                  setNewSupervisor({
                    ...newSupervisor,
                    lastName: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Email</Label>
              <Input
                type="email"
                value={newSupervisor.email}
                onChange={(e) =>
                  setNewSupervisor({ ...newSupervisor, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Location</Label>
              <Input
                value={newSupervisor.location}
                onChange={(e) =>
                  setNewSupervisor({
                    ...newSupervisor,
                    location: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={isCreating}
              onClick={async () => {
                setIsCreating(true);
                try {
                  const { firstName, lastName, email, location } =
                    newSupervisor;
                  const password = "defaultpassword"; // Replace later
                  const res = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                  );
                  const uid = res.user.uid;

                  await sendInitialPasswordReset(email);

                  await set(ref(database, `users/${uid}`), {
                    email,
                    firstName,
                    lastName,
                    location,
                    role: "supervisor",
                    branchId: "",
                    profileImage: "",
                  });

                  toast({
                    title: "Supervisor Created",
                    description: `${firstName} ${lastName} has been added.`,
                  });

                  setNewSupervisor({
                    firstName: "",
                    lastName: "",
                    email: "",
                    location: "",
                  });
                  setCreateDialogOpen(false);
                } catch (err: any) {
                  toast({
                    title: "Error",
                    description: err.message,
                    variant: "destructive",
                  });
                }
                setIsCreating(false);
              }}
            >
              {isCreating ? "Creating..." : "Create Supervisor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {resetDialogUser && (
        <Dialog
          open={!!resetDialogUser}
          onOpenChange={() => setResetDialogUser(null)}
        >
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Send Password Reset Email</DialogTitle>
              <DialogDescription>
                Send a reset link to{" "}
                <span className="font-medium">{resetDialogUser.email}</span>?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setResetDialogUser(null)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  setIsSending(true);
                  try {
                    await sendInitialPasswordReset(resetDialogUser.email);
                    toast({
                      title: "Email Sent",
                      description: "Reset link sent successfully.",
                    });
                    setResetDialogUser(null);
                  } catch (err: any) {
                    toast({
                      title: "Error",
                      description: err.message,
                      variant: "destructive",
                    });
                  }
                  setIsSending(false);
                }}
                disabled={isSending}
              >
                {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Reset Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
