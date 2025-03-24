import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: NextRequest) {
  try {
    console.log("Registration API called")

    const body = await request.json()
    console.log("Registration request body:", body)

    const { fullName, email, password, userType } = body

    console.log("Connecting to database...")
    const { db } = await connectToDatabase()
    console.log("Connected to database")

    // Check if user already exists
    console.log("Checking if user exists:", email)
    const existingUser = await db.collection("users").findOne({ email: email.toLowerCase() })

    if (existingUser) {
      console.log("User already exists:", email)
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    console.log("Hashing password...")
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert new user
    const userData = {
      fullName,
      email: email.toLowerCase(), // Store email in lowercase for case-insensitive matching
      password: hashedPassword,
      userType: userType || "user",
      createdAt: new Date(),
    }

    console.log("Inserting new user:", { ...userData, password: "[REDACTED]" })
    const result = await db.collection("users").insertOne(userData)
    console.log("User inserted, ID:", result.insertedId.toString())

    const user = {
      id: result.insertedId.toString(),
      fullName,
      email: email.toLowerCase(),
      userType: userType || "user",
    }

    // Create JWT token
    console.log("Creating JWT token...")
    const token = jwt.sign({ id: user.id, email: user.email, userType: user.userType }, JWT_SECRET, { expiresIn: "7d" })

    // Set token in cookies
    console.log("Setting auth cookie...")
    cookies().set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    console.log("Registration successful")
    return NextResponse.json({ user })
  } catch (error: any) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 })
  }
}

