import mongoose from "mongoose";

const PasswordResetSchema = new mongoose.Schema({
  guid: {
    type: String,
    required: true,
  },
  validUntil: {
    type: Date,
  },
  email: {
    type: String,
    required: true,
  },
  isMigrating: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.PasswordReset ||
  mongoose.model("PasswordReset", PasswordResetSchema);
