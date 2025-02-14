
const express = require("express");
const { createVisitor, updateVisitor, getAllVisitors, getVisitorById, deleteVisitor } = require("../controllers/visit.controller");
const visitorRouter = express.Router();
const multerMiddleware = require("../utils/upload")

const upload = multerMiddleware()
visitorRouter.post("/create", upload.single("problemDocuments"), createVisitor);
visitorRouter.put("/update/:id", upload.single("problemDocuments"), updateVisitor);
visitorRouter.get("/", getAllVisitors);
visitorRouter.get("/:id", getVisitorById);
visitorRouter.delete("/:id", deleteVisitor);

module.exports = visitorRouter;
