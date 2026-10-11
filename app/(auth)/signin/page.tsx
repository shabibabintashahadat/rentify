"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const Signin = () => {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [error, setError] = useState<string | null>(null);
	const { login } = useAuth();
	const router = useRouter();

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/auth/signin", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			const data = await response.json();

			if (response.ok) {
				login(data.user);
				toast.success(data.message);
				setError(null);
				router.push("/");
			} else {
				setError(data.error);
			}
		} catch (err) {
			setError("Something went wrong.");
		}
	};

	return (
		<div className="h-full flex justify-center items-center px-4 bg-gradient-to-r from-amber-200 to-yellow-500">
			<form
				onSubmit={handleSubmit}
				className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6"
			>
				<h1 className="text-3xl font-bold text-gray-900 text-center">
					Sign In
				</h1>
				<p className="text-gray-700 text-center">
					Welcome back! Please sign in to your account.
				</p>
				{error && (
					<p className="text-sm text-red-500 text-center">{error}</p>
				)}
				<div className="space-y-4">
					<input
						type="email"
						name="email"
						placeholder="Email Address"
						className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
						onChange={handleChange}
					/>
					<input
						type="password"
						name="password"
						placeholder="Password"
						className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
						onChange={handleChange}
					/>
				</div>
				<button
					type="submit"
					className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none"
				>
					Sign In
				</button>
				<div className="text-center">
					<p className="text-gray-700">
						Don't have an account?{" "}
						<Link
							href="/signup"
							className="text-blue-600 font-semibold hover:underline"
						>
							Sign Up
						</Link>
					</p>
				</div>
			</form>
		</div>
	);
};

export default Signin;
