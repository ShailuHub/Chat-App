"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const contact_1 = require("../controllers/contact");
const router = (0, express_1.Router)();
router.get("/user/addUser", contact_1.getAddContactPage);
router.get("/user/searchOrAdd", contact_1.getSearchOrAdd);
router.get("/user/remaining/chat/list/:groupId", authenticate_1.default, contact_1.getGroupExcludedList);
router.get("/user/toContact", contact_1.getAddToContactPage);
router.post("/user/createContact", authenticate_1.default, contact_1.createNewContact);
router.delete("/user/delete/contact/:phone/:user2_id", authenticate_1.default, contact_1.deleteContact);
router.delete("/user/remove/contact/:userId", authenticate_1.default, contact_1.deleteMember);
exports.default = router;
