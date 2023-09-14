"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGroup = exports.postMember = exports.postGroup = void 0;
const index_1 = require("../models/index");
// Create a new group or return an error if it already exists
const postGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const groupName = req.params.groupName.toLowerCase();
    try {
        // Check if a group with the same adminId and groupName already exists
        const existingGroup = yield index_1.GroupChat.findOne({
            where: { adminId: userId, groupName },
        });
        if (existingGroup) {
            res.status(405).send({ message: "Group already exists" });
        }
        else {
            // Create a new group
            yield index_1.GroupChat.create({
                groupName,
                adminId: userId,
            });
            res.status(200).send({ message: "Group is created" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});
exports.postGroup = postGroup;
// Add members to a group
const postMember = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const userId = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const { groupIdArray } = req.body;
    const groupName = req.body.groupName.toLowerCase();
    console.log(groupName);
    try {
        // Find the group associated with the adminId
        const isGroup = yield index_1.GroupChat.findOne({
            where: { adminId: userId, groupName },
        });
        console.log(isGroup);
        if (!isGroup) {
            res.status(404).send({ message: "Group not found" });
            return;
        }
        // Create members for the specified group
        const memberPromises = groupIdArray.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            id = Number(id);
            yield index_1.Member.create({
                groupId: isGroup.groupId,
                userId: id,
            });
        }));
        // Wait for all member creations to complete
        yield Promise.all(memberPromises);
        // Add the admin as a member too
        yield index_1.Member.create({
            groupId: isGroup.groupId,
            userId,
        });
        // Add the group id to the conversation table
        try {
            yield index_1.Conversation.create({
                type: "group",
                groupId: isGroup.groupId,
            });
        }
        catch (error) {
            res.status(500).send({ message: "Internal server error" });
        }
        res.status(200).send({ message: "Member table created" });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
    }
});
exports.postMember = postMember;
const getGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const userId = (_c = req.user) === null || _c === void 0 ? void 0 : _c.userId;
    try {
        const allGroup = yield index_1.Member.findAll({
            where: { userId: userId },
            include: [
                {
                    model: index_1.GroupChat,
                    attributes: ["groupName"],
                    include: [{ model: index_1.User, attributes: ["username"] }],
                },
            ],
        });
        res.status(200).send({ allGroup, message: "Group List sent successfully" });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getGroup = getGroup;
