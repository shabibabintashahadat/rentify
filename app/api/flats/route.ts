import { NextResponse } from "next/server";
import db from "@/lib/db";

export const POST = async (req: Request) => {
  const {
    user_id,
    number_of_rooms,
    number_of_washrooms,
    number_of_kitchens,
    floor_number,
    house_no,
    road_no,
    area_name,
    district,
    division,
    description,
    rent_amount,
  } = await req.json();

  // Validate required fields
  if (
    !user_id ||
    !number_of_rooms ||
    !number_of_washrooms ||
    !number_of_kitchens ||
    !floor_number ||
    !house_no ||
    !road_no ||
    !area_name ||
    !district ||
    !division ||
    !rent_amount
  ) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  try {
    // Ensure the user exists
    const [userRows] = await db.query("SELECT * FROM Users WHERE id = ?", [
      user_id,
    ]);
    const user = (userRows as any[])[0];

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Insert the new flat into the database
    await db.query(
      `
      INSERT INTO Flat (
        user_id, number_of_rooms, number_of_washrooms, number_of_kitchens,
        floor_number, house_no, road_no, area_name, district, division,
        description, rent_amount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user_id,
        number_of_rooms,
        number_of_washrooms,
        number_of_kitchens,
        floor_number,
        house_no,
        road_no,
        area_name,
        district,
        division,
        description || null,
        rent_amount,
      ]
    );

    return NextResponse.json(
      { message: "Flat added successfully." },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error adding flat." },
      { status: 500 }
    );
  }
};
export const PUT = async (req: Request) => {
    const {
      flat_id,
      number_of_rooms,
      number_of_washrooms,
      number_of_kitchens,
      floor_number,
      house_no,
      road_no,
      area_name,
      district,
      division,
      description,
      rent_amount,
      is_available,
    } = await req.json();
  
    // Validate required fields
    if (!flat_id) {
      return NextResponse.json(
        { error: "Flat ID is required." },
        { status: 400 }
      );
    }
  
    try {
      // Check if the flat exists
      const [flatRows] = await db.query("SELECT * FROM Flat WHERE id = ?", [
        flat_id,
      ]);
      const flat = (flatRows as any[])[0];
  
      if (!flat) {
        return NextResponse.json(
          { error: "Flat not found." },
          { status: 404 }
        );
      }
  
      // Update the flat
      await db.query(
        `
        UPDATE Flat
        SET
          number_of_rooms = ?,
          number_of_washrooms = ?,
          number_of_kitchens = ?,
          floor_number = ?,
          house_no = ?,
          road_no = ?,
          area_name = ?,
          district = ?,
          division = ?,
          description = ?,
          rent_amount = ?,
          is_available = ?
        WHERE id = ?
        `,
        [
          number_of_rooms || flat.number_of_rooms,
          number_of_washrooms || flat.number_of_washrooms,
          number_of_kitchens || flat.number_of_kitchens,
          floor_number || flat.floor_number,
          house_no || flat.house_no,
          road_no || flat.road_no,
          area_name || flat.area_name,
          district || flat.district,
          division || flat.division,
          description || flat.description,
          rent_amount || flat.rent_amount,
          is_available !== undefined ? is_available : flat.is_available,
          flat_id,
        ]
      );
  
      return NextResponse.json(
        { message: "Flat updated successfully." },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Error updating flat." },
        { status: 500 }
      );
    }
  };

  
  export const GET = async () => {
    try {
      const [rows] = await db.query("SELECT * FROM Flat");
  
      return NextResponse.json(
        { flats: rows },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: "Error retrieving flats." },
        { status: 500 }
      );
    }
  };
  