import mongoose from "mongoose";

const User = mongoose.models.User || mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: {
        type: String,
      },
      email: {
        type: String,
      },
      phone: {
        type: String,
      },
      
    },
    {
      timestamps: true,
    }
  )
);

export default User;
