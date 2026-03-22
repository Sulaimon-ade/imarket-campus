import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

const SplashScreen = () => {
  const navigate = useNavigate()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (loading) return
    const timer = setTimeout(() => {
      navigate(user ? "/map" : "/login")
    }, 2000)
    return () => clearTimeout(timer)
  }, [user, loading, navigate])

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-primary gap-4">
      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-xl">
        <span className="text-4xl">🛍️</span>
      </div>
      <h1 className="text-3xl font-bold text-white">iMarket</h1>
      <p className="text-white text-opacity-80 text-sm">Campus Marketplace · OAU</p>
      <div className="mt-8 w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default SplashScreen