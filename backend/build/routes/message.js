"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const message_1 = require("../controllers/message");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
router.post("/user/chat", authenticate_1.default, message_1.postMessage);
exports.default = router;
