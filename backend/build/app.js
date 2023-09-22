"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const index_1 = require("./models/index");
const path_1 = __importDefault(require("path"));
const index_2 = require("./routes/index");
const database_1 = __importDefault(require("./utils/database"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
exports.io = io;
// Enable CORS for your Express app
app.use((0, cors_1.default)());
// Serve static files (e.g., front-end files)
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "..", "fronted")));
// Set up body parsing for JSON and form data
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// Set up your Express routers
app.use(index_2.userRouter);
app.use(index_2.messageRouter);
app.use(index_2.contactRouter);
app.use(index_2.groupRouter);
// Handle WebSocket connections
io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    // Get the userId from the socket handshake
    const userId = Number(socket.handshake.auth.ownerId);
    // Check if userId is a valid number
    if (!isNaN(userId)) {
        try {
            // Find the user by userId in the database
            const user = yield index_1.User.findOne({ where: { userId: userId } });
            if (user) {
                // Set the user's isActive status to true
                user.isActive = true;
                yield user.save();
                // Broadcast to all clients that this user has connected
                socket.broadcast.emit("userConnect", { active: true, userId: userId });
            }
        }
        catch (error) {
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
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        // Get the userId from the socket handshake
        const userId = Number(socket.handshake.auth.ownerId);
        // Check if userId is a valid number
        if (!isNaN(userId)) {
            if (userId) {
                try {
                    // Find the user by userId in the database
                    const user = yield index_1.User.findOne({ where: { userId: userId } });
                    if (user) {
                        // Set the user's isActive status to false
                        user.isActive = false;
                        yield user.save();
                        // Broadcast to all clients that this user has disconnected
                        socket.broadcast.emit("userDisconnect", {
                            active: false,
                            userId: userId,
                        });
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
        }
    }));
}));
// Synchronize the database models with the database
database_1.default
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
