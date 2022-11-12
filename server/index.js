import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/users.js";

// Constants
const PORT = process.env.PORT || 8000; // Port

// App
const app = express(); // Create express app
dotenv.config(); // Load environment variables from .env file

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS

// Connect to DB and start server
(async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }) // Connect to MongoDB
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `⚡️[server]: Connected to the database. Server running on port ${PORT}`
        );
      });
    }) // Start server
    .catch((err) => {
      console.log(`⚡️[server]: Error connecting to database: ${err.message}`);
    }); // Catch error
})();

// Routes
app.use("/api/users", userRoutes); // Use user routes
app.use("/*", (_, res) => {
  res.status(501).send("Not Implemented."); // 501 Not Implemented
}); // Catch all other routes
