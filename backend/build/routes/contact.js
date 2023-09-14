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
router.post("/user/createContact", authenticate_1.default, contact_1.createNewContact);
router.delete("/user/delete/contact/:phone/:user2_id", authenticate_1.default, contact_1.deleteContact);
exports.default = router;
