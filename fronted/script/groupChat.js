import {
  onLineUser,
  eventTakePlaceOn,
  getOwnerName,
  displayMessage,
  displayUsers,
  scrollBarDown,
} from "./common.js";

// DOM Elements
const messageForm = document.getElementById("message-form");
const message = document.getElementById("message");
const messageBox = document.getElementById("message-box");
const allMembers = document.getElementById("all-group-users");
const addUserBtn = document.getElementById("add-user-btn");
const showAddMemberBtn = document.getElementById("custom-btn");
const deleteGroup = document.getElementById("delete-group-btn");

// Create a Socket.IO connection
let baseURL = "http://localhost:3000";
var socket = io();

let groupDetails = JSON.parse(localStorage.getItem("groupDetails"));
//let userDetails = JSON.parse(localStorage.getItem("userDetails"));

// First-time flags
let firstTimeOneToOneMsg = true;

// Function to handle form submission
export async function postGroupMessage(event) {
  event.preventDefault();
  const details = { message: message.value };
  const token = localStorage.getItem("token");
  if (groupDetails) {
    let groupId = Number(groupDetails.groupId);
    if (!isNaN(groupId)) {
      try {
        if (groupId > 0) {
          const response = await axios.post(
            `${baseURL}/user/chat/group/msg/${groupId}`,
            details,
            { headers: { Authorization: token } }
          );
          // Display the user's message
          displayMessage("You", details.message, "user");
          scrollBarDown();
          if (response.status === 200) {
            socket.emit("groupChat", response.data);
            messageForm.reset();
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

// Function to retrieve and display Group messages
export async function getGroupMessage() {
  const token = localStorage.getItem("token");
  if (groupDetails) {
    let groupId = Number(groupDetails.groupId);
    if (!isNaN(groupId)) {
      try {
        const response = await axios.get(
          `${baseURL}/user/chat/group/msg/${groupId}`,
          {
            headers: { Authorization: token },
          }
        );
        messageBox.innerHTML = "";
        // Display new one-to-one messages
        response.data.groupMsg.forEach((msg) => {
          const senderName =
            msg.senderId === response.data.userId ? "You" : msg.sendername;
          displayMessage(
            senderName,
            msg.message,
            msg.senderId === response.data.userId ? "user" : "otheruser"
          );
        });
        scrollBarDown();
      } catch (error) {
        console.error(error);
      }
    }
  }
}

// Function to retrieve and display all members of a group
export async function getGroupMember() {
  const token = localStorage.getItem("token");
  if (groupDetails) {
    let groupId = Number(groupDetails.groupId);
    if (groupId) {
      try {
        const response = await axios.get(
          `${baseURL}/user/get/group/${groupId}`,
          {
            headers: { Authorization: token },
          }
        );
        const adminId = response.data.adminId;
        getOwnerName(groupDetails.groupName);
        if (response.data.allMember.length > 0) {
          response.data.allMember.forEach((member) => {
            if (member.userId === adminId && member.isAdmin) {
              const showAddMemberBtn = document.getElementById("custom-btn");
              if (showAddMemberBtn && deleteGroup) {
                showAddMemberBtn.style.display = "block";
                deleteGroup.style.display = "block";
              }
            }
            displayUsers(
              member.User.username,
              member.userId,
              member.User.phone,
              member.isAdmin,
              Number(response.data.adminId),
              "members",
              member.User.isActive
            );
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
}

// Event listener to handle add-user-btn
if (addUserBtn) {
  addUserBtn.addEventListener("click", async (event) => {
    window.location.href = "/user/addUser";
  });
}
if (showAddMemberBtn) {
  showAddMemberBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`${baseURL}/user/searchOrAdd`);
      if (response.status === 200) {
        window.location.href = "/user/searchOrAdd";
      } else {
        window.location.href = "/user/chat";
      }
    } catch (error) {
      console.log(error);
    }
  });
}

if (deleteGroup) {
  deleteGroup.addEventListener("click", async () => {
    const token = localStorage.getItem("token");
    let groupId = Number(groupDetails.groupId);
    try {
      const response = await axios.get(
        `${baseURL}/user/delete/group/${groupId}`,
        {
          headers: { Authorization: token },
        }
      );
    } catch (error) {
      console.log(error);
    }
  });
}

// Initial data retrieval
if (window.location.pathname === "/user/group") {
  socket.on("msgForGroup", (data) => {
    if (groupDetails && groupDetails.groupId == data.groupId) {
      displayMessage(data.sendername, data.message, "otheruser");
      scrollBarDown();
    }
  });

  if (groupDetails) {
    onLineUser(groupDetails.groupName);
  }
  getGroupMember();
  getGroupMessage();
  eventTakePlaceOn(allMembers);
  // Event listener to handle message submission
  messageForm.addEventListener("submit", postGroupMessage);
}

export { allMembers };