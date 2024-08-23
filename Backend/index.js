import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import dotenv from 'dotenv';
import { fileURLToPath } from "url";
dotenv.config();

import authRoutes from "./routes/Route.js";
// import SocketHandler from "./SocketHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/api', authRoutes);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected");
  SocketHandler(socket);
});
app.get("/", (req, res) => {
  res.send("Welcome to the AI");
});

console.log('JWT_SEeeCRET:', process.env.JWT_SECRET); // secret key

//MongoDB connection
//Mongoose Connection
const PORT = 6001;
mongoose
  .connect("mongodb+srv://tshaan1104:Tiwari9536@mediaapp.tm4hd.mongodb.net/Social_Media_app", {

  })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port http://localhost:${PORT}/ `);
    });
  })
  .catch((err) => {
    console.log(`Error with DB connection: ${err}`);
  });
