"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.initializeSocket = void 0;
// sockets/socket.js
const socket_io_1 = require("socket.io");
let io; // Declare io as a module-level variable
const initializeSocket = (server) => {
    io = new socket_io_1.Server(server); // Initialize Socket.IO with the server
    io.on("connection", (socket) => {
        console.log("A user is connected");
        // Handle events or actions here
    });
};
exports.initializeSocket = initializeSocket;
const getIo = () => {
    return io;
};
exports.getIo = getIo;
