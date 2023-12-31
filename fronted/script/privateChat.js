import {
  getoneToMessage,
  onLineUser,
  postMessage,
  displayMessage,
  scrollBarDown,
  socket,
  fileMessage,
} from "./common.js";

// DOM Elements
const messageForm = document.getElementById("message-form");
let userDetails = JSON.parse(localStorage.getItem("userDetails"));

let user2_id = 0;
let username = "Anonymous";
if (userDetails) {
  user2_id = Number(userDetails.user2_id);
  username = userDetails.username;
} else {
  user2_id = Number(localStorage.getItem("senderId"));
}
getoneToMessage(user2_id);
onLineUser(username);
// Event listener to handle message submission
if (window.location.pathname === "/user/privateChat") {
  const ownerId = localStorage.getItem("ownerId");
  socket.on("msgFor", (data) => {
    if (data.recieverId == ownerId && data.senderId == user2_id) {
      displayMessage(data.sendername, data.message, "otheruser");
      scrollBarDown();
    }
  });

  socket.on("fileMsg", (data) => {
    console.log(data);
    if (data.user2_id == ownerId) {
      fileMessage(data.file.fileUrl, data.file.originalname, "otheruser");
      scrollBarDown();
    }
  });

  messageForm.addEventListener("submit", postMessage);
}
