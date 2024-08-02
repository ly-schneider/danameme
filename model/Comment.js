import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  upvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
  downvotes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
  ],
});

export default mongoose.models.Comment ||
  mongoose.model("Comment", CommentSchema);
