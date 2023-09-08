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
exports.getChatPage = exports.postLogin = exports.getLogin = exports.getSignup = exports.postSignup = void 0;
const path_1 = __importDefault(require("path"));
const path_2 = require("../utils/path");
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const saltRound = 10;
const postSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { username, email, password, confirm_password, phone } = req.body;
    username = username.trim().toLowerCase();
    email = email.trim().toLowerCase();
    if (password === confirm_password) {
        try {
            const user = yield user_1.User.findOne({ where: { email: email } });
            if (!user) {
                const hashPassword = yield bcrypt_1.default.hash(password, saltRound);
                try {
                    yield user_1.User.create({
                        username: username,
                        email: email,
                        password: hashPassword,
                        phone: phone,
                    });
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
                res.status(409).send({ success: "failed", message: "Email exists" });
            }
        }
        catch (error) {
            res.status(500).send({ message: "Internal server error" });
        }
    }
    else {
        res
            .status(400)
            .send({ success: "failed", message: "Password don't match" });
    }
});
exports.postSignup = postSignup;
const getSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, path_2.absolutePath, "html", "signup.html");
    res.status(200).sendFile(filePath);
});
exports.getSignup = getSignup;
const getLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, path_2.absolutePath, "html", "login.html");
    res.status(200).sendFile(filePath);
});
exports.getLogin = getLogin;
const postLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { email, password } = req.body;
    email = email.trim().toLowerCase();
    try {
        const user = yield user_1.User.findOne({ where: { email: email } });
        if (user) {
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (isMatch) {
                const secret = process.env.JWT_SECRET;
                const token = yield jsonwebtoken_1.default.sign({
                    id: user.id,
                    email: user.email,
                    phone: user.phone,
                }, secret, { expiresIn: "1hr" });
                res
                    .status(200)
                    .json({ success: "success", message: "Logged in", token: token });
            }
            else {
                res.status(401).json({ message: "Unauthorized user" });
            }
        }
        else {
            res.status(401).json({ message: "User not Found" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.postLogin = postLogin;
const getChatPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filePath = path_1.default.join(__dirname, path_2.absolutePath, "html", "chat.html");
    res.status(200).sendFile(filePath);
});
exports.getChatPage = getChatPage;
