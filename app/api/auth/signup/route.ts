import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import db from "@/lib/db";

export const POST = async (req: Request) => {
	const { name, email, phone, password } = await req.json();

	if (!name || !email || !phone || !password) {
		return NextResponse.json(
			{ error: "All fields are required." },
			{ status: 400 }
		);
	}

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const [existingUser]: any = await db.query(
			"SELECT email FROM Users WHERE email = ?",
			[email]
		);

		if (existingUser.length > 0) {
			return NextResponse.json(
				{ error: "Email already exists." },
				{ status: 400 }
			);
		}

		await db.query(
			"INSERT INTO Users (name, email, phone, password, is_admin) VALUES (?, ?, ?, ?, ?)",
			[name, email, phone, hashedPassword, false]
		);

		return NextResponse.json(
			{ message: "User created successfully." },
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("Signup error:", error);
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
		if (error.code === "ER_ACCESS_DENIED_ERROR") {
			return NextResponse.json(
				{ error: "MySQL access denied. Check your MySQL user/password in .env." },
				{ status: 500 }
			);
		}
		return NextResponse.json(
			{ error: error?.message || "Error creating user." },
			{ status: 500 }
		);
	}
};
