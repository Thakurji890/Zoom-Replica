import "dotenv/config";
import { config } from "dotenv";
config();
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

const PORT = process.env.PORT || 3300;

const app = express();
const server = createServer(app);
const io = new Server(server);

app.set("port", process.env.PORT);
app.set("mongo_url", process.env.DATABASE);
app.get("/", (req, res) => {
  return res.json({ hello: "world" });
});

const start = async () => {
  app.listen("port", () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
start();
