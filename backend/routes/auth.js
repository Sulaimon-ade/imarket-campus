import express from "express"
import jwt from "jsonwebtoken"
import { supabase } from "../supabase.js"

const router = express.Router()

// Store OTPs temporarily (use Redis in production)
const otpStore = new Map()

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString()

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body
  if (!phone) return res.status(400).json({ error: "Phone number required" })

  const otp = generateOTP()
  otpStore.set(phone, { otp, expires: Date.now() + 10 * 60 * 1000 })

  // In production: send via SMS (Termii, Twilio, etc.)
  // For MVP: log to console
  console.log(`OTP for ${phone}: ${otp}`)

  res.json({ message: "OTP sent", ...(process.env.NODE_ENV !== "production" && { otp }) })
})

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body
  const stored = otpStore.get(phone)

  if (!stored) return res.status(400).json({ error: "OTP not found. Request a new one." })
  if (Date.now() > stored.expires) return res.status(400).json({ error: "OTP expired" })
  if (stored.otp !== otp) return res.status(400).json({ error: "Invalid OTP" })

  otpStore.delete(phone)

  // Get or create user in Supabase
  let { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("phone_number", phone)
    .single()

  if (!user) {
    const { data: newUser } = await supabase
      .from("users")
      .insert({ phone_number: phone })
      .select()
      .single()
    user = newUser
  }

  const token = jwt.sign({ id: user.id, phone }, process.env.JWT_SECRET, { expiresIn: "30d" })

  res.json({ user: { id: user.id, phone }, token })
})

export default router