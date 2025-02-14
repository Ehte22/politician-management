const asyncHandler = require("express-async-handler");
const cloudinary = require("../utils/uploadConfig");
const { projectUpload } = require("../utils/upload");
const Visitor = require("../models/Visitor");

exports.createVisitor = asyncHandler(async (req, res) => {


    try {
        // const documents = {};
        // for (const key in req.files) {
        //     if (key === "problemDocuments") {
        //         if (!documents[key]) {
        //             documents[key] = [];
        //         }
        //         const uploadAllImagesPromise = [];
        //         for (const item of req.files[key]) {
        //             uploadAllImagesPromise.push(cloudinary.uploader.upload(item.path));
        //         }

        //         const allData = await Promise.all(uploadAllImagesPromise);
        //         documents[key] = allData.map(item => item.secure_url);
        //     } else {
        //         const { secure_url } = await cloudinary.uploader.upload(req.files[key][0].path);
        //         documents[key] = secure_url;
        //     }
        // }
        // for (const key in req.files) {
        //     const { secure_url } = await cloudinary.uploader.upload(req.files[key][0].path);
        //     documents[key] = secure_url;
        // }

        let problemDocuments = ""
        if (req.file) {
            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            problemDocuments = secure_url
        }

        const newVisitor = new Visitor({
            // idProof: documents["idProof"],
            name: req.body.name,
            email: req.body.email,
            contact: req.body.contact,
            address: req.body.address,
            gender: req.body.gender,
            age: req.body.age,
            occupation: req.body.occupation,
            purpose: req.body.purpose,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            referredBy: req.body.referredBy,
            visitorCategory: req.body.visitorCategory,
            problemType: req.body.problemType,
            problemDescription: req.body.problemDescription,
            problemSeverity: req.body.problemSeverity,
            problemLocation: req.body.problemLocation,
            status: req.body.status,
            followUpRequired: req.body.followUpRequired,
            followUpDate: req.body.followUpDate,
            followUpNotes: req.body.followUpNotes,
            constituency: req.body.constituency,
            politicalAffiliation: req.body.politicalAffiliation,
            priority: req.body.priority,
            labels: req.body.labels,
            isFirstVisit: req.body.isFirstVisit,
            visitorFeedback: req.body.visitorFeedback,
            visitOutcome: req.body.visitOutcome,
            visitRating: req.body.visitRating,
            isDeleted: req.body.isDeleted,
            // problemDocuments: documents["problemDocuments"],
            problemDocuments,

        });
        await newVisitor.save();
        res.status(201).json({
            message: "Visitor created successfully",
            visitor: newVisitor,
        });
    } catch (error) {
        console.error("Error creating visitor: ", error);
        res.status(500).json({ message: "Error creating visitor" });
    }
});

exports.updateVisitor = asyncHandler(async (req, res) => {


    const { id } = req.params;

    try {
        // const documents = {};
        // for (const key in req.files) {
        //     if (key === "problemDocuments") {
        //         if (!documents[key]) {
        //             documents[key] = [];
        //         }
        //         const uploadAllImagesPromise = [];
        //         for (const item of req.files[key]) {
        //             uploadAllImagesPromise.push(cloudinary.uploader.upload(item.path));
        //         }

        //         const allData = await Promise.all(uploadAllImagesPromise);
        //         documents[key] = allData.map(item => item.secure_url);
        //     } else {
        //         const { secure_url } = await cloudinary.uploader.upload(req.files[key][0].path);
        //         documents[key] = secure_url;
        //     }
        // }
        console.log(req.body, "Req.body");
        console.log(req.file, "Req.File");

        const visitor = await Visitor.findById(id)
        let problemDocuments
        if (req.file) {
            const publicId = visitor?.problemDocuments?.split("/").pop()?.split(".")[0]
            publicId && await cloudinary.uploader.destroy(publicId)

            const { secure_url } = await cloudinary.uploader.upload(req.file.path)
            problemDocuments = secure_url
        }

        const updatedVisitor = await Visitor.findByIdAndUpdate(id, {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            // idProof: documents["idProof"],
            // problemDocuments: documents["problemDocuments"],
            address: req.body.address,
            gender: req.body.gender,
            age: req.body.age,
            occupation: req.body.occupation,
            purpose: req.body.purpose,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            referredBy: req.body.referredBy,
            visitorCategory: req.body.visitorCategory,
            problemType: req.body.problemType,
            problemDescription: req.body.problemDescription,
            problemSeverity: req.body.problemSeverity,
            problemLocation: req.body.problemLocation,
            status: req.body.status,
            followUpRequired: req.body.followUpRequired,
            followUpDate: req.body.followUpDate,
            followUpNotes: req.body.followUpNotes,
            constituency: req.body.constituency,
            politicalAffiliation: req.body.politicalAffiliation,
            priority: req.body.priority,
            labels: req.body.labels,
            isFirstVisit: req.body.isFirstVisit,
            visitorFeedback: req.body.visitorFeedback,
            visitOutcome: req.body.visitOutcome,
            visitRating: req.body.visitRating,
            isDeleted: req.body.isDeleted,
            problemDocuments,
            updatedAt: Date.now(),
        }, { new: true });

        if (!updatedVisitor) {
            return res.status(404).json({ message: "Visitor not found" });
        }

        // Send success response
        res.status(200).json({
            message: "Visitor updated successfully",
            visitor: updatedVisitor,
        });
    } catch (error) {
        console.error("Error updating visitor: ", error);
        res.status(500).json({ message: "Error updating visitor" });
    }

});

exports.getAllVisitors = asyncHandler(async (req, res) => {
    const result = await Visitor.find({ isDeleted: false });
    res.status(200).json({ message: "all Visitor Fetch success,", result });
});

exports.getVisitorById = asyncHandler(async (req, res) => {
    const result = await Visitor.findById(req.params.id);
    if (!result) {
        return res.status(404).json({ message: "Visitor not found" });
    }
    res.status(200).json(result);
});




exports.deleteVisitor = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(404).json({ message: "Visitor ID not found" });
    }
    const result = await Visitor.findByIdAndUpdate(id, { isDeleted: true });
    if (!result) {
        return res.status(404).json({ message: "Visitor not found" });
    }
    res.status(200).json({ message: "Visitor deleted successfully" });

});



