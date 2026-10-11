'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface UserProfile {
    id: number | string;
    name: string;
    email: string;
    phone: string;
}

interface RequestItem {
    request_id?: number;
    id?: number | string;
    name?: string;
    email?: string;
    phone?: string;
    requester_name?: string;
    requester_email?: string;
    requester_phone?: string;
    area_name?: string;
    number_of_rooms?: number;
    rent_amount?: number;
}

const ProfilePage = () => {
    const { user: cuser, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [requests, setRequests] = useState<RequestItem[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        if (authLoading) return;
        if (!cuser) {
            router.push("/signin");
            return;
        }

        const fetchUser = async () => {
            try {
                const response = await fetch(`/api/user-info/${cuser.id}`);
                if (!response.ok) throw new Error("Failed to fetch user");
                const data = await response.json();
                setUser(data.user);
                setRequests(data.requests || data.interested || []);

                setFormData({
                    name: data.user.name,
                    email: data.user.email,
                    phone: data.user.phone,
                });
            } catch (error) {
                console.error("Failed to fetch user", error);
            }
        };
        fetchUser();
    }, [cuser, authLoading, router]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!cuser) return;

        try {
            const response = await fetch(`/api/user-info/${cuser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) throw new Error("Failed to update profile");

            setUser((prev) => prev ? { ...prev, ...formData } : null);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update profile", error);
        }
    };

    const handleDeleteProfile = async () => {
        if (!cuser) return;
    
        if (confirm("Are you sure you want to delete your profile?")) {
          try {
            const response = await fetch(`/api/user-info/${cuser.id}`, {
              method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete profile");
            logout();
            router.push("/signin");
          } catch (error) {
            console.error("Failed to delete profile", error);
          }
        }
    };

    if (authLoading || (!cuser && !user)) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <p className="text-gray-600">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8">
            <div className="flex flex-col md:flex-row w-full max-w-6xl space-y-6 md:space-y-0 md:space-x-6 px-4">
                <div className="bg-white shadow-lg rounded-lg p-6 md:w-2/3">
                    <h1 className="text-2xl font-bold mb-4 text-gray-800">My Profile</h1>
                    {user ? (
                        <div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">Name</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900 mt-1">{user.name}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">Email</label>
                                {isEditing ? (
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900 mt-1">{user.email}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium">Phone</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                ) : (
                                    <p className="text-gray-900 mt-1">{user.phone}</p>
                                )}
                            </div>

                            {isEditing ? (
                                <div className="flex space-x-4 mt-6">
                                    <button
                                        onClick={handleSave}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md shadow hover:bg-gray-600 transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <div className="flex space-x-4 mt-6">
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition"
                                    >
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={handleDeleteProfile}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition"
                                    >
                                        Delete Profile
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </div>

                <div className="bg-white shadow-lg rounded-lg p-6 md:w-1/3">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Flat Inquiries</h2>
                    {requests && requests.length > 0 ? (
                        <div className="space-y-4 max-h-[500px] overflow-y-auto">
                            {requests.map((req, idx) => {
                                const name = req.requester_name || req.name || "Interested User";
                                const email = req.requester_email || req.email;
                                const phone = req.requester_phone || req.phone;
                                return (
                                    <div key={req.request_id || req.id || idx} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                                        <p className="text-gray-900 font-bold">{name}</p>
                                        {req.area_name && (
                                            <p className="text-sm text-teal-700 font-medium">
                                                Inquired for flat at: {req.area_name} {req.rent_amount ? `(${req.rent_amount} BDT)` : ''}
                                            </p>
                                        )}
                                        {phone && <p className="text-sm text-gray-600">📞 {phone}</p>}
                                        {email && <p className="text-sm text-gray-600">✉️ {email}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500">No inquiry requests received yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
