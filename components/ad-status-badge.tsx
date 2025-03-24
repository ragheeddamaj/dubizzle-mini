interface AdStatusBadgeProps {
  status: string
  rejectionReason?: string
}

export default function AdStatusBadge({ status, rejectionReason }: AdStatusBadgeProps) {
  let badgeClass = ""
  let statusText = ""

  switch (status) {
    case "approved":
      badgeClass = "bg-green-100 text-green-800"
      statusText = "Approved"
      break
    case "pending":
      badgeClass = "bg-yellow-100 text-yellow-800"
      statusText = "Pending Approval"
      break
    case "rejected":
      badgeClass = "bg-red-100 text-red-800"
      statusText = "Rejected"
      break
    default:
      badgeClass = "bg-gray-100 text-gray-800"
      statusText = status
  }

  return (
    <div>
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClass}`}>
        {statusText}
      </span>

      {status === "rejected" && rejectionReason && (
        <div className="mt-1 text-xs text-red-600">Reason: {rejectionReason}</div>
      )}
    </div>
  )
}

