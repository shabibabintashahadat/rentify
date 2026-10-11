import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export const POST = async (req: Request) => {
	const { email, password } = await req.json();

	if (!email || !password) {
		return NextResponse.json(
			{ error: "All fields are required." },
			{ status: 400 }
		);
	}

	try {
		const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [
			email,
		]);
		const user = (rows as any[])[0];

		if (!user) {
			return NextResponse.json(
				{ error: "User not found." },
				{ status: 404 }
			);
		}

		const isPasswordMatch = await bcrypt.compare(password, user.password);
		if (!isPasswordMatch) {
			return NextResponse.json(
				{ error: "Invalid credentials." },
				{ status: 401 }
			);
		}

		return NextResponse.json(
			{
				message: "Signin successful.",
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					phone: user.phone,
					is_admin: user.is_admin,
				},
			},
			{ status: 200 }
		);
	} catch (error: any) {
		console.error("Signin error:", error);
		if (error.code === "ECONNREFUSED") {
			return NextResponse.json(
				{ error: "Database connection failed: MySQL server is not running or unreachable on port 3306." },
				{ status: 500 }
			);
		}
		if (error.code === "ER_BAD_DB_ERROR") {
			return NextResponse.json(
				{ error: "Database 'HomeRent' not found. Please run schema.sql to create it." },
				{ status: 500 }
			);
		}
		if (error.code === "ER_NO_SUCH_TABLE") {
			return NextResponse.json(
				{ error: "Table 'Users' not found. Please import schema.sql into MySQL." },
				{ status: 500 }
			);
		}
		return NextResponse.json(
			{ error: error?.message || "Error signing in." },
			{ status: 500 }
		);
	}
};
