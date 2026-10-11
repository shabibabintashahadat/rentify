"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

interface Flat {
  id: number;
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
  created_at: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
}

export default function FlatPage() {
  const { user:user } = useAuth();
  const [flat, setFlat] = useState<Flat | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = useParams(); // Capture the `id` parameter from the URL

  useEffect(() => {
    // Fetch the flat data using the `id`
    const fetchFlatData = async () => {
      if (typeof id !== "string") return; // Ensure `id` is a string

      try {
        const response = await fetch(`/api/flats/${id}`);
        if (!response.ok) {
          throw new Error("Flat not found.");
        }
        const data = await response.json();
        setFlat(data.flat);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch flat data.");
        setLoading(false);
      }
    };

    fetchFlatData();
  }, [id]);

  const handleInterestedClick = async () => {
    if (!flat) return;
    if (!user) {
      toast.error("Please sign in to send an interest request.");
      router.push("/signin");
      return;
    }
    if (user.id === flat.user_id) {
      toast.error("You cannot send interest for your own flat.");
      return;
    }

    try {
      const response = await fetch('/api/flatRequest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          flat_id: flat.id,
          owner_id: flat.user_id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request.');
      }

      toast.success('Interest sent successfully!');
    } catch (error) {
      toast.error('Failed to send request.');
    }
  };

  if (loading || !flat) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <p className="text-gray-600">Loading flat details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link href="/" className="text-teal-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center relative py-12">
      <Link
        href="/"
        className="absolute top-4 left-4 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-300"
      >
        Back
      </Link>
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full relative">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Flat Details</h1>
          {(!user || user.id !== flat.user_id) && (
            <button
              onClick={handleInterestedClick}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-300 font-medium"
            >
              Interested
            </button>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Flat Information</h2>
            <div className="grid grid-cols-2 gap-4 font-serif">
              {[
                { label: "House No", value: flat.house_no },
                { label: "Floor Number", value: flat.floor_number },
                { label: "Rooms", value: flat.number_of_rooms },
                { label: "Washrooms", value: flat.number_of_washrooms },
                { label: "Kitchens", value: flat.number_of_kitchens },
                { label: "Area Name", value: flat.area_name },
                { label: "District", value: flat.district },
                { label: "Division", value: flat.division },
                { label: "Description", value: flat.description },
                { label: "Rent Amount", value: `BDT ${flat.rent_amount}` },
                { label: "Availability", value: flat.is_available ? "Available" : "Not Available" },
              ].map((info, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <p><strong>{info.label}:</strong> {info.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Owner Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Name", value: flat.user_name },
                { label: "Email", value: flat.user_email },
                { label: "Phone", value: flat.user_phone },
              ].map((info, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <p><strong>{info.label}:</strong> {info.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
