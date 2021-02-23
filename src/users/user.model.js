import mongoose from "mongoose";
const { Schema, model } = mongoose;
import * as uuid from "uuid";
import * as USER_STATUSES from "./user-statuses.js";

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  avatarURL: { type: String, required: false },
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    required: false,
    default: "free",
  },
  verificationToken: {
    type: String,
    required: false,
    default: () => uuid.v4(),
  },
  status: {
    type: String,
    enum: Object.values(USER_STATUSES),
    required: false,
    default: USER_STATUSES.CREATED,
  },
  token: { type: String, required: false },
});

export const userModel = model("User", userSchema);
