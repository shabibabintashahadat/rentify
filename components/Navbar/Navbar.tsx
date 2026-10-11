"use client";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Navbar = () => {
	const { user, logout } = useAuth();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		router.push("/signin");
	};

	return (
		<nav className="bg-gradient-to-r from-slate-900 via-gray-800 to-slate-800 shadow-lg py-2 px-6">
			<div className="max-w-7xl mx-auto flex justify-between items-center">
				<Link className="text-white text-2xl font-bold" href="/">
					Home Renting Service
				</Link>

				<div className="flex items-center space-x-4">
					{user?.is_admin && (
						<Link
							href="/admin/dashboard"
							className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300"
						>
							Admin Dashboard
						</Link>
					)}
					{user ? (
						<>
							<Link
								href="/profile"
								className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300"
							>
								Profile
							</Link>
							<Link
								href="/new-flat"
								className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition duration-300"
							>
								Rent Post
							</Link>
							<button
								onClick={handleLogout}
								className="bg-red-500 text-white font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
							>
								Logout
							</button>
						</>
					) : (
						<>
							<Link
								href="/signin"
								className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
							>
								Sign In
							</Link>
							<Link
								href="/signup"
								className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-300"
							>
								Sign Up
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
