"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_1 = require("../controllers/user");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
router.post("/user/signup", user_1.postSignup);
router.get("/user/signup", user_1.getSignup);
router.post("/user/login", user_1.postLogin);
router.get("/user/login", user_1.getLogin);
router.get("/user/chat", user_1.getChatPage);
router.get("/user/chat/list", authenticate_1.default, user_1.getAllUsers);
exports.default = router;
