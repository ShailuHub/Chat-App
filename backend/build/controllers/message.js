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
exports.postMessage = void 0;
const index_1 = require("../models/index");
const postMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { message } = req.body;
    if (userId) {
        try {
            yield index_1.Message.create({
                message,
                userId,
            });
            res
                .status(200)
                .send({ message: "Message table created and message posted" });
        }
        catch (error) {
            console.log(error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
});
exports.postMessage = postMessage;