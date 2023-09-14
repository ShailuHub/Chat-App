"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupRouter = exports.contactRouter = exports.messageRouter = exports.userRouter = void 0;
const user_1 = __importDefault(require("../routes/user"));
exports.userRouter = user_1.default;
const message_1 = __importDefault(require("../routes/message"));
exports.messageRouter = message_1.default;
const contact_1 = __importDefault(require("../routes/contact"));
exports.contactRouter = contact_1.default;
const group_1 = __importDefault(require("../routes/group"));
exports.groupRouter = group_1.default;
