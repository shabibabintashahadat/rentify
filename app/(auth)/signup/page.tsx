"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Signup = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});
			const data = await response.json();

			if (response.ok) {
				toast.success(data.message || "User created successfully!");
				setFormData({ name: "", email: "", phone: "", password: "" });
				router.push("/signin");
			} else {
				const errMsg = data.error || "Failed to create user.";
				setError(errMsg);
				toast.error(errMsg);
			}
		} catch (err) {
			const networkErr = "Unable to connect to the server. Please check your connection.";
			setError(networkErr);
			toast.error(networkErr);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-full flex justify-center items-center px-4 bg-gray-100 py-8">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-5"
			>
				<h1 className="text-2xl font-bold text-gray-800 text-center">
					Sign Up
				</h1>
				{error && (
					<div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
						{error}
					</div>
				)}
				<div className="space-y-4">
					<input
						type="text"
						name="name"
						placeholder="Full Name"
						required
						className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:outline-none"
						onChange={handleChange}
						value={formData.name}
					/>
					<input
						type="email"
						name="email"
						placeholder="Email Address"
						required
						className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:outline-none"
						onChange={handleChange}
						value={formData.email}
					/>
					<input
						type="tel"
						name="phone"
						placeholder="Phone Number"
						required
						className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:outline-none"
						onChange={handleChange}
						value={formData.phone}
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						required
						className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:outline-none"
						onChange={handleChange}
						value={formData.password}
					/>
				</div>
				<button
					type="submit"
					disabled={loading}
					className="w-full py-2 px-4 bg-gray-800 text-white font-semibold rounded hover:bg-gray-700 focus:outline-none disabled:opacity-50 transition"
				>
					{loading ? "Creating Account..." : "Sign Up"}
				</button>
				<div className="text-center">
					<p className="text-gray-600">
						Already have an account?{" "}
						<Link
							href="/signin"
							className="text-gray-800 font-semibold hover:underline"
						>
							Sign In
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
};

export default Signup;
