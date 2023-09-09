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
exports.getMessage = exports.postMessage = void 0;
const index_1 = require("../models/index");
const sequelize_1 = __importDefault(require("sequelize"));
const postMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { message } = req.body;
    if (userId) {
        try {
            yield index_1.Message.create({
                username: (_b = req.user) === null || _b === void 0 ? void 0 : _b.username,
                message,
                userId,
            });
            res.status(200).send({
                message: "Message table created and message posted",
                username: (_c = req.user) === null || _c === void 0 ? void 0 : _c.username,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
});
exports.postMessage = postMessage;
const getMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const userId = (_d = req.user) === null || _d === void 0 ? void 0 : _d.id;
    const lastMsgId = Number(req.params.lastMsgId);
    if (userId) {
        try {
            // Use Sequelize's where clause to filter messages with IDs greater than lastMsgId
            const allMessage = yield index_1.Message.findAll({
                where: {
                    id: {
                        [sequelize_1.default.Op.gt]: lastMsgId,
                    },
                },
            });
            res.status(200).send({ message: "Message Posted", allMessage, userId });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
    else {
        res.status(401).send({ message: "Unauthorised user" });
    }
});
exports.getMessage = getMessage;
