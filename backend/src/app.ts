import dotenv from "dotenv";
dotenv.config();

import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import { User } from "./models/index";

import path from "path";
import {
  userRouter,
  messageRouter,
  contactRouter,
  groupRouter,
} from "./routes/index";

import sequelize from "./utils/database";
import { ValidationErrorItemOrigin } from "sequelize";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Enable CORS for your Express app
app.use(cors());

// Serve static files (e.g., front-end files)
app.use(express.static(path.join(__dirname, "..", "..", "fronted")));

// Set up body parsing for JSON and form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

  // Handle group chat messages
  socket.on("groupChat", (details) => {
    // Broadcast the group message to all clients
    socket.broadcast.emit("msgForGroup", details);
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
    server.listen(3000, () => {
      console.log("Server is working on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });

export { io };
