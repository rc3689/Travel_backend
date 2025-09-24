import { Schema, model } from "mongoose";

const ExpenseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const BudgetSchema = new Schema({
  total: {
    type: Number,
    required: true,
  },
  spent: {
    type: Number,
    required: true,
  },
  expenses: [ExpenseSchema],
});

const FileSchema = new Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
});

const TripSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  destinations: [
    {
      type: String,
      required: true,
    },
  ],
  budget: BudgetSchema,
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  files: [
    {
      type: String,
    },
  ],
  files: [FileSchema],
});

const Trip = model("Trip", TripSchema);

export default Trip;
