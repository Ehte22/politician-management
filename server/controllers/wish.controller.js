const express = require("express");
const mongoose = require("mongoose");
const { CronJob } = require('cron');
const asyncHandler = require("express-async-handler");
const Wish = require("../models/Wish");
const sendEmail = require("../utils/email");

exports.createWish = asyncHandler(async (req, res) => {
    const { name, date, contact, email, type, message, category } = req.body;
    console.log(req.body);
    const newWish = new Wish({
        name,
        date,
        contact,
        email,
        type,
        message: message || "Best Wishes!",
        category
    });

    const result = await newWish.save();
    res.status(200).json({ message: "Wish created successfully", result });
});

exports.scheduleWish = asyncHandler(async (req, res) => {
    const { wishId } = req.params;

    const wish = await Wish.findById(wishId);
    if (!wish) {
        return res.status(408).json({ message: "Wish not found" });
    }

    const cronTime = '0 10 * * *';
    // const cronTime = '*/1 * * * *';
    const job = new CronJob(
        cronTime,
        async () => {
            const today = new Date();
            const wishDate = new Date(wish.date);

            if (today.getUTCDate() === wishDate.getUTCDate() &&
                today.getUTCMonth() === wishDate.getUTCMonth() &&
                today.getUTCFullYear() === wishDate.getUTCFullYear()) {

                const message = `Happy Birthday, ${wish.name}! ${wish.message}`;

                if (wish.email) {
                    sendEmail(wish.email, `Happy Birthday, ${wish.name}`, message);
                }

                wish.messageSent = true;
                wish.status = 'Sent';
                wish.lastMessageSent = new Date();
                await wish.save();

                console.log(`Message sent to ${wish.name} successfully at ${new Date()}`);
            }
        },
        null,
        true,
        'America/Los_Angeles'
    );

    job.start();
    console.log(`Cron job scheduled for wish ${wishId} daily at 10 AM`);
    res.status(200).json({ message: `Scheduled wish ${wishId} for daily message at 10 AM` });
});

exports.getAllWishes = asyncHandler(async (req, res) => {
    const { search, page, limit } = req.query;

    const currentPage = parseInt(page) || 1;
    const currentLimit = parseInt(limit) || 10;
    const skip = (currentPage - 1) * currentLimit;
    const currentSearch = search || "";

    const query = currentSearch ? {
        $or: [
            { name: { $regex: currentSearch, $options: 'i' } },
            { contact: { $regex: currentSearch, $options: 'i' } }
        ]
    } : {};

    const totalWishes = await Wish.countDocuments(query);

    const result = await Wish.find(query)
        .skip(skip)
        .limit(currentLimit);

    return res.status(200).json({
        message: 'All wishes retrieved successfully',
        result,
        pagination: {
            total: totalWishes,
            page: Number(currentPage),
            limit: Number(currentLimit),
            totalPages: Math.ceil(totalWishes / currentLimit)
        }
    });
});

exports.getWishById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await Wish.findById(id);
    if (!result) {
        return res.status(409).json({ message: "wish not found" });
    }
    console.log('Wish status:', result.status);
    console.log('Message sent:', result.messageSent);
    res.status(200).json({ message: "wish get All ID wishes found", result });
});

exports.updateWish = asyncHandler(async (req, res) => {
    const result = await Wish.findByIdAndUpdate(req.params.updateId, req.body, { new: true });
    if (!result) {
        return res.status(409).json({ message: "Wish not found " });
    }
    res.status(200).json({ message: "wish update wishes found", result });
});

exports.deleteWish = asyncHandler(async (req, res) => {
    const result = await Wish.findByIdAndDelete(req.params.id);
    if (!result) {
        return res.status(409).json({ message: "delete wish not found" });
    }
    res.status(200).json({ message: "wish deleted successfully", result });
});


