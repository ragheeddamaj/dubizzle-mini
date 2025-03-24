import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// Get a specific ad by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { db } = await connectToDatabase()

    const ad = await db.collection("ads").findOne({ _id: new ObjectId(id) })

    if (!ad) {
      return NextResponse.json({ error: "Ad not found" }, { status: 404 })
    }

    return NextResponse.json({
      ad: {
        ...ad,
        _id: ad._id.toString(),
      },
    })
  } catch (error: any) {
    console.error("Error fetching ad:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch ad" }, { status: 500 })
  }
}

// Update an ad
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const updateData = await request.json()

    const { db } = await connectToDatabase()

    const { _id, ...dataToUpdate } = updateData

    await db.collection("ads").updateOne({ _id: new ObjectId(id) }, { $set: dataToUpdate })

    return NextResponse.json({
      success: true,
      ad: {
        ...updateData,
        _id: id,
      },
    })
  } catch (error: any) {
    console.error("Error updating ad:", error)
    return NextResponse.json({ error: error.message || "Failed to update ad" }, { status: 500 })
  }
}

// Delete an ad
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const { db } = await connectToDatabase()

    await db.collection("ads").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      message: "Ad deleted successfully",
    })
  } catch (error: any) {
    console.error("Error deleting ad:", error)
    return NextResponse.json({ error: error.message || "Failed to delete ad" }, { status: 500 })
  }
}

