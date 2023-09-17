// DOM Elements
const messageForm = document.getElementById("message-form");
const message = document.getElementById("message");
const messageBox = document.getElementById("message-box");
const allUsers = document.getElementById("all-users");
const allMembers = document.getElementById("all-group-users");
const activeUser = document.getElementById("active-user");
const addUserBtn = document.getElementById("add-user-btn");
const leftContainer = document.getElementById("left-container");
const leftMainContainer = document.getElementsByClassName("left-container");
const rightMainContainer = document.getElementsByClassName("right-container");
const rightContainer = document.getElementById("right-container");
const chatHeading = document.getElementById("chat-heading");
const memberHeading = document.getElementById("member-heading");

// API Base URL
const baseURL = "http://localhost:3000";

// User IDs
let user2_id = 0;
let groupId = 0;

// First-time flags
let firstTimeOneToOneMsg = true;

// Function to handle form submission
async function postMessage(event) {
  event.preventDefault();
  const details = { message: message.value };
  const token = localStorage.getItem("token");

  try {
    if (user2_id > 0) {
      const response = await axios.post(
        `${baseURL}/user/chat/oneToOne/msg/${user2_id}`,
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

// Function to retrieve and display one-to-one messages
async function getoneToMessage() {
  const token = localStorage.getItem("token");

  try {
    const response = await axios.get(
      `${baseURL}/user/chat/oneToOne/msg/${user2_id}`,
      {
        headers: { Authorization: token },
      }
    );

    messageBox.innerHTML = "";

    // Display new one-to-one messages
    response.data.oneToOneMsg.forEach((msg) => {
      const senderName =
        msg.senderId === response.data.user1_id
          ? "You"
          : response.data.username;
      displayMessage(
        senderName,
        msg.message,
        msg.senderId === response.data.user1_id ? "user" : "otheruser"
      );
    });

    scrollBarDown();
  } catch (error) {
    console.log(error);
  }
}

// Function to retrieve and display all users
async function getAllUsers() {
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
          "users"
        );
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to retrieve and display all group
async function getAllGroup() {
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
function displayGroup(groupName, groupId, adminId, adminName) {
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
  allUsers.appendChild(div);
}

allUsers.addEventListener("click", async (event) => {
  const mediaQuery = window.matchMedia("(max-width:992px)");

  if (mediaQuery.matches) {
    leftMainContainer[0].style.display = "none";
    rightMainContainer[0].style.display = "block";
  }

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

    // Highlight the selected user
    removeAllActiveUserClasses();
    userChatRow.classList.add("active-user-bg");

    // Load one-to-one messages for the selected user
    getoneToMessage();

    // Display user information
    onLineUser(userChatRow.parentElement.dataset.username);
    firstTimeOneToOneMsg = false;
  } else if (datasetConversationId && datasetConversationId) {
    const senderId = Number(datasersenderId);
    user2_id = senderId;

    // Highlight the selected user
    removeAllActiveUserClasses();
    userChatRow.classList.add("active-user-bg");

    // Load one-to-one messages for the selected user
    getoneToMessage();

    // Display user information
    onLineUser(userChatRow.parentElement.dataset.phone);
    firstTimeOneToOneMsg = false;
  } else {
    // Find the closest chat-row element with dataset.groupId and dataset.adminId
    if (userChatRow) {
      const group_id = userChatRow.parentElement.dataset.groupId;
      groupId = group_id;
      const groupDetail = {
        groupId: groupId,
        groupName: userChatRow.parentElement.dataset.groupName,
      };
      localStorage.setItem("groupDetail", JSON.stringify(groupDetail));

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

function removeAllActiveUserClasses() {
  const chatListItems = allUsers.querySelectorAll(".chat-row");
  chatListItems.forEach((item) => {
    item.classList.remove("active-user-bg");
  });
}

// Event listener to handle message submission
messageForm.addEventListener("submit", postMessage);

// Event listener to handle add-user-btn
addUserBtn.addEventListener("click", async (event) => {
  window.location.href = "/user/addUser";
});

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
getAllUnknownMsg();
getAllUsers();
getAllGroup();
eventTakePlaceOn(allUsers);
