import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

// Get ads by user ID
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId

    const { db } = await connectToDatabase()

    const ads = await db.collection("ads").find({ userId }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      ads: ads.map((ad) => ({
        ...ad,
        _id: ad._id.toString(),
      })),
    })
  } catch (error: any) {
    console.error("Error fetching user ads:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch user ads" }, { status: 500 })
  }
}

