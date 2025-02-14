const mongoose = require("mongoose");

const BoothSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        boothNumber: { type: Number, required: true, unique: true, trim: true },
        constituency: { type: String, required: true },
        location: { type: String, required: true },
        capacity: { type: Number, required: true },
        deletedAt: { type: Date, default: null }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booth", BoothSchema);
