const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  charityId: { type: Schema.Types.ObjectId, ref: "Charity", required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  regionId: { type: Schema.Types.ObjectId, ref: "Region", required: true },
  title: { type: String, required: true },
  description: { type: String },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "active", "halted", "closed"],
    required: true,
  },
  endDate: { type: Date, required: true },
  images: { type: [String] },
  videos: { type: [String] },
  account: { type: String },
});

module.exports = mongoose.model("Project", projectSchema);
