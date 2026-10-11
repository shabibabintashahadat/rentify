import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id) {
    return NextResponse.json(
      { error: "Flat ID is required." },
      { status: 400 }
    );
  }

  try {
    const [rows] = await db.query(
      `
      SELECT 
        Flat.*,
        Users.id AS user_id,
        Users.name AS user_name,
        Users.email AS user_email,
        Users.phone AS user_phone
      FROM Flat
      INNER JOIN Users ON Flat.user_id = Users.id
      WHERE Flat.id = ?
    `,
      [id]
    );

    const flat = (rows as any[])[0];

    if (!flat) {
      return NextResponse.json(
        { error: "Flat not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { flat },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch flat info." },
      { status: 500 }
    );
  }
}


export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
  
    if (!id) {
      return NextResponse.json(
        { error: "Flat ID is required." },
        { status: 400 }
      );
    }
  
    try {
      // Check if the flat exists before deletion
      const [flatRows] = await db.query(
        `SELECT * FROM Flat WHERE id = ?`,
        [id]
      );
      const flat = (flatRows as any[])[0];
  
      if (!flat) {
        return NextResponse.json(
          { error: "Flat not found." },
          { status: 404 }
        );
      }
  
      // Perform the deletion
      await db.query(`DELETE FROM Flat WHERE id = ?`, [id]);
  
      return NextResponse.json(
        { message: "Flat deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to delete flat." },
        { status: 500 }
      );
    }
  }