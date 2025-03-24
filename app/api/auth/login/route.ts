import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const { db } = await connectToDatabase()

    // Find user by email
    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
    }

    const userData = {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      userType: user.userType,
    }

    // Create JWT token
    const token = jwt.sign({ id: userData.id, email: userData.email, userType: userData.userType }, JWT_SECRET, {
      expiresIn: "7d",
    })

    // Set token in cookies
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return NextResponse.json({ user: userData })
  } catch (error: any) {
    console.error("Login error:", error)
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 })
  }
}

