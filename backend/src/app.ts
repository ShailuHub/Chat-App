import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import { User } from "./models/index";
import fs from "fs";

import path from "path";
import {
  userRouter,
  messageRouter,
  contactRouter,
  groupRouter,
} from "./routes/index";

import sequelize from "./utils/database";

const PORT = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// Enable CORS for your Express app
app.use(cors());

// Serve static files (e.g., front-end files)
app.use(express.static(path.join(__dirname, "..", "..", "fronted")));

// Set up body parsing for JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("combined", { stream: accessLogStream }));

// Set up your Express routers
app.use(userRouter);
app.use(messageRouter);
app.use(contactRouter);
app.use(groupRouter);

// Handle WebSocket connections
io.on("connection", async (socket) => {
  // Get the userId from the socket handshake
  const userId: number = Number(socket.handshake.auth.ownerId);

  // Check if userId is a valid number
  if (!isNaN(userId)) {
    try {
      // Find the user by userId in the database
      const user = await User.findOne({ where: { userId: userId } });

      if (user) {
        // Set the user's isActive status to true
        user.isActive = true;
        await user.save();

        // Broadcast to all clients that this user has connected
        socket.broadcast.emit("userConnect", { active: true, userId: userId });
      }
    } catch (error) {
      console.log(error);

      // Emit an error event to the client
      socket.emit("userIsNotActive", { error: "Server error" });
    }
  }

  // Handle one-to-one messages
  socket.on("oneToOneMsg", (details) => {
    // Broadcast the message to all clients except the sender
    socket.broadcast.emit("msgFor", details);
  });

  //Handle ont-to-one file
  socket.on("oneToOneFile", (details) => {
    socket.broadcast.emit("fileMsg", details);
  });

  // Handle group chat messages
  socket.on("groupChat", (details) => {
    // Broadcast the group message to all clients
    socket.broadcast.emit("msgForGroup", details);
  });

  //Handle group file
  socket.on("fileGroupChat", (details) => {
    // Broadcast the group me
    socket.broadcast.emit("fileMessageForGroup", details);
  });
  // Handle "disconnect" event
  socket.on("disconnect", async () => {
    // Get the userId from the socket handshake
    const userId: number = Number(socket.handshake.auth.ownerId);

    // Check if userId is a valid number
    if (!isNaN(userId)) {
      if (userId) {
        try {
          // Find the user by userId in the database
          const user = await User.findOne({ where: { userId: userId } });

          if (user) {
            // Set the user's isActive status to false
            user.isActive = false;
            await user.save();

            // Broadcast to all clients that this user has disconnected
            socket.broadcast.emit("userDisconnect", {
              active: false,
              userId: userId,
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  });
});

// Synchronize the database models with the database
sequelize
  .sync()
  .then(() => {
    // Start the server on port 3000
    server.listen(PORT, () => {
      console.log(`Server is working on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });

export { io };
