const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  charityId: { type: String, required: true, index: true },
  categoryIds: [{ type: Schema.Types.ObjectId, ref: "Category"}],
  regionId: { type: Schema.Types.ObjectId, ref: "Region", required: true },
  title: { type: String, required: true },
  description: { type: String },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "active", "halted"],
    required: true,
    default: "pending",
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true, index: true },
  images: [{ type: String }],
  videos: [{ type: String }],
  account: { type: String },
  hashedStripeId: { type: String, required: true },
});

module.exports = mongoose.model("Project", projectSchema);
