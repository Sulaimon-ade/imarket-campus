import { MapPin, X, ExternalLink } from "lucide-react"

const PlacePreviewSheet = ({ place, onClose }) => {
  if (!place) return null

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`,
      "_blank"
    )
  }

  return (
    <div className="absolute bottom-20 left-0 right-0 mx-4 bg-white rounded-2xl shadow-xl p-4 z-[1000]">
      <button onClick={onClose} className="absolute top-3 right-3 text-gray-400">
        <X size={18} />
      </button>

      <div className="flex gap-3 items-start">
        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-2xl shrink-0">
          🏫
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{place.name}</h3>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium capitalize">
            {place.type}
          </span>
          {place.description && (
            <p className="text-xs text-gray-500 mt-1">{place.description}</p>
          )}
        </div>
      </div>

      <button
        onClick={openDirections}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-green-500 text-white rounded-xl py-2.5 text-sm font-semibold"
      >
        <ExternalLink size={16} /> Get Directions
      </button>
    </div>
  )
}

export default PlacePreviewSheet