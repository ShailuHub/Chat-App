"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageRouter = exports.userRouter = void 0;
const user_1 = __importDefault(require("../routes/user"));
exports.userRouter = user_1.default;
const message_1 = __importDefault(require("../routes/message"));
exports.messageRouter = message_1.default;
