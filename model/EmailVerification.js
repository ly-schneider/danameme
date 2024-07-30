import mongoose from "mongoose";

const EmailVerificationSchema = new mongoose.Schema({
  code: {
    type: Number,
    required: true,
  },
  validUntil: {
    type: Date,
  },
  email: {
    type: String,
    required: true,
  },
});

export default mongoose.models.EmailVerification ||
  mongoose.model("EmailVerification", EmailVerificationSchema);
