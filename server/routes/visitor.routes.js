
const express = require("express");
const { createVisitor, updateVisitor, getAllVisitors, getVisitorById, deleteVisitor } = require("../controllers/visit.controller");
const router = express.Router();
const multerMiddleware = require("../utils/upload")

const upload = multerMiddleware()
router.post("/create", upload.single("problemDocuments"), createVisitor);
router.put("/update/:id", upload.single("problemDocuments"), updateVisitor);
router.get("/", getAllVisitors);
router.get("/:id", getVisitorById);
router.put("/:id", deleteVisitor);

module.exports = router;
