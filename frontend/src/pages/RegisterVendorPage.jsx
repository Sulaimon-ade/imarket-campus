import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import Input from "../components/ui/Input"
import Button from "../components/ui/Button"
import { CATEGORIES } from "../lib/utils"
import { supabase } from "../lib/supabase"

const RegisterVendorPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", category: "", description: "",
    phone_number: "", location_description: "",
    latitude: 7.5227, longitude: 4.5198,
  })
  const [errors, setErrors] = useState({})

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }))

  const validate = () => {
    const e = {}
    if (!form.name) e.name = "Business name is required"
    if (!form.category) e.category = "Select a category"
    if (!form.phone_number) e.phone_number = "Phone number is required"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    try {
      await supabase.from("vendors").insert({
        ...form,
        is_verified: false,
        is_approved: false,
        user_id: user?.id,
      })
      setSubmitted(true)
    } catch {
      setErrors({ submit: "Something went wrong. Try again." })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 gap-4 text-center">
      <CheckCircle size={64} className="text-green-500" />
      <h2 className="text-xl font-bold text-gray-800">Application Submitted!</h2>
      <p className="text-gray-500 text-sm">Your vendor profile is under review. We'll notify you once approved.</p>
      <Button onClick={() => navigate("/map")}>Back to Map</Button>
    </div>
  )

  return (
    <div className="min-h-screen bg-white pb-10">
      <div className="px-4 pt-12 pb-4 flex items-center gap-3 border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Register as Vendor</h1>
      </div>

      <div className="px-4 mt-4 flex flex-col gap-4">
        <Input
          label="Business Name"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          placeholder="e.g. Mama Tee's Kitchen"
          error={errors.name}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => update("category", cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize border-2 transition-all ${
                  form.category === cat
                    ? "border-primary bg-primary text-white"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          {errors.category && <span className="text-xs text-red-500">{errors.category}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="Describe your business..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <Input
          label="Phone Number"
          type="tel"
          value={form.phone_number}
          onChange={(e) => update("phone_number", e.target.value)}
          placeholder="e.g. 08012345678"
          error={errors.phone_number}
        />

        <Input
          label="Location Description"
          value={form.location_description}
          onChange={(e) => update("location_description", e.target.value)}
          placeholder="e.g. Near Angola Hostel, beside the SUB"
        />

        <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-600">
          📍 Your location will default to OAU campus center. Our team will update your exact coordinates after verification.
        </div>

        {errors.submit && <p className="text-xs text-red-500 text-center">{errors.submit}</p>}

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Submitting..." : "Submit for Review"}
        </Button>
      </div>
    </div>
  )
}

export default RegisterVendorPage