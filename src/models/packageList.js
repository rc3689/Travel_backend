import { Schema, model } from "mongoose";

const packageListSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const PackageList = model("PackageList", packageListSchema);

export default PackageList;
