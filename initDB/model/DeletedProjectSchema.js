const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deletedProjectSchema = new Schema({
  charityId: { type: Schema.Types.ObjectId, ref: "Charity", required: true, index: true },
  categoryId: [{ type: Schema.Types.ObjectId, ref: "Category"}],
  regionId: { type: Schema.Types.ObjectId, ref: "Region", required: true },
  title: { type: String, required: true },
  description: { type: String },
  goalAmount: { type: Number, required: true },
  raisedAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "deleted"},
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true, index: true },
  images: { type: [String] },
  videos: { type: [String] },
  account: { type: String },
  stripeId: { type: String },
});

deletedProjectSchema.pre("save", function (next) {
  const date = new Date(this.endDate);
  this.partitionKey = `${date.getFullYear()}-${date.getMonth() + 1}`; 
});

const createDeletedProjectModel = (dbConnection) => dbConnection.model('DeletedProject', deletedProjectSchema);

module.exports = createDeletedProjectModel;