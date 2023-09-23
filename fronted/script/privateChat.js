import { getoneToMessage, onLineUser, postMessage } from "./common.js";

// DOM Elements
const messageForm = document.getElementById("message-form");
let userDetails = JSON.parse(localStorage.getItem("userDetails"));
const user2_id = Number(userDetails.user2_id);

getoneToMessage(user2_id);
onLineUser(userDetails.username);
// Event listener to handle message submission
if (window.location.pathname === "/user/privateChat") {
  messageForm.addEventListener("submit", postMessage);
}
