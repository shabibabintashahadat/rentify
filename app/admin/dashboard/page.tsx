"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

interface Flat {
  id: number;
  user_id: number;
  number_of_rooms: number;
  number_of_washrooms: number;
  area_name: string;
  district: string;
  rent_amount: number;
  is_available: boolean;
}

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [flats, setFlats] = useState<Flat[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (loading) return;
    if (!user || !user.is_admin) {
      toast.error("Access denied. Admins only.");
      router.push("/");
      return;
    }

    const fetchFlats = async () => {
      try {
        const res = await fetch("/api/flats");
        if (!res.ok) throw new Error("Failed to load flats");
        const data = await res.json();
        setFlats(data.flats || []);
      } catch (err) {
        toast.error("Failed to load flats.");
      } finally {
        setFetching(false);
      }
    };

    fetchFlats();
  }, [user, loading, router]);

  const handleDeleteFlat = async (flatId: number) => {
    if (!confirm("Are you sure you want to delete this flat as an admin?")) return;
    try {
      const res = await fetch(`/api/flats/${flatId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete flat");
      setFlats((prev) => prev.filter((f) => f.id !== flatId));
      toast.success("Flat deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete flat.");
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link
            href="/"
            className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition"
          >
            Back to Site
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
            <p className="text-sm text-gray-500 uppercase font-semibold">Total Listings</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">{flats.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
            <p className="text-sm text-gray-500 uppercase font-semibold">Available</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {flats.filter((f) => f.is_available).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-purple-500">
            <p className="text-sm text-gray-500 uppercase font-semibold">Admin User</p>
            <p className="text-lg font-semibold text-gray-800 mt-2">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Manage Listings</h2>
          {flats.length === 0 ? (
            <p className="text-gray-500">No flats listed.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-gray-600 text-sm">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Area / District</th>
                    <th className="py-3 px-4">Rooms</th>
                    <th className="py-3 px-4">Rent</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {flats.map((flat) => (
                    <tr key={flat.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-mono">{flat.id}</td>
                      <td className="py-3 px-4">
                        {flat.area_name}, {flat.district}
                      </td>
                      <td className="py-3 px-4">{flat.number_of_rooms}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-700">
                        {flat.rent_amount} BDT
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            flat.is_available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {flat.is_available ? "Available" : "Occupied"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <Link
                          href={`/flat/${flat.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleDeleteFlat(flat.id)}
                          className="text-red-600 hover:underline ml-3"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
