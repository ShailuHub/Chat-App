"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
// Import AWS
const aws_sdk_1 = __importDefault(require("aws-sdk"));
// Create a function that will upload a file to S3
const uploadToS3 = (data, filename) => {
    // Authentication requirements
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const I_AM_USER = process.env.I_AM_USER;
    const SECRET_KEY = process.env.I_AM_USER_KEY;
    // Create an authenticated AWS object
    const awsObj = new aws_sdk_1.default.S3({
        accessKeyId: I_AM_USER,
        secretAccessKey: SECRET_KEY,
    });
    // Check if data.buffer is defined and not empty
    if (!data || !data.buffer) {
        return Promise.reject(new Error("Invalid file data"));
    }
    // Create the parameters that we have to pass to the AWS object
    const params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: "public-read",
    };
    // Return a promise
    return new Promise((resolve, reject) => {
        awsObj.upload(params, (err, response) => {
            if (err) {
                console.log(err);
                reject(err);
            }
            else {
                resolve(response.Location);
            }
        });
    });
};
exports.uploadToS3 = uploadToS3;
