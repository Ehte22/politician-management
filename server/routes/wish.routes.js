const router = require("express").Router()
const wishController = require("./../controllers/wish.controller")

router

    .post("/wishes", wishController.createWish)
    .get("/getWishes", wishController.getAllWishes)
    .get("/wishes/:id", wishController.getWishById)
    .put("/wishes/:updateId", wishController.updateWish)
    .delete("/wishes-delete/:id", wishController.deleteWish)
    .post("/wishes/schedule/:wishId", wishController.scheduleWish)

module.exports = router