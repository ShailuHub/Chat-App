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
console.log("Hwllo World");
const variable_1 = require("./variable");
const axios_1 = __importDefault(require("axios"));
variable_1.form.addEventListener("submit", postUserDetails);
function postUserDetails(event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        const details = {
            username: variable_1.username.value,
            email: variable_1.email.value,
            password: variable_1.password.value,
            confirm_password: variable_1.confirm_password.value,
            phone: variable_1.phone.value,
        };
        try {
            const response = yield axios_1.default.post(`${variable_1.baseURL}/user/signup`, details);
            // if (response.status === 202) {
            //   // Redirect to the login page after a delay
            //   setTimeout(() => {
            //     window.location.href = "/user/login";
            //   }, 3000);
            // } else {
            //   window.location.href = "/user/signup";
            // }
        }
        catch (error) {
            console.log(error);
        }
    });
}
