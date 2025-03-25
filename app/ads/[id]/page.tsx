import { notFound } from "next/navigation"
import Link from "next/link"
import { connectToDatabase } from "@/lib/db"
import { ObjectId } from "mongodb"
import AdStatusBadge from "@/components/ad-status-badge"

// Make the page dynamic to avoid prerendering at build time
export const dynamic = "force-dynamic"

async function getAdById(id: string) {
  try {
    const { db } = await connectToDatabase()
    const ad = await db.collection("ads").findOne({ _id: new ObjectId(id) })

    if (!ad) {
      return null
    }

    return {
      ...ad,
      _id: ad._id.toString(),
    }
  } catch (error) {
    console.error("Error fetching ad:", error)
    return null
  }
}

export default async function AdDetails({ params }: { params: { id: string } }) {
  const ad = await getAdById(params.id)

  if (!ad) {
    notFound()
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="mb-6">
          <Link href="/browse" className="text-indigo-600 hover:text-indigo-500">
            &larr; Back to listings
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900">{ad.title}</h1>
              {ad.status !== "approved" && <AdStatusBadge status={ad.status} rejectionReason={ad.rejectionReason} />}
            </div>
          </div>

          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-gray-100 h-64 rounded-md flex items-center justify-center mb-4">
                  <p className="text-gray-500">No image available</p>
                </div>

                <div className="mb-6">
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700 whitespace-pre-line">{ad.description}</p>
                </div>

                {/* Display moderator comment if available */}
                {ad.moderatorComment && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
                    <h2 className="text-sm font-medium text-blue-800 mb-1">Moderator Comment:</h2>
                    <p className="text-blue-700">{ad.moderatorComment}</p>
                  </div>
                )}

                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">Details</h2>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-gray-500">Category:</div>
                    <div className="text-gray-900">{ad.category}</div>

                    <div className="text-gray-500">Subcategory:</div>
                    <div className="text-gray-900">{ad.subcategory}</div>

                    <div className="text-gray-500">Location:</div>
                    <div className="text-gray-900">
                      {ad.city}, {ad.country}
                    </div>

                    <div className="text-gray-500">Posted on:</div>
                    <div className="text-gray-900">{new Date(ad.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-gray-900 mb-4">${ad.price.toFixed(2)}</div>

                  <div className="space-y-3">
                    <button className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Contact Seller
                    </button>

                    {/* This would be conditionally rendered based on user ownership */}
                    <Link
                      href={`/ads/${ad._id}/edit`}
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-center"
                    >
                      Edit Ad
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

