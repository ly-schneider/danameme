import mongoose from "mongoose";
import { comment } from "postcss";

const PostSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Account",
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

export default mongoose.models.Post || mongoose.model("Post", PostSchema);
