import { useNavigate } from "react-router-dom"
import { MessageCircle, Phone, MapPin, X } from "lucide-react"
import Badge from "../ui/Badge"
import { CATEGORY_COLORS } from "../../lib/utils"

const VendorPreviewSheet = ({ vendor, distance, onClose }) => {
  const navigate = useNavigate()
  if (!vendor) return null

  return (
    <div className="absolute bottom-20 left-0 right-0 mx-4 bg-white rounded-2xl shadow-xl p-4 z-[1000] animate-slide-up">
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-400">
        <X size={18} />
      </button>

      <div className="flex gap-3 items-start">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shrink-0"
          style={{ backgroundColor: CATEGORY_COLORS[vendor.category] || "#6C63FF" }}
        >
          {vendor.name[0]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">{vendor.name}</h3>
            {vendor.is_verified && <span className="text-blue-500 text-xs">✓ Verified</span>}
          </div>
          <Badge label={vendor.category} color={CATEGORY_COLORS[vendor.category]} />
          {distance && (
            <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
              <MapPin size={11} /> {distance} away
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">{vendor.description}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => navigate(`/chat/${vendor.id}`)}
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white rounded-xl py-2.5 text-sm font-semibold"
        >
          <MessageCircle size={16} /> Chat
        </button>
        <button
          onClick={() => window.open(`tel:${vendor.phone_number}`)}
          className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600"
        >
          <Phone size={16} />
        </button>
        <button
          onClick={() => navigate(`/vendor/${vendor.id}`)}
          className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600"
        >
          View
        </button>
      </div>
    </div>
  )
}

export default VendorPreviewSheet