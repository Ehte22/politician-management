const express = require("express")
const { protectedRoute } = require("../utils/protected")
const authController = require("../controllers/auth.controller")

const authRouter = express.Router()

authRouter
    .post("/sign-in", authController.signIn)
    .post("/sign-out", protectedRoute, authController.signOut)
    .post("/send-otp", authController.sendOTP)
    .post("/verify-otp", authController.verifyOTP)
    .post("/forgot-password", authController.forgotPassword)
    .put("/reset-password", authController.resetPassword)

module.exports = authRouter