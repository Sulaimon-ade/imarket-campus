import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { MessageCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import BottomNav from "../components/ui/BottomNav"
import LoadingSpinner from "../components/ui/LoadingSpinner"
import { supabase } from "../lib/supabase"

const ChatsListPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchChats = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("*, vendor:receiver_id(*)")
      .eq("sender_id", user?.id)
      .order("created_at", { ascending: false })

    if (data) {
      const unique = []
      const seen = new Set()
      data.forEach((msg) => {
        if (!seen.has(msg.receiver_id)) {
          seen.add(msg.receiver_id)
          unique.push(msg)
        }
      })
      setChats(unique)
    }
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    fetchChats()
  }, [fetchChats])

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white px-4 pt-12 pb-4 shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">Chats</h1>
      </div>

      <div className="px-4 mt-4">
        {loading ? <LoadingSpinner /> : chats.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No chats yet</p>
            <button onClick={() => navigate("/explore")} className="text-primary text-sm mt-2">
              Find a vendor to chat with
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.receiver_id}`)}
                className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-sm w-full text-left"
              >
                <div className="w-11 h-11 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                  {chat.vendor?.name?.[0] || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800">{chat.vendor?.name || "Vendor"}</p>
                  <p className="text-xs text-gray-400 truncate">{chat.message}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

export default ChatsListPage