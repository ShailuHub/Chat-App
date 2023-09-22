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
exports.getGroupExcludedList = exports.getSearchOrAdd = exports.getAddToContactPage = exports.deleteContact = exports.createNewContact = exports.getAddContactPage = void 0;
const path_1 = __importDefault(require("path"));
const path_2 = require("../utils/path");
const index_1 = require("../models/index");
const sequelize_1 = __importDefault(require("sequelize"));
// Function to get the Add Contact page
const getAddContactPage = (req, res) => {
    const filePath = path_1.default.join(__dirname, path_2.absolutePath, "html", "contact.html");
    res.status(200).sendFile(path_1.default.join(filePath));
};
exports.getAddContactPage = getAddContactPage;
// Function to create a new contact
const createNewContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    let { phone, username } = req.body;
    phone = phone.trim();
    username = username.trim();
    // Check if the phone number is valid (10 digits)
    if (phone.length != 10) {
        return res.status(405).send({ message: "Enter a valid ten-digit number" });
    }
    else {
        try {
            // Find the user associated with the provided phone number
            const user = yield index_1.User.findOne({ where: { phone: phone } });
            if (user) {
                try {
                    // Create a new contact
                    yield index_1.Contact.create({
                        username: username,
                        userId: userId,
                        phone: phone,
                        addedId: user.userId,
                    });
                    res.status(200).send({ message: "Contact saved" });
                }
                catch (error) {
                    console.log(error);
                }
            }
            else {
                res.status(405).send({ message: "The entered contact doesn't exist" });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
});
exports.createNewContact = createNewContact;
// Function to delete a contact
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    const user1_id = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const phone = (_c = req.params) === null || _c === void 0 ? void 0 : _c.phone;
    const user2_id = Number((_d = req.params) === null || _d === void 0 ? void 0 : _d.user2_id);
    if (phone) {
        try {
            // Find the contact to delete
            const user = yield index_1.Contact.findOne({
                where: { [sequelize_1.default.Op.and]: [{ phone: phone }, { userId: user1_id }] },
            });
            if (user) {
                try {
                    // Check if there is a conversation with this contact
                    const isConversationExist = yield index_1.Conversation.findOne({
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
                    // Uncomment the following lines to delete the conversation if it exists
                    // if (isConversationExist) {
                    //   await isConversationExist.destroy();
                    // }
                }
                catch (error) {
                    console.log(error);
                    res.status(500).send({ message: "Internal server error" });
                }
                // Delete the contact
                yield user.destroy();
                res.status(200).send({ message: "Successfully deleted" });
            }
            else {
                res.status(401).send({ message: "User not found" });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
});
exports.deleteContact = deleteContact;
const getAddToContactPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, path_2.absolutePath, "html", "addToContact.html");
    res.status(200).sendFile(path_1.default.join(filePath));
});
exports.getAddToContactPage = getAddToContactPage;
const getSearchOrAdd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, path_2.absolutePath, "html", "searchAndAddContact.html");
    res.status(200).sendFile(path_1.default.join(filePath));
});
exports.getSearchOrAdd = getSearchOrAdd;
const getGroupExcludedList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    const groupId = Number(req.params.groupId);
    const userId = (_e = req.user) === null || _e === void 0 ? void 0 : _e.userId;
    try {
        const contacts = [];
        // Find user contacts and sort by addedId
        const userContacts = yield index_1.Contact.findAll({
            where: { userId: userId },
        });
        // Find group member contacts and sort by userId
        const groupMemberContacts = yield index_1.Member.findAll({
            attributes: ["userId"],
            where: { groupId: groupId },
        });
        let i = 0;
        while (i < userContacts.length) {
            const tar = userContacts[i];
            const idx = groupMemberContacts.findIndex((member) => member.userId === tar.addedId);
            if (idx === -1) {
                contacts.push(tar);
            }
            i++;
        }
        res.status(200).send({ contacts, userContacts, groupMemberContacts });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal server error" });
    }
});
exports.getGroupExcludedList = getGroupExcludedList;
