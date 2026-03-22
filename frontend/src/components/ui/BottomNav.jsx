import { useNavigate, useLocation } from "react-router-dom"
import { Map, Search, MessageCircle, User, PlusCircle } from "lucide-react"

const tabs = [
  { icon: Map, label: "Map", path: "/map" },
  { icon: Search, label: "Explore", path: "/explore" },
  { icon: PlusCircle, label: "Sell", path: "/register-vendor" },
  { icon: MessageCircle, label: "Chats", path: "/chats" },
  { icon: User, label: "Profile", path: "/profile" },
]

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 flex justify-around items-center py-2 z-[2000]">
      {tabs.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${active ? "text-primary" : "text-gray-400"}`}
          >
            <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav