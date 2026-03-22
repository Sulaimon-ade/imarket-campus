import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import vendorRoutes from "./routes/vendors.js"
import messageRoutes from "./routes/messages.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.use("/auth", authRoutes)
app.use("/vendors", vendorRoutes)
app.use("/messages", messageRoutes)

app.get("/health", (req, res) => res.json({ status: "iMarket API running" }))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))