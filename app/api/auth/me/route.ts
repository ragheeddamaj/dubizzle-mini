import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: NextRequest) {
  try {
    const token = cookies().get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ user: null })
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    const { db } = await connectToDatabase()

    // Find user by ID
    const user = await db.collection("users").findOne({ _id: new ObjectId(decoded.id) })

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
      },
    })
  } catch (error) {
    console.error("Get current user error:", error)
    return NextResponse.json({ user: null })
  }
}

