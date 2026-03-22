import { useState, useEffect } from "react"
import { Search, SlidersHorizontal, Locate } from "lucide-react"
import MapView from "../components/map/MapView"
import VendorPreviewSheet from "../components/map/VendorPreviewSheet"
import PlacePreviewSheet from "../components/map/PlacePreviewSheet"
import BottomNav from "../components/ui/BottomNav"
import { useLocation } from "../hooks/useLocation"
import { calculateDistance, CATEGORIES } from "../lib/utils"
import { supabase } from "../lib/supabase"

const MapPage = () => {
  const { location: userLocation } = useLocation()
  const [vendors, setVendors] = useState([])
  const [places, setPlaces] = useState([])
  const [selectedVendor, setSelectedVendor] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [centerOn, setCenterOn] = useState(null)
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)

  useEffect(() => {
    fetchVendors()
    fetchPlaces()
  }, [])

  const fetchVendors = async () => {
    const { data } = await supabase
      .from("vendors")
      .select("*")
      .eq("is_approved", true)
    if (data) setVendors(data)
  }

  const fetchPlaces = async () => {
    const { data } = await supabase.from("campus_locations").select("*")
    if (data) setPlaces(data)
  }

  const handleSearch = (val) => {
    setSearch(val)
    if (!val) { setShowSearchResults(false); return }
    const vResults = vendors.filter(v =>
      v.name.toLowerCase().includes(val.toLowerCase()) ||
      v.category.toLowerCase().includes(val.toLowerCase())
    ).map(v => ({ ...v, resultType: "vendor" }))
    const pResults = places.filter(p =>
      p.name.toLowerCase().includes(val.toLowerCase()) ||
      p.type.toLowerCase().includes(val.toLowerCase())
    ).map(p => ({ ...p, resultType: "place" }))
    setSearchResults([...vResults, ...pResults].slice(0, 6))
    setShowSearchResults(true)
  }

  const handleSelectResult = (result) => {
    setCenterOn({ lat: result.latitude, lng: result.longitude })
    setShowSearchResults(false)
    setSearch(result.name)
    if (result.resultType === "vendor") setSelectedVendor(result)
    else setSelectedPlace(result)
  }

  const filteredVendors = vendors.filter(v =>
    activeCategory === "all" || v.category === activeCategory
  )

  const getDistance = (vendor) => {
    if (!userLocation) return null
    return calculateDistance(userLocation.lat, userLocation.lng, vendor.latitude, vendor.longitude)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Search Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="bg-white rounded-2xl shadow-lg flex items-center px-4 gap-2">
          <Search size={18} className="text-gray-400" />
          <input
            className="flex-1 py-3 text-sm outline-none bg-transparent"
            placeholder="Search vendors, places..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <SlidersHorizontal size={18} className="text-gray-400" />
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && searchResults.length > 0 && (
          <div className="mt-2 bg-white rounded-2xl shadow-lg overflow-hidden">
            {searchResults.map((r) => (
              <button
                key={`${r.resultType}-${r.id}`}
                onClick={() => handleSelectResult(r)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0"
              >
                <span>{r.resultType === "vendor" ? "🛍️" : "🏫"}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.resultType === "vendor" ? r.category : r.type}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Category Filters */}
        <div className="flex gap-2 mt-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setActiveCategory("all")}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategory === "all" ? "bg-primary text-white" : "bg-white text-gray-600 shadow-sm"}`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all ${activeCategory === cat ? "bg-primary text-white" : "bg-white text-gray-600 shadow-sm"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Locate Me Button */}
      <button
        onClick={() => userLocation && setCenterOn({ ...userLocation })}
        className="absolute bottom-24 right-4 z-[1000] bg-white rounded-full p-3 shadow-lg"
      >
        <Locate size={20} className="text-primary" />
      </button>

      {/* Map */}
      <MapView
        vendors={filteredVendors}
        places={places}
        userLocation={userLocation}
        onVendorClick={(v) => { setSelectedVendor(v); setSelectedPlace(null) }}
        onPlaceClick={(p) => { setSelectedPlace(p); setSelectedVendor(null) }}
        centerOn={centerOn}
      />

      {/* Preview Sheets */}
      {selectedVendor && (
        <VendorPreviewSheet
          vendor={selectedVendor}
          distance={getDistance(selectedVendor)}
          onClose={() => setSelectedVendor(null)}
        />
      )}
      {selectedPlace && (
        <PlacePreviewSheet
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      <BottomNav />
    </div>
  )
}

export default MapPage