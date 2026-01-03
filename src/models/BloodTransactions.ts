import mongoose, { InferSchemaType } from "mongoose";

const BloodTransactionsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["IN", "OUT"],
    default: "IN",
    required: true,
  },
  phone: {
    type: String,
    required: false,
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
    max: [100, "Quantity cannot exceed 100"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

const BloodTransactionsModel =
  (mongoose.models && mongoose.models.BloodTransactions) ||
  mongoose.model("BloodTransactions", BloodTransactionsSchema);

export default BloodTransactionsModel;

export type BloodTransactionsSchema = InferSchemaType<
  typeof BloodTransactionsSchema
>;
