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
      <div className="card text-center">
        <p>Please log in to view your ads.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Loading your ads...</div>
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
  }

  if (ads.length === 0) {
    return (
      <div className="card text-center">
        <p className="mb-4">You haven't created any ads yet.</p>
        <Link href="/ads/create" className="btn-primary inline-block">
          Create Your First Ad
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Ads</h1>
        <Link href="/ads/create" className="btn-primary">
          Create New Ad
        </Link>
      </div>

      <div className="space-y-4">
        {ads.map((ad: any) => (
          <div key={ad._id} className="card">
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
              <Link href={`/ads/${ad._id}/edit`} className="btn-secondary text-sm">
                Edit
              </Link>
              <Link href={`/ads/${ad._id}`} className="btn-secondary text-sm">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

