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
router.get("/user/get/group/:groupId", authenticate_1.default, group_1.getGroupMember);
router.get("/user/group", group_1.getGroupChatPage);
router.patch("/user/make/admin/:userId", authenticate_1.default, group_1.makeAdmin);
router.patch("/user/remove/admin/:userId", authenticate_1.default, group_1.removeAdmin);
router.delete("/user/delete/group/:groupId", authenticate_1.default, group_1.deleteGroup);
exports.default = router;
