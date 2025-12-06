import mongoose, { InferSchemaType } from "mongoose";

const donationSchema = new mongoose.Schema({
  donarId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  donatedBloodGroup: {
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
  donatedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const DonationModel =
  (mongoose.models && mongoose.models.Donation) ||
  mongoose.model("Donation", donationSchema);

export default DonationModel;

export type Donation = InferSchemaType<typeof donationSchema>;
