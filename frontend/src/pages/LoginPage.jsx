import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { supabase } from "../lib/supabase"

const LoginPage = () => {
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState("phone")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [devOtp, setDevOtp] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSendOtp = async () => {
    if (phone.length < 10) return setError("Enter a valid phone number")
    setLoading(true)
    setError("")
    try {
      // Check if user exists, if not create them
      let { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", phone)
        .single()

      if (!user) {
        const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert({ phone_number: phone })
          .select()
          .single()
        if (insertError) throw insertError
        user = newUser
      }

      // Generate a mock OTP and store it
      const mockOtp = Math.floor(1000 + Math.random() * 9000).toString()
      setDevOtp(mockOtp)

      // Store OTP temporarily in Supabase
      await supabase
        .from("users")
        .update({ otp: mockOtp, otp_expires: new Date(Date.now() + 10 * 60 * 1000).toISOString() })
        .eq("phone_number", phone)

      setStep("otp")
      // Show OTP in UI for MVP testing
      alert(`DEV MODE - Your OTP is: ${mockOtp}`)
    } catch (err) {
      setError("Something went wrong. Try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length < 4) return setError("Enter the OTP")
    setLoading(true)
    setError("")
    try {
      if (otp !== devOtp) {
        setError("Invalid OTP. Try again.")
        setLoading(false)
        return
      }

      const { data: user } = await supabase
        .from("users")
        .select("*")
        .eq("phone_number", phone)
        .single()

      login({ id: user.id, phone: user.phone_number })
      navigate("/map")
    } catch {
      setError("Verification failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-6 py-12 bg-white">
      <div className="mb-10">
        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4">
          <span className="text-3xl">🛍️</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Welcome to iMarket</h1>
        <p className="text-gray-500 text-sm mt-1">Campus marketplace for OAU students</p>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {step === "phone" ? (
          <>
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 08012345678"
              error={error}
            />
            <Button onClick={handleSendOtp} disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">OTP sent to <strong>{phone}</strong></p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-700">
              📱 DEV MODE: Check the popup for your OTP
            </div>
            <Input
              label="Enter OTP"
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="e.g. 1234"
              error={error}
            />
            <Button onClick={handleVerifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>
            <button
              onClick={() => { setStep("phone"); setError("") }}
              className="text-sm text-primary text-center"
            >
              Change number
            </button>
          </>
        )}
      </div>

      <p className="text-xs text-gray-400 text-center mt-6">
        By continuing, you agree to our Terms of Service
      </p>
    </div>
  )
}

export default LoginPage