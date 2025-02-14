const express = require("express")
const userController = require("../controllers/user.controller")
const multerMiddleware = require("../utils/upload")
const { restrict } = require("../utils/protected")

const upload = multerMiddleware()

const userRouter = express.Router()

userRouter
    .get("/", userController.getAllUsers)
    .get("/:id", userController.getUserById)
    .post("/add-user", upload.single("profile"), userController.createUser)
    .put("/update-user/:id", upload.single("profile"), userController.updateUser)
    .put("/update-status/:id", userController.updateUserStatus)
    .put("/delete-user/:id", userController.deleteUser)

module.exports = userRouter