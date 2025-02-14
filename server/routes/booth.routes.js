const express = require("express")
const boothController = require("../controllers/booth.controller")

const boothRouter = express.Router()

boothRouter
    .get("/", boothController.getAllBooths)
    .get("/:id", boothController.getBoothById)
    .post("/add-booth", boothController.addBooth)
    .put("/update-booth/:id", boothController.updateBooth)
    .put("/delete-booth/:id", boothController.deleteBooth)

module.exports = boothRouter