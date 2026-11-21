import "dotenv/config";
import { config } from "dotenv";
config();
import express from "express";
import { createServer } from "node:http";

import mongoose from "mongoose";
import cors from "cors";

const PORT = process.env.PORT || 3300;

import { connectToSocket } from "./controllers/socketManager.js";
import userRoutes from "./routes/usersRoutes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 3300);
app.set("mongo_url", process.env.DATABASE);

app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: " 40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/", (req, res) => {
  return res.json({ hello: "world" });
});

const start = async () => {
  try {
    const connectionDb = await mongoose.connect(app.get("mongo_url"));
    console.log(`Mongo Connected DB host : ${connectionDb.connection.host}`);

    server.listen(app.get("port"), () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Error due to ${error}`);
  }
};
start();
