"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// Import your controller functions
const message_1 = require("../controllers/message");
// Import your authentication middleware
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
// Define routes with comments
// Route to send a one-to-one message
router.post("/user/chat/oneToOne/msg/:user2_id", authenticate_1.default, message_1.postMessage);
// Route to retrieve one-to-one messages
router.get("/user/chat/oneToOne/msg/:user2_id", authenticate_1.default, message_1.getOneToOneMsg);
// Route to retrieve group messages
router.get("/user/chat/group/msg/:groupId", authenticate_1.default, message_1.getGroupMsg);
// Route to send a group message
router.post("/user/chat/group/msg/:groupId", authenticate_1.default, message_1.postGroupMsg);
// Route to recieve any message from unknown number
router.get("/user/chat/msg/unknown", authenticate_1.default, message_1.MsgFromUnknown);
router.get("/user/chat/usknownMsg/msg/:userId/:conversationId", authenticate_1.default, message_1.unknownMsg);
exports.default = router;
