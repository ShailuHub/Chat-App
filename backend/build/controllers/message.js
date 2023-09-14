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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postGroupMsg = exports.getGroupMsg = exports.getOneToOneMsg = exports.postMessage = void 0;
const index_1 = require("../models/index");
const sequelize_1 = __importDefault(require("sequelize"));
// Handle POST request to create a new message
const postMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    // Get the user ID and message from the request body
    const user1_id = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const user2_id = Number(req.params.user2_id);
    const { message } = req.body;
    if (user1_id && user2_id) {
        try {
            // Check if a conversation between the two users exists
            const isConversationExists = yield index_1.Conversation.findOne({
                where: {
                    [sequelize_1.default.Op.or]: [
                        {
                            user1_id: user1_id,
                            user2_id: user2_id,
                        },
                        {
                            user1_id: user2_id,
                            user2_id: user1_id,
                        },
                    ],
                },
            });
            // Create a new message in the database
            if (isConversationExists) {
                yield index_1.Message.create({
                    sendername: (_b = req.user) === null || _b === void 0 ? void 0 : _b.username,
                    message,
                    senderId: user1_id,
                    conversationId: isConversationExists.conversationId,
                });
                // Send a success response
                res.status(200).send({
                    message: "Message created and posted successfully",
                    sendername: (_c = req.user) === null || _c === void 0 ? void 0 : _c.username,
                });
            }
            else {
                res.status(401).send({ message: "Not connected with each other" });
            }
        }
        catch (error) {
            console.error(error);
            // Handle internal server error
            res.status(500).send({ message: "Internal server error" });
        }
    }
});
exports.postMessage = postMessage;
// Handle one-to-one message retrieval
const getOneToOneMsg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const user1_id = (_d = req.user) === null || _d === void 0 ? void 0 : _d.userId;
    const user2_id = Number(req.params.user2_id);
    if (user1_id && user2_id) {
        try {
            // Check if a conversation between the two users exists
            const isConversationExists = yield index_1.Conversation.findOne({
                where: {
                    [sequelize_1.default.Op.or]: [
                        {
                            user1_id: user1_id,
                            user2_id: user2_id,
                        },
                        {
                            user1_id: user2_id,
                            user2_id: user1_id,
                        },
                    ],
                },
            });
            if (!isConversationExists) {
                // Create a new conversation if it doesn't exist
                yield index_1.Conversation.create({
                    user1_id,
                    user2_id,
                    type: "oneToOne",
                });
                res.status(200).send({ message: "Connection successful" });
            }
            else {
                try {
                    // Check if the user is a contact
                    const user = yield index_1.Contact.findOne({
                        where: {
                            [sequelize_1.default.Op.and]: [{ userId: user1_id }, { addedId: user2_id }],
                        },
                    });
                    if (user) {
                        try {
                            // Retrieve one-to-one messages
                            const oneToOneMsg = yield index_1.Message.findAll({
                                where: { conversationId: isConversationExists.conversationId },
                            });
                            res
                                .status(201)
                                .send({ oneToOneMsg, user1_id, username: user.username });
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                    else {
                        res.status(405).send({ message: "No contact" });
                    }
                }
                catch (error) {
                    console.log(error);
                    res.status(500).send({ message: "Internal server error" });
                }
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
});
exports.getOneToOneMsg = getOneToOneMsg;
// Handle group message retrieval
const getGroupMsg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId;
    const groupId = req.params.groupId;
    try {
        // Check if the group exists
        const isGroupExist = yield index_1.Conversation.findOne({
            where: {
                type: "group",
                groupId: groupId,
            },
        });
        if (!isGroupExist) {
            return res
                .status(403)
                .send({ message: "User is not the creator of the group" });
        }
        // Retrieve group messages
        const groupMsg = yield index_1.Message.findAll({
            where: { conversationId: isGroupExist.conversationId },
        });
        res.status(200).send({ groupMsg, userId, message: "Group Msg sent" });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
});
exports.getGroupMsg = getGroupMsg;
// Handle POST request to create a new group message
const postGroupMsg = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g, _h;
    const userId = (_f = req.user) === null || _f === void 0 ? void 0 : _f.userId;
    const groupId = Number(req.params.groupId);
    const { message } = req.body;
    try {
        // Check if the conversation (group) exists
        const isConversationExists = yield index_1.Conversation.findOne({
            where: { groupId: groupId },
        });
        if (!isConversationExists) {
            return res.status(401).send({ message: "Not connected with this group" });
        }
        else {
            // Create a new group message in the database
            yield index_1.Message.create({
                conversationId: isConversationExists.conversationId,
                message,
                sendername: (_g = req.user) === null || _g === void 0 ? void 0 : _g.username,
                senderId: userId,
            });
            res.status(200).send({
                message: "Message created and posted successfully",
                sendername: (_h = req.user) === null || _h === void 0 ? void 0 : _h.username,
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
});
exports.postGroupMsg = postGroupMsg;
