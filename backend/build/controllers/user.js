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
exports.getAllUsers = exports.getChatPage = exports.postLogin = exports.getLogin = exports.getSignup = exports.postSignup = void 0;
const path_1 = __importDefault(require("path"));
const path_2 = require("../utils/path");
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sequelize_1 = __importDefault(require("sequelize"));
const models_1 = require("../models");
const saltRound = 10;
function isValidPhoneNumber(phone) {
    if (phone.length != 10)
        return false;
    for (let i = 0; i < 10; ++i) {
        let char = parseInt(phone[i]);
        if (isNaN(char))
            return false;
    }
    return true;
}
// Handle POST request to create a new user account
const postSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, email, password, confirm_password, phone } = req.body;
    // Trim and convert email and username to lowercase for consistency
    username = username.trim();
    email = email.trim().toLowerCase();
    phone = phone.trim();
    if (!isValidPhoneNumber(phone))
        return res.status(405).send({ message: "Enter valid phone number" });
    if (password === confirm_password) {
        try {
            // Check if the email already exists in the database
            const user = yield user_1.User.findOne({
                where: {
                    [sequelize_1.default.Op.or]: [
                        {
                            email: email,
                        },
                        { phone: phone },
                    ],
                },
            });
            if (!user) {
                // Hash the password before saving it to the database
                const hashPassword = yield bcrypt_1.default.hash(password, saltRound);
                try {
                    yield user_1.User.create({
                        username: username,
                        email: email,
                        password: hashPassword,
                        phone: phone,
                    });
                    // Send a success response
                    res
                        .status(202)
                        .send({ success: "success", message: "Registered successfully" });
                }
                catch (error) {
                    console.log(error);
                    res.status(500).send({ message: "Internal server error" });
                }
            }
            else {
                // User with the same email already exists
                res
                    .status(409)
                    .send({ success: "failed", message: "Email already exists" });
            }
        }
        catch (error) {
            res.status(500).send({ message: "Internal server error" });
        }
    }
    else {
        // Passwords don't match
        res
            .status(400)
            .send({ success: "failed", message: "Passwords don't match" });
    }
});
exports.postSignup = postSignup;
// Handle GET request to retrieve the signup page
const getSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, path_2.absolutePath, "html", "signup.html");
    res.status(200).sendFile(filePath);
});
exports.getSignup = getSignup;
// Handle GET request to retrieve the login page
const getLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, path_2.absolutePath, "html", "login.html");
    res.status(200).sendFile(filePath);
});
exports.getLogin = getLogin;
// Handle POST request to log in a user
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    // Trim and convert email to lowercase for consistency
    email = email.trim().toLowerCase();
    try {
        // Find the user with the provided email
        const user = yield user_1.User.findOne({ where: { email: email } });
        if (user) {
            // Compare the provided password with the hashed password in the database
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (isMatch) {
                const secret = process.env.JWT_SECRET;
                // Create a JSON Web Token (JWT) for authentication
                const token = yield jsonwebtoken_1.default.sign({
                    id: user.userId,
                    email: user.email,
                    phone: user.phone,
                }, secret, { expiresIn: "1hr" });
                // Send a success response with the JWT
                res
                    .status(200)
                    .json({ success: "success", message: "Logged in", token: token });
            }
            else {
                // Unauthorized user (incorrect password)
                res.status(401).json({ message: "Unauthorized user" });
            }
        }
        else {
            // User not found
            res.status(401).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.postLogin = postLogin;
// Handle GET request to retrieve the chat page
const getChatPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, path_2.absolutePath, "html", "chat.html");
    res.status(200).sendFile(filePath);
});
exports.getChatPage = getChatPage;
// Handle GET request to retrieve all users (for admin or chat functionality)
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (userId) {
        try {
            const allUsers = yield models_1.Contact.findAll({ where: { userId: userId } });
            res
                .status(200)
                .send({
                message: "Users posted",
                allUsers,
                ownerName: (_b = req.user) === null || _b === void 0 ? void 0 : _b.username,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
});
exports.getAllUsers = getAllUsers;
