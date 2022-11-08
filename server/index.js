import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

// Constants
const PORT = process.env.PORT || 8000;

// App
const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Connect to DB and start server
(async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      app.listen(PORT, () => {
        console.log(
          `⚡️[server]: Connected to the database. Server running on port ${PORT}`
        );
      });
    })
    .catch((err) => {
      console.log(`⚡️[server]: Error connecting to database: ${err.message}`);
    });
})();

// Routes
app.use("/*", (_, res) => {
  res.status(501).send("Not Implemented.");
});
