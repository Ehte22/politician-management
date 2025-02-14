
const mongoose = require("mongoose")

const WishSchema = new mongoose.Schema({
    name: { type: String, required: true },
    date: { type: Date, },
    contact: { type: String, required: true },
    email: { type: String, required: true },
    type: {
        type: String,
        enum: [
            "Birthday",
            "Anniversary",
            "Funeral",
            "Marriage",
            "NewHouse",
            "NewShop",
            "SchoolAdmission",
            "Other"
        ],

    },
    message: { type: String, default: "Best Wishes!" },
    personalizedMessage: { type: String },
    status: { type: String, enum: ["Scheduled", "Sent"], default: "Scheduled" },
    category: { type: String, enum: ["Voter", "PartyMember", "Leader", "Officer"], },



    messageSent: { type: Boolean, default: false },
    lastMessageSent: { type: Date },
})
module.exports = mongoose.model("Wish", WishSchema)