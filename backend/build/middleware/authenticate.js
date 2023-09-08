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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.headers.authorization;
    try {
        const secret = process.env.JWT_SECRET;
        if (token && secret) {
            const decToken = (yield jsonwebtoken_1.default.verify(token, secret));
            const user = yield user_1.User.findOne({ where: { id: decToken.id } });
            if (user) {
                req.user = user;
            }
            else {
                throw new Error("User not found");
            }
            next();
        }
        else {
            throw new Error("JWT secret or Token is not defined");
        }
    }
    catch (error) {
        console.log(error);
        res.status(401).send({ mesage: "Unathorized user" });
    }
});
exports.default = authenticate;
