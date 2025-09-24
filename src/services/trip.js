import asyncHandler from "express-async-handler";
import Trip from "../models/trip.js";
import { sendMail } from "../utils/sendMail.js";

import jwt from "jsonwebtoken";

import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const create = asyncHandler(async (req, res) => {
  const { userId } = req.user;
  const trip = await Trip.create({ ...req.body, user: userId });
  res.status(201).json(trip);
});

const findAll = asyncHandler(async (req, res) => {
  // const trips = await Trip.find({ user: req.user.userId });
  const trips = await Trip.find({
    $or: [
      { user: req.user.userId },
      { collaborators: req.user.userId },
      // { collaborators: { $in: [req.user.userId] } },
    ],
  });
  res.status(200).json(trips);
});

const findById = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    // user: req.user.userId,
    $or: [{ user: req.user.userId }, { collaborators: req.user.userId }],
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.status(200).json(trip);
});

const update = asyncHandler(async (req, res) => {
  const trip = await Trip.findOneAndUpdate(
    { _id: req.params.id, user: req.user.userId },
    {
      ...(req.body.title && { title: req.body.title }),
      ...(req.body.description && { description: req.body.description }),
      ...(req.body.startDate && { startDate: req.body.startDate }),
      ...(req.body.endDate && { endDate: req.body.endDate }),
      ...(req.body.destinations && { destinations: req.body.destinations }),
      ...(req.body.budget && { budget: req.body.budget }),
    },
    { new: true }
  );
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.status(200).json(trip);
});

const remove = asyncHandler(async (req, res) => {
  const trip = await Trip.findOneAndDelete({
    _id: req.params.id,
    user: req.user.userId,
  });
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  res.status(200).json({ message: "Trip deleted successfully" });
});

const addExpenses = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    // user: req.user.userId,
    $or: [{ user: req.user.userId }, { collaborators: req.user.userId }],
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const date = req.body.date || new Date();
  trip.budget.expenses.push({
    ...req.body,
    date,
  });

  trip.budget.spent += req.body.amount || 0;
  await trip.save();

  res.status(200).json(trip);
});

const inviteCollaborator = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    user: req.user.userId,
    // });
  }).populate("user", "name");

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const token = jwt.sign({ tripId: req.params.id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  const intivationLink = `http://localhost:5000/trips/${trip._id}/invite/accept?token=${token}`;
  // await sendMail(req.body.email, "Invitation to collaborate", intivationLink);
  await sendMail(req.body.email, "Invitation to collaborate", {
    title: trip.title,
    startDate: trip.startDate.toDateString(),
    endDate: trip.endDate.toDateString(),
    userName: trip.user.name,
    link: intivationLink,
  });
  res.status(200).json({ message: "Invitation sent successfully" });
});

const acceptInvitation = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const trip = await Trip.findById(decoded.tripId);
  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }
  trip.collaborators.push(req.user.userId);
  await trip.save();
  res.status(200).json({ message: "Invitation accepted successfully" });
});

const uploadFiles = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    $or: [{ user: req.user.userId }, { collaborators: req.user.userId }],
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (req.files.length > 4) {
    res.status(400);
    throw new Error("You can only upload up to 4 images/videos");
  }

  await Promise.all(
    req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "auto",
        folder: `wander-wise/trips/${trip.title}_${trip._id}`,
        overwrite: false,
        use_filename: true,
        unique_filename: true,
      });

      // trip.files.push(result.secure_url);

      trip.files.push({
        url: result.secure_url,
        publicId: result.public_id,
      });

      fs.unlinkSync(file.path);
    })
  );

  await trip.save();

  res.status(200).json(trip);
});

const deleteFile = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.id,
    $or: [{ user: req.user.userId }, { collaborators: req.user.userId }],
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const file = trip.files?.find((file) => file?.publicId === req.params.fileId);

  if (!file) {
    res.status(404);
    throw new Error("File not found");
  }

  await cloudinary.uploader.destroy(file.publicId);
  trip.files = trip.files?.filter(
    (file) => file?.publicId !== req.params.fileId
  );
  await trip.save();

  res.status(200).json({ message: "File deleted successfully" });
});

export {
  create,
  findAll,
  findById,
  update,
  remove,
  addExpenses,
  inviteCollaborator,
  acceptInvitation,
  uploadFiles,
  deleteFile,
};
