const asyncHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const { User, OTP } = require("../models/User")
const { sendEmail } = require("../utils/email")
const { generateResetToken, generateToken } = require("../utils/generateToken")
const { otpVerificationTemplate } = require("../templates/otpVerificationTemplate")
const { resetPasswordTemplate } = require("../templates/resetPasswordTemplate")
const { customValidator } = require("../utils/validator")
const { signInRules, forgotPasswordRules, resetPasswordRules, sendOTPRules, verifyOTPRules } = require("../rules/auth.rules")

// Sign In
exports.signIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const { isError, error } = customValidator(req.body, signInRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error })
    }

    const user = await User.findOne({ email }).select("-password, -__v, -updatedAt, -createdAt").lean()

    if (!user) {
        return res.status(401).json({ message: "Invalid Credential - Email not found" })
    }


    const verifyPassword = await bcryptjs.compare(password, user.password)
    if (!verifyPassword) {
        return res.status(401).json({ message: "Invalid Credential - Password do not match" })
    }

    if (user.status === "inactive") {
        return res.status(403).json({ message: "Your account has been deactivated. Contact support." });
    }

    const token = generateToken({ userId: user._id, role: user.role })

    await User.findByIdAndUpdate(user._id, { sessionToken: token })

    const result = {
        _id: user._id,
        clinicId: user.clinicId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profile: user.profile,
        role: user.role, token
    }
    res.status(200).json({ message: "Logged in successfully", result })
})

// Sign Out
exports.signOut = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    const { userId } = req.user

    await User.findByIdAndUpdate(userId, { sessionToken: null })

    res.status(200).json({ message: "Logged out successfully" });
});

// Send OTP
exports.sendOTP = asyncHandler(async (req, res, next) => {

    const { username } = req.body
    const { isError, error } = customValidator(req.body, sendOTPRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);

    await OTP.create({ username, otp, expiry: otpExpiry })

    const otpVerificationTemp = otpVerificationTemplate(otp)

    await sendEmail({
        to: username,
        subject: 'Your OTP Code',
        text: otpVerificationTemp,
    });

    res.status(200).json({ message: "OTP sent successfully" })
})

// Verify OTP
exports.verifyOTP = asyncHandler(async (req, res, next) => {
    const { username, otp } = req.body

    const { isError, error } = customValidator(req.body, verifyOTPRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const result = await OTP.findOne({ username, otp })

    if (!result) {
        return res.status(400).json({ message: "Invalid OTP or expired" })
    }

    if (result) {
        if (new Date() > result?.expiry) {
            return res.status(400).json({ message: "OTP expired" })
        }

        if (result?.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" })
        }
    }

    await OTP.deleteOne({ username, otp });
    res.status(200).json({ message: "OTP verified successfully" })

})


exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body

    const { isError, error } = customValidator(req.body, forgotPasswordRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error })
    }

    const user = await User.findOne({ email }).lean()

    if (!user) {
        return res.status(404).json({ message: "User not found with given email" })
    }

    const resetToken = await generateResetToken({ email })
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const resetPasswordTemp = resetPasswordTemplate(resetLink)

    await sendEmail({
        to: email,
        subject: "Password Reset",
        text: resetPasswordTemp
    });

    res.status(200).json({ message: "Password reset email sent successfully" });
})

// Reset Password
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const { password, confirmPassword, token } = req.body

    const { isError, error } = customValidator(req.body, resetPasswordRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error })
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Password do not match" })
    }

    const secretKey = process.env.JWT_KEY

    let decodedToken = null

    try {
        if (secretKey) {
            decodedToken = jwt.verify(token, secretKey);
        }
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    if (!decodedToken) {
        return res.status(401).json({ message: "Invalid or expired reset token" });
    }

    const email = decodedToken.email
    if (!email) {
        return res.status(422).json({ message: "Email not verified" })
    }

    const user = await User.findOne({ email }).lean()

    const hashPass = await bcryptjs.hash(password, 10)

    await User.findByIdAndUpdate(user?._id, { password: hashPass })

    res.status(200).json({ message: "Password reset success" })
})

