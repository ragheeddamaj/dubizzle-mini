import { MongoClient, type Db } from "mongodb"

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/classifind"
const MONGODB_DB = process.env.MONGODB_DB || "classifind"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

// Check if we're in a build/static generation context
const isBuildTime =
  process.env.NODE_ENV === "production" && process.env.VERCEL_ENV === "production" && typeof window === "undefined"

export async function connectToDatabase() {
  console.log("connectToDatabase called, build time?", isBuildTime)
  console.log("MONGODB_URI:", MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):[^@]+@/, "mongodb+srv://$1:****@"))
  console.log("MONGODB_DB:", MONGODB_DB)

  // If we're in a build context, return a mock DB
  if (isBuildTime) {
    console.warn("Build-time DB access detected, using mock database")
    return getMockDb()
  }

  // If we have cached values, use them
  if (cachedClient && cachedDb) {
    console.log("Using cached database connection")
    return { client: cachedClient, db: cachedDb }
  }

  try {
    console.log("Connecting to MongoDB...")
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI)
    console.log("Connected to MongoDB successfully")

    const db = client.db(MONGODB_DB)
    console.log("Database selected:", MONGODB_DB)

    // Cache the client and db connections
    cachedClient = client
    cachedDb = db

    return { client, db }
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error)

    // For development or if connection fails, provide a mock DB
    return getMockDb()
  }
}

function getMockDb() {
  console.log("Using mock database")
  return {
    client: null,
    db: {
      collection: (name: string) => {
        console.log(`Mock collection accessed: ${name}`)
        return {
          find: (query: any) => {
            console.log(`Mock find called with query:`, query)
            return {
              sort: () => ({
                toArray: async () => {
                  console.log("Mock toArray called, returning empty array")
                  return []
                },
              }),
            }
          },
          findOne: async (query: any) => {
            console.log(`Mock findOne called with query:`, query)
            return null
          },
          insertOne: async (doc: any) => {
            console.log(`Mock insertOne called with document:`, {
              ...doc,
              password: doc.password ? "[REDACTED]" : undefined,
            })
            return { insertedId: "mock-id-" + Date.now() }
          },
          updateOne: async (query: any, update: any) => {
            console.log(`Mock updateOne called with query:`, query)
            console.log(`Mock updateOne called with update:`, update)
            return {}
          },
          deleteOne: async (query: any) => {
            console.log(`Mock deleteOne called with query:`, query)
            return {}
          },
        }
      },
    },
  }
}

