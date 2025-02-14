const asyncHandler = require("express-async-handler");
const Event = require("../models/Event");
const { customValidator } = require("../utils/validator");


exports.addEvent = asyncHandler(async (req, res) => {
    const { title, description,  startTime, endTime, location , organizer} = req.body;

    const rules = {
        title: { required: true },
        description: { required:false },
        startTime: { required: true },
       
        endTime: { required: true },
        location: { required:false },
        organizer: { required: false },
    }
    const { isError, error }= customValidator(req.body, rules)
    if (isError) {
        return res.status(422).json({ message: "Validation errors", error });
    }

    const event = await Event.create({
        title, description,  startTime, endTime, location , organizer
    });

    res.status(201).json({
        message: "Event Added Successfully",
        event
    });
});


exports.getEvents = asyncHandler(async (req, res) => {
    const events = await Event.find();
    res.status(200).json({messaeg:"All Events Fetch Success",result:events});
});




exports.updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error("Event not found");
    }
    console.log("req.body", req.body);
    
    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({
        message: "Event Updated Successfully",
        updatedEvent
    });
});


exports.deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404);
        throw new Error("Event not found");
    }

    await Event.findByIdAndUpdate(req.params.id, {isDelete: true});
    res.status(200).json({ message: "Event Deleted Successfully" });
});
