const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    boothId: { type: mongoose.Schema.ObjectId, required: true },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: Number, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    profile: { type: String, trim: true },
    role: {
        type: String,
        enum: ['Super Admin', 'Office Admin', 'Booth Manager', 'Booth Worker'],
        default: "Receptionist",
        required: true
    },
    status: { type: String, default: "active", enum: ['active', 'inactive'] },
    sessionToken: { type: String, default: null },
}, { timestamps: true });

const OTPSchema = new mongoose.Schema({
    username: { type: String },
    otp: { type: String, required: true },
    expiry: { type: Date, required: true }
}, { timestamps: true })

const User = mongoose.model("User", userSchema);
const OTP = mongoose.model("Otp", OTPSchema)

module.exports = { User, OTP }

