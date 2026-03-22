import express from "express"
import { supabase } from "../supabase.js"
import { requireAuth } from "../middleware/auth.js"

const router = express.Router()

// Get messages between two users
router.get("/:vendorId", requireAuth, async (req, res) => {
  const userId = req.user.id
  const { vendorId } = req.params
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .or(`and(sender_id.eq.${userId},receiver_id.eq.${vendorId}),and(sender_id.eq.${vendorId},receiver_id.eq.${userId})`)
    .order("created_at", { ascending: true })
  if (error) return res.status(500).json({ error })
  res.json(data)
})

// Send message
router.post("/", requireAuth, async (req, res) => {
  const { receiver_id, message } = req.body
  const { data, error } = await supabase
    .from("messages")
    .insert({ sender_id: req.user.id, receiver_id, message })
    .select()
    .single()
  if (error) return res.status(500).json({ error })
  res.json(data)
})

export default router