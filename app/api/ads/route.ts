import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

// Get all approved ads
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase()

    const ads = await db.collection("ads").find({ status: "approved" }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({
      ads: ads.map((ad) => ({
        ...ad,
        _id: ad._id.toString(),
      })),
    })
  } catch (error: any) {
    console.error("Error fetching ads:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch ads", ads: [] }, { status: 500 })
  }
}

// Create a new ad
export async function POST(request: NextRequest) {
  try {
    const adData = await request.json()

    const { db } = await connectToDatabase()

    const result = await db.collection("ads").insertOne(adData)

    return NextResponse.json({
      ad: {
        ...adData,
        _id: result.insertedId.toString(),
      },
    })
  } catch (error: any) {
    console.error("Error creating ad:", error)
    return NextResponse.json({ error: error.message || "Failed to create ad" }, { status: 500 })
  }
}

