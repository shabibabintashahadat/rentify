"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";  // Importing useAuth

interface Flat {
  id: number;
  user_id: number;
  number_of_rooms: number;
  number_of_washrooms: number;
  number_of_kitchens: number;
  floor_number: number;
  house_no: string;
  road_no: string;
  area_name: string;
  district: string;
  division: string;
  description: string;
  rent_amount: number;
  is_available: boolean;
}

export default function Home() {
  const [flats, setFlats] = useState<Flat[]>([]);
  const { user } = useAuth();  // Accessing the current user
  const router = useRouter();

  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const response = await fetch("/api/flats");
        if (!response.ok) throw new Error("Failed to fetch flats");
        const data = await response.json();
        setFlats(data.flats);
      } catch (error) {
        toast.error("Error fetching flats.");
      }
    };

    fetchFlats();
  }, []);

  const handleCardClick = (flatId: number) => {
    router.push(`/flat/${flatId}`);
  };

  const handleInterestedClick = async (e: React.MouseEvent, flat: Flat) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please sign in to send an interest request.");
      router.push("/signin");
      return;
    }
    if (user.id === flat.user_id) {
      toast.error("You cannot request your own flat.");
      return;
    }
    try {
      const response = await fetch("/api/flatRequest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          flat_id: flat.id,
          owner_id: flat.user_id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send request.");
      }

      toast.success("Interest sent to the owner!");
    } catch (error) {
      toast.error("Failed to send request.");
    }
  };

  const handleDeleteFlat = async (flatId: number) => {
    if (!user) {
      toast.error("Please log in to delete a flat.");
      return;
    }

    try {
      const response = await fetch(`/api/flats/${flatId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete flat");

      setFlats((prevFlats) => prevFlats.filter((flat) => flat.id !== flatId));
      toast.success("Flat deleted successfully!");
    } catch (error) {
      toast.error("Error deleting flat.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 ">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Available Flats</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {flats.length > 0 ? (
            flats.map((flat) => (
              <div
                key={flat.id}
                className="relative bg-white rounded-xl shadow-md p-5 cursor-pointer hover:shadow-xl transition-all border border-gray-200"
                onClick={() => handleCardClick(flat.id)}
              >
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  Flat in {flat.area_name}, {flat.district}
                </h2>
                <div className="space-y-1 text-gray-600 mb-12">
                  <p><strong>Rooms:</strong> {flat.number_of_rooms}</p>
                  <p><strong>Washrooms:</strong> {flat.number_of_washrooms}</p>
                  <p><strong>Kitchens:</strong> {flat.number_of_kitchens}</p>
                  <p><strong>Floor:</strong> {flat.floor_number}</p>
                  <p><strong>Rent:</strong> <span className="font-semibold text-emerald-700">{flat.rent_amount} BDT</span></p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={flat.is_available ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                      {flat.is_available ? "Available" : "Not Available"}
                    </span>
                  </p>
                  {flat.description && (
                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">{flat.description}</p>
                  )}
                </div>

                <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center">
                  {user && flat.user_id === user.id ? (
                    <button
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFlat(flat.id);
                      }}
                    >
                      Delete Flat
                    </button>
                  ) : (
                    <div />
                  )}

                  {(!user || user.id !== flat.user_id) && (
                    <button
                      className="px-3 py-1.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition ml-auto"
                      onClick={(e) => handleInterestedClick(e, flat)}
                    >
                      Interested
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No flats available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
