import { useNavigate } from "react-router-dom"
import { MessageCircle, MapPin } from "lucide-react"
import Badge from "./Badge"
import { CATEGORY_COLORS } from "../../lib/utils"

const VendorCard = ({ vendor, distance }) => {
  const navigate = useNavigate()

  return (
    <div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-3 items-start active:scale-[0.98] transition-all cursor-pointer"
      onClick={() => navigate(`/vendor/${vendor.id}`)}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0"
        style={{ backgroundColor: CATEGORY_COLORS[vendor.category] || "#6C63FF" }}
      >
        {vendor.name[0]}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-800 text-sm truncate">{vendor.name}</h3>
          {vendor.is_verified && (
            <span className="text-blue-500 text-xs">✓</span>
          )}
        </div>
        <Badge label={vendor.category} color={CATEGORY_COLORS[vendor.category]} />
        {distance && (
          <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
            <MapPin size={11} />
            <span>{distance} away</span>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1 truncate">{vendor.description}</p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          navigate(`/chat/${vendor.id}`)
        }}
        className="shrink-0 bg-primary bg-opacity-10 text-primary rounded-xl p-2"
      >
        <MessageCircle size={18} />
      </button>
    </div>
  )
}

export default VendorCard