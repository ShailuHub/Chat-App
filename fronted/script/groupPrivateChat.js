import { postGroupMessage, getGroupMessage } from "./groupChat.js";
import {
  onLineUser,
  displayMessage,
  scrollBarDown,
  socket,
  fileMessage,
} from "./common.js";

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
  socket.on("fileMessageForGroup", (data) => {
    if (groupDetails && groupDetails.groupId == data.groupId) {
      fileMessage(data.file.fileUrl, data.file.originalname, "otheruser");
      scrollBarDown();
    }
  });
  messageForm.addEventListener("submit", postGroupMessage);
}
