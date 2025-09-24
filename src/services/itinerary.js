import asyncHandler from "express-async-handler";
import Itinerary from "../models/itinerary.js";
import Trip from "../models/trip.js";

export const createItinerary = asyncHandler(async (req, res) => {
  const { title, description, activities, date } = req.body;

  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (new Date(date) < trip.startDate || new Date(date) > trip.endDate) {
    res.status(400);
    throw new Error("Itinerary date should be within the trip date range");
  }

  const itinerary = await Itinerary.create({
    trip: req.params.tripId,
    title,
    description,
    activities,
    date,
  });

  res.status(201).json(itinerary);
});

export const findAll = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const itineraries = await Itinerary.find({
    trip: req.params.tripId,
  });

  res.status(200).json(itineraries);
});

export const findById = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const itinerary = await Itinerary.findOne({
    _id: req.params.id,
    trip: req.params.tripId,
  });

  if (!itinerary) {
    res.status(404);
    throw new Error("Itinerary not found");
  }

  res.status(200).json(itinerary);
});

export const update = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  if (req.body.date) {
    if (
      new Date(req.body.date) < trip.startDate ||
      new Date(req.body.date) > trip.endDate
    ) {
      res.status(400);
      throw new Error("Itinerary date should be within the trip date range");
    }
  }

  const itinerary = await Itinerary.findOneAndUpdate(
    { _id: req.params.id, trip: req.params.tripId },
    ...(req.body.title && { title: req.body.title }),
    ...(req.body.description && { description: req.body.description }),
    ...(req.body.activities && { activities: req.body.activities }),
    ...(req.body.date && { date: req.body.date }),
    { new: true }
  );

  if (!itinerary) {
    res.status(404);
    throw new Error("Itinerary not found");
  }

  res.status(200).json(itinerary);
});

export const remove = asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({
    _id: req.params.tripId,
    user: req.user.userId,
  });

  if (!trip) {
    res.status(404);
    throw new Error("Trip not found");
  }

  const itinerary = await Itinerary.findOneAndDelete({
    _id: req.params.id,
    trip: req.params.tripId,
  });

  if (!itinerary) {
    res.status(404);
    throw new Error("Itinerary not found");
  }

  res.status(200).json(itinerary);
});
