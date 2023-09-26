// User IDs
let user2_id = 0;
let groupId = 0;
let userDetails = {};
let groupDetails = {};

import {
  getOwnerName,
  eventTakePlaceOn,
  displayUsers,
  getoneToMessage,
  onLineUser,
  postMessage,
  displayUnKnownUser,
} from "./common.js";

import { baseURL } from "./variable.js";

// DOM Elements
const messageForm = document.getElementById("message-form");
const messageBox = document.getElementById("message-box");
const allUsers = document.getElementById("all-users");
const activeUser = document.getElementById("active-user");
const addUserBtn = document.getElementById("add-user-btn");
const logOutBtn = document.getElementById("log-out-btn");
const greetingText = document.getElementById("greeting");

//Function to log out
if (logOutBtn) {
  logOutBtn.addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "/user/login";
  });
}

// Function to retrieve and display all users
export async function getAllUsers() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${baseURL}/user/chat/list`, {
      headers: { Authorization: token },
    });

    getOwnerName(response.data.ownerName);

    if (response.data.allUsers.length > 0) {
      response.data.allUsers.forEach((user) => {
        displayUsers(
          user.username,
          user.addedId,
          user.phone,
          false,
          0,
          "users",
          user.User.isActive
        );
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to retrieve and display all group
export async function getAllGroup() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(`${baseURL}/user/get/group`, {
      headers: { Authorization: token },
    });

    if (response.data.allGroup.length > 0) {
      response.data.allGroup.forEach((group) => {
        displayGroup(
          group.GroupChat.groupName,
          group.groupId,
          group.adminId,
          group.GroupChat.User.username
        );
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to display a group in the user list
export function displayGroup(groupName, groupId, adminId, adminName) {
  const div = document.createElement("div");
  div.style.cursor = "pointer";
  div.innerHTML = `
    <div class="chat-row d-flex gap-3">
      <div class="row-img">
        <img src="../images/group-icon.png" alt="avatar.png" style="width: 60px; height: 60px;border-radius:50%" />
      </div>
      <div class="d-flex flex-column text-light">
        <p>${groupName}</p>
        <p style="font-size: small; "><span>created by</span> ${adminName}</p>
      </div>
    </div>
    <hr class="text-success" />
  `;

  // Add the user ID as a dataset attribute
  div.dataset.groupId = groupId;
  div.dataset.groupName = groupName;
  div.dataset.adminId = adminId;
  if (allUsers) {
    allUsers.appendChild(div);
  }
}
if (allUsers) {
  allUsers.addEventListener("click", async (event) => {
    messageForm.style.display = "block";
    greetingText.style.display = "none";
    const token = localStorage.getItem("token");
    const clickedElement = event.target;

    // Find the closest chat-row element with dataset.userId
    const userChatRow = clickedElement.closest(".chat-row");
    const datasetuserId = userChatRow.parentElement.dataset.userId;
    const datasersenderId = userChatRow.parentElement.dataset.senderId;
    const datasetConversationId =
      userChatRow.parentElement.dataset.conversationId;
    if (datasetuserId && !datasetConversationId) {
      const userId = Number(datasetuserId);
      user2_id = userId;
      userDetails.user2_id = userId;
      userDetails.username = userChatRow.parentElement.dataset.username;
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      const mediaQuery = window.matchMedia("(max-width:992px)");
      if (mediaQuery.matches) {
        window.location.href = "/user/privateChat";
      } else {
        // Highlight the selected user
        removeAllActiveUserClasses();
        userChatRow.classList.add("active-user-bg");

        // Load one-to-one messages for the selected user
        getoneToMessage(user2_id);

        // Display user information
        onLineUser(userChatRow.parentElement.dataset.username);
      }
    } else if (datasetConversationId && datasetConversationId) {
      const senderId = Number(datasersenderId);
      localStorage.setItem("senderId", senderId);

      const mediaQuery = window.matchMedia("(max-width:992px)");
      if (mediaQuery.matches) {
        window.location.href = "/user/privateChat";
      } else {
        // Highlight the selected user
        removeAllActiveUserClasses();
        userChatRow.classList.add("active-user-bg");

        // Load one-to-one messages for the selected user
        getoneToMessage(senderId);

        // Display user information
        onLineUser(userChatRow.parentElement.dataset.phone);
      }
    } else {
      // Find the closest chat-row element with dataset.groupId and dataset.adminId
      if (userChatRow) {
        const group_id = userChatRow.parentElement.dataset.groupId;
        groupId = group_id;
        groupDetails = {
          groupId: groupId,
          groupName: userChatRow.parentElement.dataset.groupName,
        };
        localStorage.setItem("groupDetails", JSON.stringify(groupDetails));
        removeAllActiveUserClasses();
        userChatRow.classList.add("active-user-bg");

        try {
          const response = await axios.get(`${baseURL}/user/group`);

          if (response.status === 200) {
            window.location.href = "/user/group";
          } else {
            console.log("Something went wrong");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    try {
      if (user2_id) {
        await axios.get(`${baseURL}/user/chat/oneToOne/msg/${user2_id}`, {
          headers: { Authorization: token },
        });
      }
    } catch (error) {
      console.log(error);
    }
  });
}
export function removeAllActiveUserClasses() {
  const chatListItems = allUsers.querySelectorAll(".chat-row");
  chatListItems.forEach((item) => {
    item.classList.remove("active-user-bg");
  });
}

// Event listener to handle add-user-btn
if (addUserBtn) {
  addUserBtn.addEventListener("click", async (event) => {
    window.location.href = "/user/addUser";
  });
}

async function getAllUnknownMsg() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${baseURL}/user/chat/msg/unknown`, {
      headers: { Authorization: token },
    });

    if (response.status === 200) {
      response.data.allUnKnownMsg.forEach((msg) => {
        if (msg.length > 0) {
          const length = msg.length;
          const lastMsg = msg[length - 1];
          displayUnKnownUser(
            lastMsg.User.phone,
            lastMsg.message,
            lastMsg.senderId,
            lastMsg.conversationId,
            response.data.userId
          );
        }
      });
    } else {
      console.log("Something went wrong");
    }
  } catch (error) {
    console.log(error);
  }
}

// Initial data retrieval

if (window.location.pathname === "/user/chat") {
  getAllUnknownMsg();
  getAllUsers();
  getAllGroup();
  eventTakePlaceOn(allUsers);
  // Event listener to handle message submission
  messageForm.addEventListener("submit", postMessage);
}

export { userDetails, allUsers, messageBox, activeUser, messageForm };
