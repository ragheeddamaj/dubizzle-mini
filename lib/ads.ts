// Client-side functions to interact with the API

export async function getApprovedAds() {
  const response = await fetch("/api/ads")
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch ads")
  }

  return data.ads
}

export async function getAdById(id: string) {
  try {
    const response = await fetch(`/api/ads/${id}`)
    const data = await response.json()

    if (!response.ok) {
      return null
    }

    return data.ad
  } catch (error) {
    console.error("Error fetching ad:", error)
    return null
  }
}

export async function getUserAds(userId: string) {
  const response = await fetch(`/api/ads/user/${userId}`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch user ads")
  }

  return data.ads
}

export async function getPendingAds() {
  const response = await fetch("/api/ads/pending")
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch pending ads")
  }

  return data.ads
}

export async function createAd(adData: any) {
  const response = await fetch("/api/ads", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to create ad")
  }

  return data.ad
}

export async function updateAd(id: string, adData: any) {
  const response = await fetch(`/api/ads/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adData),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to update ad")
  }

  return data.ad
}

export async function moderateAd(
  id: string,
  status: "approved" | "rejected",
  rejectionReason?: string,
  comment?: string,
) {
  const response = await fetch(`/api/ads/moderate/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, rejectionReason, comment }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to moderate ad")
  }

  return data
}

