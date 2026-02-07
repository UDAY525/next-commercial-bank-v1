import mongoose, { InferSchemaType } from "mongoose";

const RequestGrantsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
    max: [200, "Quantity cannot exceed 100"],
  },
  status: {
    type: String,
    required: true,
    enum: ["pending", "granted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
  bloodTransactionCreated: {
    type: Boolean,
    default: false,
  },
});

const RequestGrantsModel =
  mongoose.models.RequestGrants ||
  mongoose.model("RequestGrants", RequestGrantsSchema);

export default RequestGrantsModel;

export type RequestGrantsSchema = InferSchemaType<typeof RequestGrantsSchema>;
