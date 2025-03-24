import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"

// Moderate an ad (approve or reject)
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const { status, rejectionReason, comment } = await request.json()

    const { db } = await connectToDatabase()

    const updateData: any = {
      status,
      moderatedAt: new Date().toISOString(),
    }

    if (status === "rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason
    }

    // Add moderator comment if provided
    if (comment) {
      updateData.moderatorComment = comment
    }

    await db.collection("ads").updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    return NextResponse.json({
      success: true,
      id,
      status,
      comment: comment || null,
    })
  } catch (error: any) {
    console.error("Error moderating ad:", error)
    return NextResponse.json({ error: error.message || "Failed to moderate ad" }, { status: 500 })
  }
}

