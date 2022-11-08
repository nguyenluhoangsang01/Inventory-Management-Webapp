import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

const PORT = process.env.PORT || 8000;

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());

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
