"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { getUserAds } from "@/lib/ads"
import AdStatusBadge from "@/components/ad-status-badge"

export default function MyAds() {
  const { user } = useAuth()
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchAds = async () => {
      if (!user) return

      try {
        const userAds = await getUserAds(user.id)
        setAds(userAds)
      } catch (err: any) {
        setError(err.message || "Failed to load ads")
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [user])

  if (!user) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p>Please log in to view your ads.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-500">Loading your ads...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">My Ads</h1>
          <Link
            href="/ads/create"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Create New Ad
          </Link>
        </div>

        {ads.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p className="mb-4">You haven't created any ads yet.</p>
            <Link
              href="/ads/create"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Create Your First Ad
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {ads.map((ad: any) => (
              <div key={ad._id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{ad.title}</h2>
                      <p className="text-gray-600 mb-2">
                        {ad.city}, {ad.country} • {ad.category} &gt; {ad.subcategory}
                      </p>
                      <p className="font-bold text-lg">${ad.price.toFixed(2)}</p>
                    </div>
                    <AdStatusBadge status={ad.status} rejectionReason={ad.rejectionReason} />
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <Link
                      href={`/ads/${ad._id}/edit`}
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/ads/${ad._id}`}
                      className="px-3 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

