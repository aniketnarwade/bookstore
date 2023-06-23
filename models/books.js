import mongoose from "mongoose";

const Books = mongoose.models.Books || mongoose.model(
  "Books",
  new mongoose.Schema(
    {
      id: {
        type: String,
      },
      userId: {
        type: String,
      },
      title: {
        type: String,
      },
      author: {
        type: String,
      },
      genre: {
        type: String,
      },
      year: {
        type: Number,
      },
      isbn: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  )
);

export default Books;
