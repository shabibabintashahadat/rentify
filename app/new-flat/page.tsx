"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function Flats() {
  const { user } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    number_of_rooms: "",
    number_of_washrooms: "",
    number_of_kitchens: "",
    floor_number: "",
    house_no: "",
    road_no: "",
    area_name: "",
    district: "",
    division: "",
    description: "",
    rent_amount: "",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please sign in to add a flat.");
      router.push("/signin");
      return;
    }

    // Add user ID to the form data
    const dataToSubmit = { ...formData, user_id: user.id, is_available: true };

    try {
      const response = await fetch("/api/flats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        throw new Error("Failed to add flat.");
      }

      toast.success("Flat added successfully!");
      router.push("/");
    } catch (error) {
      toast.error((error as Error).message || "Error adding flat.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <Toaster />
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-3xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Flat</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Rooms</label>
            <input
              type="number"
              name="number_of_rooms"
              value={formData.number_of_rooms}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Washrooms</label>
            <input
              type="number"
              name="number_of_washrooms"
              value={formData.number_of_washrooms}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Kitchens</label>
            <input
              type="number"
              name="number_of_kitchens"
              value={formData.number_of_kitchens}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Floor Number</label>
            <input
              type="number"
              name="floor_number"
              value={formData.floor_number}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">House No</label>
            <input
              type="text"
              name="house_no"
              value={formData.house_no}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Road No</label>
            <input
              type="text"
              name="road_no"
              value={formData.road_no}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Area Name</label>
            <input
              type="text"
              name="area_name"
              value={formData.area_name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Division</label>
            <input
              type="text"
              name="division"
              value={formData.division}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">Rent Amount (BDT)</label>
            <input
              type="number"
              name="rent_amount"
              value={formData.rent_amount}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="col-span-2 bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add Flat
          </button>
        </form>
      </div>
    </div>
  );
}
