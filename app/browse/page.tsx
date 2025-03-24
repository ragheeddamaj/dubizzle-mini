"use client"

import { useEffect, useState } from "react"
import AdsList from "@/components/ads-list"

export default function BrowsePage() {
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchAds() {
      try {
        const response = await fetch("/api/ads")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch ads")
        }

        setAds(data.ads || [])
      } catch (err: any) {
        console.error("Error fetching ads:", err)
        setError(err.message || "Failed to load ads")
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [])

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Browse All Listings</h2>

        {loading ? (
          <div className="mt-6 text-center py-10">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-500">Loading listings...</p>
          </div>
        ) : error ? (
          <div className="mt-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6">
            <AdsList ads={ads} />
          </div>
        )}
      </div>
    </div>
  )
}

