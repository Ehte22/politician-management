const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
    // 🔹 Basic Information  
    name: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    age: { type: Number },
    occupation: { type: String },
    // idProof: { type: String },

    // 🔹 Visit Details  
    purpose: { type: String, required: false },
    checkIn: { type: Date, default: Date.now },
    checkOut: { type: Date },
    referredBy: { type: String }, // If someone referred the visitor  
    // visitDuration: { type: String }, // Duration of visit (e.g., "30 min")  
    visitorCategory: { type: String, enum: ["Citizen", "Government Official", "Party Worker", "Media", "NGO", "Other"], default: "Citizen" },

    // 🔹 Problem Details  
    problemType: { type: String, enum: ["Personal", "Community", "Legal", "Health", "Other"], required: false, default: "Personal" },
    problemDescription: { type: String, required: false },
    problemSeverity: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    // problemDocuments: [{ type: String }],
    problemDocuments: { type: String },
    problemLocation: { type: String },

    // 🔹 Status & Resolution  
    status: {
        type: String,
        enum: ["Pending", "Under Review", "In Progress", "Solved", "Rejected"],
        default: "Pending"
    },

    // 🔹 Follow-ups  
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date },
    followUpNotes: { type: String },

    // 🔹 Political Context  
    constituency: { type: String },
    mlaAssigned: { type: mongoose.Schema.Types.ObjectId, ref: "MLA" },
    politicalAffiliation: { type: String }, // If visitor belongs to a political party  

    // 🔹 Priority & Labels  
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Low" },
    labels: [{ type: String }], // Custom labels for filtering  

    // 🔹 Additional Fields  
    isFirstVisit: { type: Boolean, default: false },
    visitorFeedback: { type: String },
    visitOutcome: { type: String, enum: ["Satisfied", "Partially Satisfied", "Not Satisfied"], default: "Satisfied" },
    visitRating: { type: Number, min: 1, max: 5 },
    isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Visitor", visitorSchema);
