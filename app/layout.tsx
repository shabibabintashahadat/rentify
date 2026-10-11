import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
	title: "Home Renting Service",
	description: "Home Renting Service",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`antialiased`}>
				<AuthProvider>
					<Toaster />
					<Navbar />
					<main className="min-h-[calc(100vh-64px)]">{children}</main>
				</AuthProvider>
			</body>
		</html>
	);
}
