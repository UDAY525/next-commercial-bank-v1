import mongoose, { InferSchemaType } from "mongoose";

const donationSchema = new mongoose.Schema({
  donarId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  donatedBloodGroup: {
    name: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

export default mongoose.models.DonationsSchema ||
  mongoose.model("DonationsSchema", donationSchema);

export type Donation = InferSchemaType<typeof donationSchema>;
