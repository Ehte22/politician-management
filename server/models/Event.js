const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,

  },
  description: {
    type: String,

  },
  startTime: {
    type: String, 
    required: true
  },
  endTime: {
    type: String, 
    required: true
  },
  location: {
    type: String,
 
  },
 organizer: {
    type: String,
  },
  
 isDelete: {
    type: Boolean,
    default:false
  },

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);
