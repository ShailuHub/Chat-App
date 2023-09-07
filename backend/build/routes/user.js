"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const user_1 = require("../controllers/user");
router.post("/user/signup", user_1.postSignup);
router.get("/user/signup", user_1.getSignup);
router.get("/user/login", user_1.getLogin);
exports.default = router;
