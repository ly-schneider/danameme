import mongoose from "mongoose";

const AccountSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    required: true,
  },
  firstname: {
    type: String,
    required: [true, "Vorname darf nicht leer sein"],
  },
  lastname: {
    type: String,
    required: [true, "Nachname darf nicht leer sein"],
  },
  username: {
    type: String,
    required: [true, "Benutzername darf nicht leer sein"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "E-Mail darf nicht leer sein"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "E-Mail ist nicht gültig",
    ],
  },
  password: {
    type: String,
    required: false,
  },
  karma: {
    type: Number,
    required: true,
    default: 0,
  },
  emailVerified: {
    type: Boolean,
    require: true,
    default: false,
  },
  banned: {
    type: Boolean,
    require: true,
    default: false,
  },
  profileImage: {
    type: null || String,
    required: false,
    default: null,
  },
});

export default mongoose.models.Account ||
  mongoose.model("Account", AccountSchema);
