import { postGroupMessage, getGroupMessage } from "./groupChat.js";
import { socket, onLineUser, displayMessage, scrollBarDown } from "./common.js";

// DOM Elements
const messageForm = document.getElementById("message-form");
let groupDetails = JSON.parse(localStorage.getItem("groupDetails"));
const groupId = Number(groupDetails.groupId);
const ownerName = localStorage.getItem("ownerName");
getGroupMessage(groupId);
onLineUser(groupDetails.groupName);
// Event listener to handle message submission
if (window.location.pathname === "/group/privateChat") {
  socket.on("msgForGroup", (data) => {
    if (
      groupDetails &&
      groupDetails.groupId == data.groupId &&
      ownerName !== data.sendername
    ) {
      displayMessage(data.sendername, data.message, "otheruser");
      scrollBarDown();
    }
  });
  messageForm.addEventListener("submit", postGroupMessage);
}
