const express = require("express")
const calenderController = require("../controllers/calender.controller")
const multerMiddleware = require("../utils/upload")
// const { restrict } = require("../utils/protected")

// const upload = multerMiddleware()

const calenderRouter = express.Router()

calenderRouter
    .get("/", calenderController.getEvents)
    .post("/add-event", calenderController.addEvent)
    .put("/update-event/:id", calenderController.updateEvent)
    .delete("/delete-event/:id", calenderController.deleteEvent)
   
module.exports = calenderRouter