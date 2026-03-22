import express from "express"
import { supabase } from "../supabase.js"
import { requireAuth } from "../middleware/auth.js"

const router = express.Router()

// Get all approved vendors
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("is_approved", true)
  if (error) return res.status(500).json({ error })
  res.json(data)
})

// Get single vendor
router.get("/:id", async (req, res) => {
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", req.params.id)
    .single()
  if (error) return res.status(404).json({ error: "Vendor not found" })
  res.json(data)
})

// Register vendor
router.post("/", requireAuth, async (req, res) => {
  const { name, category, description, phone_number, location_description, latitude, longitude } = req.body
  const { data, error } = await supabase
    .from("vendors")
    .insert({
      name, category, description, phone_number,
      location_description, latitude, longitude,
      is_verified: false, is_approved: false,
      user_id: req.user.id,
    })
    .select()
    .single()
  if (error) return res.status(500).json({ error })
  res.json(data)
})

export default router