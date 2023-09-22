import { getoneToMessage, onLineUser } from "./common.js";

// DOM Elements
const messageForm = document.getElementById("message-form");
let userDetails = JSON.parse(localStorage.getItem("userDetails"));
const user2_id = Number(userDetails.user2_id);

getoneToMessage(user2_id);
onLineUser(userDetails.username);
// Event listener to handle message submission
messageForm.addEventListener("submit", postMessage);
