const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config({ path: "./.env" })
const passport = require("./services/passport.js")
const authRouter = require("./routes/auth.routes.js")
const userRouter = require("./routes/user.routes.js")
const wishRoutes = require("./routes/wish.routes.js")
const { protectedRoute } = require("./utils/protected.js")
const boothRouter = require("./routes/booth.routes.js")

const app = express()
app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: true,
    credentials: true
}))

app.use(passport.initialize())

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", protectedRoute, userRouter)
app.use("/api/v1/booth", protectedRoute, boothRouter)
app.use("/api/v1/visitor", require("./routes/visitor.routes.js"))
app.use("/api/v1/wish", wishRoutes)

app.use((req, res, next) => {
    res.status(404).json({ message: "Resource not found", });
})

app.use((err, req, res, next) => {
    res.status(500).json({ message: "Something went wrong", error: err.message });
})

mongoose.connect(process.env.MONGO_URL || "").catch((err) => {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
});

// Start the Server
const PORT = process.env.PORT || 5000
mongoose.connection.once("open", async () => {
    console.log("MongoDb Connected")
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`)
    });
});

