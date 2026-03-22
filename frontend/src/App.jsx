import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import SplashScreen from "./pages/SplashScreen"
import LoginPage from "./pages/LoginPage"
import MapPage from "./pages/MapPage"
import ExplorePage from "./pages/ExplorePage"
import VendorProfilePage from "./pages/VendorProfilePage"
import ChatPage from "./pages/ChatPage"
import ChatsListPage from "./pages/ChatsListPage"
import RegisterVendorPage from "./pages/RegisterVendorPage"
import ProfilePage from "./pages/ProfilePage"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? children : <Navigate to="/login" />
}

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<SplashScreen />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
    <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
    <Route path="/vendor/:id" element={<ProtectedRoute><VendorProfilePage /></ProtectedRoute>} />
    <Route path="/chat/:vendorId" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
    <Route path="/chats" element={<ProtectedRoute><ChatsListPage /></ProtectedRoute>} />
    <Route path="/register-vendor" element={<ProtectedRoute><RegisterVendorPage /></ProtectedRoute>} />
    <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
)

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
)

export default App