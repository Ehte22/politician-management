const asyncHandler = require("express-async-handler")
const Booth = require("../models/Booth")

exports.getAllBooths = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, searchQuery = "", isFetchAll = false } = req.query

    const currentPage = parseInt(page)
    const pageLimit = parseInt(limit)
    const skip = (currentPage - 1) * pageLimit

    const query = {
        $and: [
            { deletedAt: null },
            searchQuery
                ? {
                    $or: [
                        { name: { $regex: searchQuery, $options: "i" } },
                        { boothNumber: { $regex: searchQuery, $options: "i" } },
                        { constituency: { $regex: searchQuery, $options: "i" } },
                    ]
                }
                : {}
        ]
    }

    const totalBooths = await Booth.countDocuments(query)
    const totalPages = Math.ceil(totalBooths / pageLimit)

    let result = []
    if (isFetchAll) {
        result = await Booth.find().lean()
    } else {
        result = await Booth.find(query).skip(skip).limit(pageLimit).lean()
    }
    res.status(200).json({ message: "Booths Fetch successfully", result, totalPages, totalBooths })
})

exports.getBoothById = asyncHandler(async (req, res) => {
    const { id } = req.params

    const result = await Booth.findById(id).lean()

    if (!result) {
        return res.status(404).json({ message: `Booth with ID: ${id} not found` })
    }

    res.status(200).json({ message: "Booth fetch successfully", result })
})

exports.addBooth = asyncHandler(async (req, res) => {
    const { boothNumber } = req.body

    const booth = await Booth.findOne({ boothNumber }).lean()

    if (booth) {
        return res.status(400).json({ message: `Booth with number ${boothNumber} already exist` })
    }

    const result = await Booth.create(req.body)

    res.status(200).json({ message: "booth create successfully", result })
})

exports.updateBooth = asyncHandler(async (req, res) => {
    const { id } = req.params

    const booth = await Booth.findById(id)

    if (!booth) {
        return res.status(200).json({ message: "Booth not found" })
    }

    const result = await Booth.findByIdAndUpdate(id, req.body, { new: true, runValidators: true })

    res.status(200).json({ message: "Booth update successfully", result })
})

exports.deleteBooth = asyncHandler(async (req, res) => {
    const { id } = req.params

    const booth = await Booth.findById(id)

    if (!booth) {
        return res.status(200).json({ message: "Booth not found" })
    }

    await Booth.findByIdAndUpdate(id, { ...req.body, deletedAt: new Date() }, { new: true, runValidators: true })

    res.status(200).json({ message: "Booth update successfully" })
})