import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { MessageCircle, Phone, MapPin, ArrowLeft, ExternalLink, CheckCircle } from "lucide-react"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import Badge from "../components/ui/Badge"
import { CATEGORY_COLORS } from "../lib/utils"
import { supabase } from "../lib/supabase"

const VendorProfilePage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [vendor, setVendor] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVendor()
  }, [id])

  const fetchVendor = async () => {
    const { data } = await supabase.from("vendors").select("*").eq("id", id).single()
    if (data) setVendor(data)
    setLoading(false)
  }

  const openDirections = () => {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${vendor.latitude},${vendor.longitude}`,
      "_blank"
    )
  }

  if (loading) return <LoadingSpinner />

  if (!vendor) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <p className="text-4xl">😕</p>
      <p className="text-gray-500 text-sm">Vendor not found</p>
      <button onClick={() => navigate(-1)} className="text-primary text-sm">Go back</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header Banner */}
      <div
        className="h-48 w-full relative flex items-end px-4 pb-4"
        style={{ backgroundColor: CATEGORY_COLORS[vendor.category] || "#6C63FF" }}
      >
        <button
          onClick={() => navigate(-1)}
          className="absolute top-12 left-4 bg-white bg-opacity-20 rounded-full p-2"
        >
          <ArrowLeft size={20} className="text-white" />
        </button>
        <div className="flex items-end gap-3">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg"
            style={{ color: CATEGORY_COLORS[vendor.category] }}>
            {vendor.name[0]}
          </div>
          <div className="mb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-white font-bold text-xl">{vendor.name}</h1>
              {vendor.is_verified && <CheckCircle size={16} className="text-white" />}
            </div>
            <Badge label={vendor.category} color="rgba(255,255,255,0.3)" />
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        {/* About */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">About</h2>
          <p className="text-sm text-gray-500">{vendor.description || "No description provided."}</p>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <h2 className="font-semibold text-gray-700 mb-2">Location</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={14} className="text-primary" />
            <span>{vendor.location_description || "On campus"}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate(`/chat/${vendor.id}`)}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-2xl py-3.5 font-semibold"
          >
            <MessageCircle size={18} /> Chat with Vendor
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => window.open(`tel:${vendor.phone_number}`)}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 rounded-2xl py-3 text-sm font-semibold text-gray-600"
            >
              <Phone size={16} /> Call
            </button>
            <button
              onClick={openDirections}
              className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 rounded-2xl py-3 text-sm font-semibold text-gray-600"
            >
              <ExternalLink size={16} /> Directions
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VendorProfilePage