"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const router = (0, express_1.Router)();
const group_1 = require("../controllers/group");
router.post("/user/create/group/:groupName", authenticate_1.default, group_1.postGroup);
router.post("/user/create/group", authenticate_1.default, group_1.postMember);
router.get("/user/get/group", authenticate_1.default, group_1.getGroup);
exports.default = router;
