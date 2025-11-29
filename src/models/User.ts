import mongoose, { InferSchemaType } from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["admin", "regular"],
    default: "regular",
  },
});

export default mongoose.models.User || mongoose.model("User", userSchema);
export type User = InferSchemaType<typeof userSchema>;
