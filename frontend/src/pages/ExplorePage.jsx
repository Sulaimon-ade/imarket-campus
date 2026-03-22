import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import VendorCard from "../components/ui/VendorCard"
import BottomNav from "../components/ui/BottomNav"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { useLocation } from "../hooks/useLocation"
import { calculateDistance, CATEGORIES } from "../lib/utils"
import { supabase } from "../lib/supabase"

const ExplorePage = () => {
  const [vendors, setVendors] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const { location: userLocation } = useLocation()

  useEffect(() => {
    fetchVendors()
  }, [])

  useEffect(() => {
    let result = vendors
    if (activeCategory !== "all") result = result.filter(v => v.category === activeCategory)
    if (search) result = result.filter(v =>
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.description?.toLowerCase().includes(search.toLowerCase())
    )
    setFiltered(result)
  }, [vendors, activeCategory, search])

  const fetchVendors = async () => {
    const { data } = await supabase.from("vendors").select("*").eq("is_approved", true)
    if (data) { setVendors(data); setFiltered(data) }
    setLoading(false)
  }

  const getDistance = (vendor) => {
    if (!userLocation) return null
    return calculateDistance(userLocation.lat, userLocation.lng, vendor.latitude, vendor.longitude)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm sticky top-0 z-10">
        <h1 className="text-xl font-bold text-gray-800 mb-3">Explore</h1>
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3">
          <Search size={16} className="text-gray-400" />
          <input
            className="flex-1 py-2.5 text-sm outline-none bg-transparent"
            placeholder="Search vendors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold ${activeCategory === "all" ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${activeCategory === cat ? "bg-primary text-white" : "bg-gray-100 text-gray-600"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-3">
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-2">🔍</p>
            <p className="text-sm">No vendors found</p>
          </div>
        ) : (
          filtered.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} distance={getDistance(vendor)} />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default ExplorePage