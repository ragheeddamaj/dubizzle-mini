import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

// Get all pending ads for moderation
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    const ads = await db.collection("ads").find({ status: "pending" }).sort({ createdAt: 1 }).toArray()

    return NextResponse.json({
      ads: ads.map((ad) => ({
        ...ad,
        _id: ad._id.toString(),
      })),
    })
  } catch (error: any) {
    console.error("Error fetching pending ads:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch pending ads" }, { status: 500 })
  }
}

