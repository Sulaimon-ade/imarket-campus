import { useState, useEffect, useRef, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Send } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { supabase } from "../lib/supabase"

const ChatPage = () => {
  const { vendorId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [vendor, setVendor] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const bottomRef = useRef(null)

  const fetchVendor = useCallback(async () => {
    const { data } = await supabase.from("vendors").select("*").eq("id", vendorId).single()
    if (data) setVendor(data)
  }, [vendorId])

  const fetchMessages = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${vendorId}),and(sender_id.eq.${vendorId},receiver_id.eq.${user?.id})`)
      .order("created_at", { ascending: true })
    if (data) setMessages(data)
  }, [vendorId, user?.id])

  useEffect(() => {
    fetchVendor()
    fetchMessages()
  }, [fetchVendor, fetchMessages])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return
    const newMsg = {
      sender_id: user?.id,
      receiver_id: vendorId,
      message: input.trim(),
    }
    const { data } = await supabase.from("messages").insert(newMsg).select().single()
    if (data) setMessages((prev) => [...prev, data])
    setInput("")
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white px-4 pt-12 pb-4 flex items-center gap-3 shadow-sm">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        {vendor && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
              {vendor.name[0]}
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{vendor.name}</p>
              <p className="text-xs text-gray-400 capitalize">{vendor.category}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 text-sm mt-10">
            <p className="text-3xl mb-2">👋</p>
            <p>Say hello to {vendor?.name}!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === user?.id
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                isMe ? "bg-primary text-white rounded-br-sm" : "bg-white text-gray-800 shadow-sm rounded-bl-sm"
              }`}>
                {msg.message}
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="bg-white px-4 py-3 flex items-center gap-3 border-t border-gray-100">
        <input
          className="flex-1 bg-gray-100 rounded-xl px-4 py-2.5 text-sm outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="bg-primary text-white rounded-xl p-2.5 disabled:opacity-40"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChatPage