"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ref, set, update, remove, onValue } from "firebase/database";
import { database } from "@/lib/firebase";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, CalendarDays, Layers, CreditCard } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CSVLink } from "react-csv";

export default function BranchDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [branch, setBranch] = useState<any>(null);

  const [reservations, setReservations] = useState<any[]>([]);
  const [revenue, setRevenue] = useState(0);

  const [statusFilter, setStatusFilter] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = reservations.filter((res) => {
    if (statusFilter !== "All" && res.status !== statusFilter.toLowerCase())
      return false;
    if (startDate && new Date(res.date) < new Date(startDate)) return false;
    if (endDate && new Date(res.date) > new Date(endDate)) return false;
    return true;
  });

  const pageCount = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filtered.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, startDate, endDate]);

  useEffect(() => {
    const resRef = ref(database, `Reservations/ReservationsByBranch/${id}`);
    const unsubscribe = onValue(resRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const loadedReservations: any[] = [];
      let totalRevenue = 0;

      Object.entries(data).forEach(([dateKey, appointments]: [string, any]) => {
        if (dateKey === "Bays") return;

        Object.entries(appointments).forEach(
          ([appointmentId, details]: [string, any]) => {
            const reservation = {
              ...details,
              date: details.timeSlot?.appointmentDate || dateKey,
            };

            loadedReservations.push(reservation);

            if (details.status === "completed") {
              totalRevenue += Number(details.amountDue || 0);
            }
          }
        );
      });

      setReservations(loadedReservations);
      setRevenue(totalRevenue);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    const branchRef = ref(database, `Branches/${id}`);
    const unsubscribe = onValue(branchRef, (snapshot) => {
      setBranch(snapshot.val());
    });
    return () => unsubscribe();
  }, [id]);

  if (!branch)
    return <div className="p-6 text-gray-500">Loading branch info...</div>;

  const csvHeaders = [
    { label: "Appointment ID", key: "appointmentId" },
    { label: "Vehicle Name", key: "vehicleName" },
    { label: "Plate Number", key: "plateNumber" },
    { label: "Service", key: "services" },
    { label: "Add-ons", key: "addons" },
    { label: "Date", key: "date" },
    { label: "Payment", key: "paymentMethod" },
    { label: "Status", key: "status" },
    { label: "Amount Due", key: "amountDue" },
  ];

  const csvData = filtered.map((res) => ({
    appointmentId: res.appointmentId || "",
    vehicleName: res.vehicleDetails?.vehicleName || "",
    plateNumber: res.vehicleDetails?.plateNumber || "",
    services: res.services?.map((s: any) => s.name).join(", ") || "",
    addons: res.addOns?.map((a: any) => a.name).join(", ") || "",
    date: res.date,
    paymentMethod: res.paymentMethod || "",
    status: res.status || "",
    amountDue: res.amountDue || 0,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{branch.profile?.name}</h1>
          <p className="text-sm text-gray-500">Branch ID: {id}</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => alert("Print feature coming soon")}>
            Print
          </Button>
          <Button variant="secondary" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-4 bg-white border p-4 rounded-xl shadow-sm">
          <Users className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-500">Total Bays</p>
            <p className="text-xl font-bold">
              {branch.Bays ? Object.keys(branch.Bays).length : 0}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-white border p-4 rounded-xl shadow-sm">
          <Layers className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Enabled Services</p>
            <p className="text-xl font-bold">
              {branch.Services ? Object.keys(branch.Services).length : 0}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-white border p-4 rounded-xl shadow-sm">
          <CalendarDays className="text-yellow-600" />
          <div>
            <p className="text-sm text-gray-500">Enabled Add-ons</p>
            <p className="text-xl font-bold">
              {branch.AddOns ? Object.keys(branch.AddOns).length : 0}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 bg-white border p-4 rounded-xl shadow-sm">
          <CreditCard className="text-purple-600" />
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-xl font-bold">₱{revenue}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="profile" className="w-full mt-4">
        <TabsList className="grid grid-cols-3 w-full mb-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="bays">Bays</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="space-y-6">
            {/* Branch Info - Full Width */}
            <div className="p-5 bg-white rounded-xl shadow-sm border">
              <h3 className="text-lg font-semibold mb-3">Branch Info</h3>
              <ul className="text-sm space-y-2 text-gray-700">
                <li>
                  <span className="font-medium">📍 Address:</span>{" "}
                  {branch.profile?.address}
                </li>
                <li>
                  <span className="font-medium">📞 Contact:</span>{" "}
                  {branch.profile?.contact_number}
                </li>
                <li>
                  <span className="font-medium">🗓 Schedule:</span>{" "}
                  {branch.profile?.schedule}
                </li>
              </ul>
            </div>

            {/* Add-ons & Services - 2 Columns */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Add-ons */}
              <div className="p-5 bg-white rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-3">Enabled Add-ons</h3>
                {branch.AddOns ? (
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {Object.values(branch.AddOns).map((a: any, i) => (
                      <li key={i}>{a.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No add-ons enabled.</p>
                )}
              </div>

              {/* Services */}
              <div className="p-5 bg-white rounded-xl shadow-sm border">
                <h3 className="text-lg font-semibold mb-3">Enabled Services</h3>
                {branch.Services ? (
                  <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                    {Object.values(branch.Services).map((s: any, i) => (
                      <li key={i}>{s.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No services enabled.</p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bays">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Bay List</h3>
              <Button
                onClick={() => {
                  const newBayId = prompt("Enter new bay name (e.g., Bay5):");
                  if (!newBayId) return;

                  const newRef = ref(
                    database,
                    `Branches/${id}/Bays/${newBayId}`
                  );
                  set(newRef, { status: "available" });
                }}
              >
                + Add Bay
              </Button>
            </div>

            {branch.Bays ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(branch.Bays).map(
                  ([bayId, info]: [string, any]) => {
                    const usageCount = reservations.filter(
                      (res) => res.selectedBay === bayId
                    ).length;

                    return (
                      <div
                        key={bayId}
                        className="p-4 border rounded-lg shadow-sm bg-white space-y-2"
                      >
                        <p className="text-lg font-semibold">{bayId}</p>
                        <p
                          className={`text-sm inline-block px-2 py-1 rounded ${
                            info.status === "available"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {info.status === "available"
                            ? "Available"
                            : "Unavailable"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Used {usageCount}×
                        </p>

                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newStatus =
                                info.status === "available"
                                  ? "unavailable"
                                  : "available";
                              const statusRef = ref(
                                database,
                                `Branches/${id}/Bays/${bayId}`
                              );
                              update(statusRef, { status: newStatus });
                            }}
                          >
                            Toggle Status
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const confirmDelete = confirm(`Delete ${bayId}?`);
                              if (!confirmDelete) return;
                              const deleteRef = ref(
                                database,
                                `Branches/${id}/Bays/${bayId}`
                              );
                              remove(deleteRef);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No bays found for this branch.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-3">
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border rounded-md p-2 text-sm"
                >
                  <option>All</option>
                  <option>Pending</option>
                  <option>Ongoing</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border rounded-md p-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border rounded-md p-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end mb-2">
              <CSVLink
                data={csvData}
                headers={csvHeaders}
                filename={`branch-${id}-reservations.csv`}
                className="bg-yellow-400 hover:bg-yellow-300 text-black font-medium py-2 px-4 rounded-md text-sm"
              >
                Export CSV
              </CSVLink>
            </div>

            {/* Filtered List */}
            {reservations.length > 0 ? (
              <ul className="space-y-2">
                {currentItems.map((res, i) => (
                  <li key={i} className="border rounded-lg p-3 shadow-sm">
                    <p className="font-medium">
                      {res.vehicleDetails?.vehicleName || "Unnamed Vehicle"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Service:{" "}
                      {res.services?.map((s: any) => s.name).join(", ")}
                    </p>
                    <p className="text-sm text-gray-500">
                      Add-ons:{" "}
                      {res.addOns?.map((a: any) => a.name).join(", ") || "None"}
                    </p>
                    <p className="text-sm text-gray-500">Date: {res.date}</p>
                    <p className="text-sm text-gray-500">
                      Payment: {res.paymentMethod}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: <span className="capitalize">{res.status}</span>
                    </p>
                    <p className="text-sm font-semibold text-green-600">
                      ₱{res.amountDue}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">
                No reservation history yet.
              </p>
            )}
            {pageCount > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {pageCount}
                </p>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, pageCount))
                    }
                    disabled={currentPage === pageCount}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
