import { useNavigate } from "react-router-dom"
import { LogOut, Store, MessageCircle, ChevronRight } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import BottomNav from "../components/ui/BottomNav"
import Button from "../components/ui/Button"

const ProfilePage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  const menuItems = [
    { icon: Store, label: "My Vendor Profile", path: "/register-vendor" },
    { icon: MessageCircle, label: "My Chats", path: "/chats" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-primary px-4 pt-12 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-primary font-bold text-2xl">
            {user?.phone?.slice(-2) || "U"}
          </div>
          <div>
            <h2 className="text-white font-bold text-lg">{user?.phone || "Student"}</h2>
            <p className="text-white text-opacity-70 text-sm">OAU Student</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-3">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {menuItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="w-full flex items-center gap-4 px-4 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50"
            >
              <div className="w-9 h-9 bg-primary bg-opacity-10 rounded-xl flex items-center justify-center">
                <Icon size={18} className="text-primary" />
              </div>
              <span className="flex-1 text-left text-sm font-medium text-gray-700">{label}</span>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>

        <div className="mt-4">
          <Button variant="danger" onClick={handleLogout}>
            <span className="flex items-center justify-center gap-2">
              <LogOut size={16} /> Logout
            </span>
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}

export default ProfilePage