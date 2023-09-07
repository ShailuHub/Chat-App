"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const routes_1 = require("./routes");
const database_1 = __importDefault(require("./utils/database"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "..", "fronted")));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use(routes_1.userRouter);
database_1.default
    .sync()
    .then(() => {
    app.listen(3000, () => {
        console.log("server is working on the port 3000");
    });
})
    .catch((err) => {
    console.log(err);
});
