import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "analyst"],  // admin hoga ya analyst hoga 
      default: "analyst",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;