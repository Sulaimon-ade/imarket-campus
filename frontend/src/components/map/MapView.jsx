import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import { useEffect } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { CATEGORY_COLORS } from "../../lib/utils"

// Fix leaflet default icon bug in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

const createVendorIcon = (category) => {
  const color = CATEGORY_COLORS[category] || "#6C63FF"
  return L.divIcon({
    html: `<div style="background:${color};width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    className: "",
  })
}

const createPlaceIcon = () => L.divIcon({
  html: `<div style="background:#10B981;width:28px;height:28px;border-radius:6px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px">🏫</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  className: "",
})

const createUserIcon = () => L.divIcon({
  html: `<div style="background:#3B82F6;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  className: "",
})

const RecenterMap = ({ location }) => {
  const map = useMap()
  useEffect(() => {
    if (location) map.setView([location.lat, location.lng], 16)
  }, [location, map])
  return null
}

const MapView = ({ vendors = [], places = [], userLocation, onVendorClick, onPlaceClick, centerOn }) => {
  const defaultCenter = [7.5227, 4.5198] // OAU campus center

  return (
    <MapContainer
      center={defaultCenter}
      zoom={16}
      className="w-full h-full"
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {centerOn && <RecenterMap location={centerOn} />}

      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={createUserIcon()}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}

      {vendors.map((vendor) => (
        <Marker
          key={vendor.id}
          position={[vendor.latitude, vendor.longitude]}
          icon={createVendorIcon(vendor.category)}
          eventHandlers={{ click: () => onVendorClick && onVendorClick(vendor) }}
        >
          <Popup>
            <div className="text-sm font-semibold">{vendor.name}</div>
            <div className="text-xs text-gray-500">{vendor.category}</div>
          </Popup>
        </Marker>
      ))}

      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.latitude, place.longitude]}
          icon={createPlaceIcon()}
          eventHandlers={{ click: () => onPlaceClick && onPlaceClick(place) }}
        >
          <Popup>
            <div className="text-sm font-semibold">{place.name}</div>
            <div className="text-xs text-gray-500">{place.type}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default MapView