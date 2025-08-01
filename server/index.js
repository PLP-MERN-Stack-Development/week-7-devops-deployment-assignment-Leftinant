import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import helmet from "helmet";
import postRoutes from "./routes/postRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import commentsRoutes from "./routes/commentRoutes.js";
import "./utils/cloudinary.js";

dotenv.config();

const app = express();

const allowedOrigins = ["https://blogapp-ben.vercel.app"];

const helmet = require("helmet");
app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("🚀 Server is up and running!");
});

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentsRoutes);

app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ error: "Something went wrong on the server." });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server is up and running on port ${PORT}`);
    });
  })
  .catch((err) => console.log("❌ MongoDB connection error:", err));
