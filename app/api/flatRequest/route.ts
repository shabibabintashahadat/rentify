import { NextResponse } from "next/server";
import db from "@/lib/db";

export const POST = async (req: Request) => {
    const { flat_id, user_id, owner_id } = await req.json();
    console.log(flat_id);
    console.log(user_id);

    // Validate required fields
    if (!flat_id || !user_id) {
        return NextResponse.json(
            { error: "Flat ID and User ID are required." },
            { status: 400 }
        );
    }

    try {


        console.log("here");
        await db.query(
            `
            INSERT INTO UserRequests (
            user_owner, user_req, flat_id
            ) VALUES (?, ?, ?)
            `,
            [owner_id, user_id, flat_id]
        );

        return NextResponse.json(
            { message: "Request added successfully." },
            { status: 201 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Error adding request." },
            { status: 500 }
        );
    }
};