const asyncHandler = require("express-async-handler")
const { User } = require("../models/User")
const { generatePassword } = require("../utils/generatePassword.js")
const { registerRules } = require("../rules/auth.rules")
const { customValidator } = require("../utils/validator")
const bcryptjs = require("bcryptjs")
const { sendEmail } = require("../utils/email")
const cloudinary = require("../utils/uploadConfig")
const { welcomeTemplate } = require("../templates/welcomeTemplate")

// Get All Users
exports.getAllUsers = asyncHandler(async (req, res, next) => {
    const { page = 1, limit = 10, searchQuery = "", isFetchAll = false } = req.query

    const currentPage = parseInt(page)
    const pageLimit = parseInt(limit)
    const skip = (currentPage - 1) * pageLimit

    const { role, boothId } = req.user

    const query = {
        $and: [
            // { role: { $ne: "Office Admin" } },

            role === "Office Admin"
                ? {}
                : role === "Booth Manager"
                    ? { boothId: boothId }
                    : {},
            role === "Office Admin"
                ? { role: { $nin: ["Office Admin"] } }
                : role === "Booth Manager"
                    ? { role: { $nin: ["Office Admin", "Booth Manager"] } }
                    : {},
            searchQuery
                ? {
                    $or: [
                        { firstName: { $regex: searchQuery, $options: "i" } },
                        { lastName: { $regex: searchQuery, $options: "i" } },
                        { email: { $regex: searchQuery, $options: "i" } },
                    ]
                }
                : {}
        ]
    }

    const totalUsers = await User.countDocuments(query)
    const totalPages = Math.ceil(totalUsers / pageLimit)

    let result = []
    if (isFetchAll) {
        result = await User.find().select("-password -__v").lean()
    } else {
        result = await User.find(query).skip(skip).limit(pageLimit).lean()
    }
    res.status(200).json({ message: "Users Fetch successfully", result, totalPages, totalUsers })
})

// Get Clinic By Id
exports.getUserById = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const result = await User.findById(id).select("-password -__v").lean()

    if (!result) {
        return res.status(404).json({ message: `User with ID: ${id} not found` })
    }

    res.status(200).json({ message: "User fetch successfully", result })
})

// Create User
exports.createUser = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, phone, role, password } = req.body

    const user = await User.findOne({ $or: [{ email }, { phone }] })

    if (user) {
        if (user.email == email) {
            return res.status(409).json({ message: "Email already exist" })
        }
        if (user.phone == phone) {
            return res.status(409).json({ message: "Phone number already exist" })
        }
    }

    let profile = ""
    if (req.file) {
        const { secure_url } = await cloudinary.uploader.upload(req.file.path)
        profile = secure_url
    }

    if (role === "Booth Manager" || role === "Booth Worker") {
        const generatedPassword = generatePassword(12)

        let data = { ...req.body, password: generatedPassword, profile }

        const { isError, error } = customValidator(data, registerRules)

        if (isError) {
            return res.status(422).json({ message: "Validation errors", error });
        }
        const hashPassword = await bcryptjs.hash(generatedPassword, 10)

        const result = await User.create({ ...data, password: hashPassword })

        const welcomeTemp = welcomeTemplate({ firstName, lastName, email, password: generatedPassword })

        await sendEmail({
            to: email,
            subject: "Welcome to Our Service",
            text: welcomeTemp
        });

        return res.status(200).json({ message: "User registered and email sent successfully", result })
    }

    const { isError, error } = customValidator({ ...req.body, profile }, registerRules)

    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const hashPassword = await bcryptjs.hash(password, 10)

    const result = await User.create({
        firstName,
        lastName,
        email,
        phone,
        password: hashPassword,
        role,
        profile
    })

    return res.status(200).json({ message: "User registered and email sent successfully", result })
})

// Update User
exports.updateUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const user = await User.findById(id)

    let profile
    if (req.file) {
        const publicId = user?.profile?.split("/").pop()?.split(".")[0]
        publicId && await cloudinary.uploader.destroy(publicId)

        const { secure_url } = await cloudinary.uploader.upload(req.file.path)
        profile = secure_url
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    await User.findByIdAndUpdate(id, { ...req.body, profile }, { new: true, runValidators: true })

    res.status(200).json({ message: "User update successfully" })
})

// Update User Status
exports.updateUserStatus = asyncHandler(async (req, res, next) => {
    const { status } = req.body
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
        return res.status(404).json({ message: "User not found" })
    }

    await User.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })

    res.status(200).json({ message: "User status update successfully" })
})

// Delete User
exports.deleteUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const user = await User.findById(id)

    if (!user) {
        return res.status(400).json({ message: "User not found" })
    }

    await User.findByIdAndUpdate(id, { deletedAt: new Date() }, { new: true, runValidators: true })

    res.status(200).json({ message: "User delete successfully" })
})

