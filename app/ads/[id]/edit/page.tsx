"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { getAdById, updateAd } from "@/lib/ads"
import { categories } from "@/lib/categories"

export default function EditAd({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [ad, setAd] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    country: "",
    price: "",
    category: "",
    subcategory: "",
  })

  // Get subcategories based on selected category
  const subcategories = formData.category
    ? categories.find((c) => c.name === formData.category)?.subcategories || []
    : []

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const adData = await getAdById(params.id)

        if (!adData) {
          router.push("/404")
          return
        }

        // Check if user is the owner of the ad
        if (user && adData.userId !== user.id) {
          router.push("/unauthorized")
          return
        }

        setAd(adData)
        setFormData({
          title: adData.title,
          description: adData.description,
          city: adData.city,
          country: adData.country,
          price: adData.price.toString(),
          category: adData.category,
          subcategory: adData.subcategory,
        })
      } catch (err: any) {
        setError(err.message || "Failed to load ad")
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchAd()
    }
  }, [params.id, user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target

    // Reset subcategory when category changes
    if (name === "category") {
      setFormData((prev) => ({ ...prev, [name]: value, subcategory: "" }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user || !ad) return

    setSubmitting(true)
    setError("")

    try {
      const updatedAdData = {
        ...ad,
        ...formData,
        price: Number.parseFloat(formData.price),
        status: "pending", // Reset to pending for moderation
        updatedAt: new Date().toISOString(),
      }

      await updateAd(params.id, updatedAdData)
      router.push("/ads/my-ads")
    } catch (err: any) {
      setError(err.message || "Failed to update ad")
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="card text-center">
        <p>Please log in to edit this ad.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
  }

  if (!ad) {
    return <div className="text-center py-8">Ad not found</div>
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <h1 className="text-2xl font-bold mb-6">Edit Ad</h1>

      {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="form-label">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            className="form-input"
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            required
            className="form-input"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="form-label">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              required
              className="form-input"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="country" className="form-label">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              required
              className="form-input"
              value={formData.country}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            className="form-input"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="form-label">
              Category
            </label>
            <select
              id="category"
              name="category"
              required
              className="form-input"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="subcategory" className="form-label">
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              required
              className="form-input"
              value={formData.subcategory}
              onChange={handleChange}
              disabled={!formData.category}
            >
              <option value="">Select a subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? "Updating..." : "Update Ad"}
          </button>
        </div>
      </form>

      <div className="mt-4 text-sm text-gray-500">
        <p>Note: Your updated ad will need to be reviewed by a moderator before it appears publicly.</p>
      </div>
    </div>
  )
}

