
import { NextResponse } from 'next/server';
import db from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Fetch user info
    const [userRows]: any = await db.query("SELECT * FROM Users WHERE id = ?", [id]);
    if (!userRows.length) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }
    const user = userRows[0];

    // Fetch requests for the user's flats
    const [userRequests]: any = await db.query(
      `SELECT ur.id AS request_id, ur.user_req, ur.flat_id, f.number_of_rooms, f.area_name, f.rent_amount, 
        u.name AS requester_name, u.email AS requester_email, u.phone AS requester_phone 
       FROM UserRequests ur 
       JOIN Flat f ON ur.flat_id = f.id 
       JOIN Users u ON ur.user_req = u.id 
       WHERE ur.user_owner = ?`,
      [id]
    );

    // Fetch all users from user_req in userRequests
    const userReqIds = userRequests.map((req: any) => req.user_req);
    let interestedUsers: any[] = [];
    if (userReqIds.length > 0) {
      const [queriedUsers]: any[] = await db.query(
        "SELECT * FROM Users WHERE id IN (?)",
        [userReqIds]
      );
      interestedUsers = queriedUsers;
    }

    return NextResponse.json(
      {
        user,
        interested: interestedUsers,
        requests: userRequests,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch user information and requests." },
      { status: 500 }
    );
  }
}

export const PUT = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
    const { name, email, phone } = await req.json();
    const { id } = await params;

    try {
        // Check if the user exists
        const [userRows]: any = await db.query("SELECT * FROM Users WHERE id = ?", [id]);
        if (!userRows.length) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

        // Update the user
        await db.query(
            "UPDATE Users SET name = ?, email = ?, phone = ? WHERE id = ?",
            [name, email, phone, id]
        );

        return NextResponse.json(
            { message: "User updated successfully." },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Error updating user." },
            { status: 500 }
        );
    }
};



export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
  
    if (!id) {
      return NextResponse.json(
        { error: "user ID is required." },
        { status: 400 }
      );
    }
  
    try {
      // Check if the user exists before deletion
      const [userRows] = await db.query(
        `SELECT * FROM Users WHERE id = ?`,
        [id]
      );
      const user = (userRows as any[])[0];
  
      if (!user) {
        return NextResponse.json(
          { error: "user not found." },
          { status: 404 }
        );
      }
  
      // Perform the deletion
      await db.query(`DELETE FROM Users WHERE id = ?`, [id]);
  
      return NextResponse.json(
        { message: "user deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to delete user." },
        { status: 500 }
      );
    }
  }

