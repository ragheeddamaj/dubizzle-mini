"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { getPendingAds, moderateAd } from "@/lib/ads"

export default function Moderation() {
  const router = useRouter()
  const { user } = useAuth()
  const [ads, setAds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [rejectionReason, setRejectionReason] = useState("")
  const [moderatingAdId, setModeratingAdId] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [showCommentField, setShowCommentField] = useState<string | null>(null)

  useEffect(() => {
    const fetchAds = async () => {
      if (!user || user.userType !== "moderator") return

      try {
        const pendingAds = await getPendingAds()
        setAds(pendingAds)
      } catch (err: any) {
        setError(err.message || "Failed to load ads")
      } finally {
        setLoading(false)
      }
    }

    fetchAds()
  }, [user])

  const handleApprove = async (adId: string) => {
    try {
      await moderateAd(adId, "approved", undefined, comment || undefined)
      setAds(ads.filter((ad: any) => ad._id !== adId))
      setComment("")
      setShowCommentField(null)
    } catch (err: any) {
      setError(err.message || "Failed to approve ad")
    }
  }

  const handleReject = async (adId: string) => {
    if (!rejectionReason) {
      setError("Please provide a reason for rejection")
      return
    }

    try {
      await moderateAd(adId, "rejected", rejectionReason, comment || undefined)
      setAds(ads.filter((ad: any) => ad._id !== adId))
      setRejectionReason("")
      setComment("")
      setModeratingAdId(null)
      setShowCommentField(null)
    } catch (err: any) {
      setError(err.message || "Failed to reject ad")
    }
  }

  const toggleCommentField = (adId: string) => {
    setShowCommentField(showCommentField === adId ? null : adId)
  }

  if (!user) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p>Please log in to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  if (user.userType !== "moderator") {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p>You don't have permission to access this page.</p>
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
            <p className="mt-4 text-gray-500">Loading ads for moderation...</p>
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
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">Ad Moderation</h1>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {ads.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <p>No ads pending moderation.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ads.map((ad: any) => (
              <div key={ad._id} className="bg-white shadow rounded-lg overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold">{ad.title}</h2>
                  <p className="text-gray-600 mb-2">
                    {ad.city}, {ad.country} • {ad.category} &gt; {ad.subcategory}
                  </p>
                  <p className="font-bold text-lg mb-2">${ad.price.toFixed(2)}</p>

                  <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <h3 className="font-medium mb-1">Description:</h3>
                    <p className="whitespace-pre-line">{ad.description}</p>
                  </div>

                  {/* Comment toggle button */}
                  <button
                    onClick={() => toggleCommentField(ad._id)}
                    className="mb-4 text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    {showCommentField === ad._id ? "Hide Comment Field" : "Add Moderator Comment"}
                  </button>

                  {/* Comment field */}
                  {showCommentField === ad._id && (
                    <div className="mb-4">
                      <label htmlFor={`comment-${ad._id}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Moderator Comment (optional):
                      </label>
                      <textarea
                        id={`comment-${ad._id}`}
                        rows={2}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        placeholder="Add a comment about this ad (visible to the seller)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleApprove(ad._id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>

                    {moderatingAdId === ad._id ? (
                      <div className="flex-1 flex space-x-2">
                        <input
                          type="text"
                          placeholder="Reason for rejection"
                          className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                        />
                        <button
                          onClick={() => handleReject(ad._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => {
                            setModeratingAdId(null)
                            setRejectionReason("")
                          }}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setModeratingAdId(ad._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    )}
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

