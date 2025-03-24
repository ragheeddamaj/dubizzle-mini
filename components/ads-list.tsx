import Link from "next/link"

interface Ad {
  _id: string
  title: string
  description: string
  price: number
  city: string
  country: string
  category: string
  subcategory: string
  createdAt: string
}

interface AdsListProps {
  ads: Ad[]
}

export default function AdsList({ ads }: AdsListProps) {
  if (ads.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No ads found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
      {ads.map((ad) => (
        <Link key={ad._id} href={`/ads/${ad._id}`} className="group">
          <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200">
            <div className="h-48 flex items-center justify-center text-gray-500">No image available</div>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900 line-clamp-2">{ad.title}</h3>
          <p className="mt-1 text-sm text-gray-500">
            {ad.city}, {ad.country} • {ad.category}
          </p>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{ad.description}</p>
          <div className="mt-2 flex justify-between items-center">
            <p className="text-lg font-medium text-gray-900">${ad.price.toFixed(2)}</p>
            <p className="text-xs text-gray-500">{new Date(ad.createdAt).toLocaleDateString()}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}

