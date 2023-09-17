// DOM Elements
const messageForm = document.getElementById("message-form");
const message = document.getElementById("message");
const messageBox = document.getElementById("message-box");
const allMembers = document.getElementById("all-group-users");
const addUserBtn = document.getElementById("add-user-btn");
const activeUser = document.getElementById("active-user");
const leftContainer = document.getElementById("left-container");
const rightContainer = document.getElementById("right-container");
const memberHeading = document.getElementById("member-heading");

// API Base URL
const baseURL = "http://localhost:3000";

// User IDs
const groupDetail = JSON.parse(localStorage.getItem("groupDetail"));
let groupId = Number(groupDetail.groupId);

// First-time flags
let firstTimeOneToOneMsg = true;

// Function to handle form submission
async function postMessage(event) {
  event.preventDefault();
  const details = { message: message.value };
  const token = localStorage.getItem("token");
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
        messageForm.reset();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to retrieve and display Group messages
async function getGroupMessage() {
  const token = localStorage.getItem("token");
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

// Function to retrieve and display all members of a group
async function getGroupMember() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${baseURL}/user/get/group/${groupId}`, {
      headers: { Authorization: token },
    });
    if (response.data.allMember.length > 0) {
      response.data.allMember.forEach((member) => {
        displayUsers(
          member.User.username,
          member.userId,
          member.User.phone,
          member.isAdmin,
          Number(response.data.adminId),
          "members"
        );
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// Event listener to handle message submission
messageForm.addEventListener("submit", postMessage);

// Event listener to handle add-user-btn
addUserBtn.addEventListener("click", async (event) => {
  window.location.href = "/user/addUser";
});

// Initial data retrieval
onLineUser(groupDetail.groupName);
getGroupMember();
getGroupMessage();
eventTakePlaceOn(allMembers);
