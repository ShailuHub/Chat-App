// DOM Elements
const messageForm = document.getElementById("message-form");
const message = document.getElementById("message");
const messageBox = document.getElementById("message-box");
const allUsers = document.getElementById("all-users");
const activeUser = document.getElementById("active-user");
const addUserBtn = document.getElementById("add-user-btn");

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
    console.log(response.data);
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
        displayUsers(user.username, user.addedId, user.phone);
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

// Function to display a message in the message box
function displayMessage(username, message, user) {
  const div = document.createElement("div");
  div.classList.add("container");
  const p = document.createElement("p");
  p.innerHTML = `${username}: ${message}`;
  p.classList.add("text-light");
  div.appendChild(p);

  if (user === "user") {
    div.classList.add("user");
  }

  messageBox.appendChild(div);
}

// Function to display a user in the user list
function displayUsers(username, userId, phone) {
  const div = document.createElement("div");
  div.style.cursor = "pointer";
  div.innerHTML = `
    <div class="chat-row d-flex gap-3">
      <div class="row-img">
        <img src="../images/avatar.png" alt="avatar.png" style="width: 60px; height: 60px" />
      </div>
      <div class="d-flex flex-column text-light">
        <p>${username}</p>
        <p style="font-size: small; "><span>+91</span>-${phone}</p>
      </div>
      <div class="dropdown" style="display:none">
        <button class="dropdown-btn">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </button>
        <div class="dropdown-content">
          <a href="#" id="delete-contact">Delete Chat</a>
          <a href="#" id="remove-contact">Remove Contact</a>
          <a href="#" id="block">Block</a>
        </div>
      </div>
    </div>
    <hr class="text-success" />
  `;

  // Add the user ID as a dataset attribute
  div.dataset.userId = userId;
  div.dataset.username = username;
  div.dataset.phone = phone;
  allUsers.appendChild(div);
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
      <div class="dropdown" style="display:none">
        <button class="dropdown-btn">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </button>
        <div class="dropdown-content">
          <a href="#" id="delete-contact">Delete Chat</a>
          <a href="#" id="remove-contact">Remove Group</a>
        </div>
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

// Event listener to handle user selection and dropdowns
allUsers.addEventListener("mouseover", (event) => {
  const dropdown = event.target.closest(".chat-row");
  if (dropdown) {
    const dropdownDiv = dropdown.querySelector(".dropdown");
    dropdownDiv.style.display = "block";
  }
});

allUsers.addEventListener("mouseout", (event) => {
  const dropdown = event.target.closest(".chat-row");
  if (dropdown) {
    const dropdownDiv = dropdown.querySelector(".dropdown");
    dropdownDiv.style.display = "none";
  }
});

// Event listener for clicks on .dropdown-content using event delegation
allUsers.addEventListener("click", async (event) => {
  const toDeleteDiv = event.target.closest(".chat-row");
  const clickedAnchor = event.target.closest(".dropdown-content a");
  if (clickedAnchor && clickedAnchor.id === "delete-contact") {
    const deleteContainer = document.getElementById("delete-main-container");
    deleteContainer.style.display = "block";

    // Event listeners for cancel and delete actions
    const cancel = document.getElementById("cancel-delete-chat");
    const deleteChat = document.getElementById("delete-chat");

    if (cancel) {
      cancel.addEventListener("click", () => {
        window.location.href = "/user/chat";
      });
    }

    if (deleteChat && toDeleteDiv) {
      deleteChat.addEventListener("click", async (event) => {
        event.preventDefault();
        const userId = toDeleteDiv.parentElement.dataset.userId;
        const phone = toDeleteDiv.parentElement.dataset.phone;
        if (userId && phone) {
          const token = localStorage.getItem("token");
          try {
            const response = await axios.delete(
              `${baseURL}/user/delete/contact/${phone}/${userId}`,
              {
                headers: { Authorization: token },
              }
            );
            if (response.status === 200) {
              window.location.href = "/user/chat";
            } else {
              console.log("Something went wrong");
            }
          } catch (error) {
            console.log(error);
          }
        }
      });
    }
  }
});

allUsers.addEventListener("click", async (event) => {
  const token = localStorage.getItem("token");
  const clickedElement = event.target;
  // Find the closest chat-row element with dataset.userId
  const userChatRow = clickedElement.closest(".chat-row");
  if (userChatRow.parentElement.dataset.userId) {
    const userId = Number(userChatRow.parentElement.dataset.userId);
    user2_id = userId;
    // Highlight the selected user
    removeAllActiveUserClasses();
    userChatRow.classList.add("active-user-bg");

    // Load one-to-one messages for the selected user
    getoneToMessage();

    // Display user information
    onLineUser(userChatRow.parentElement.dataset.username);
    firstTimeOneToOneMsg = false;
  } else {
    // Find the closest chat-row element with dataset.groupId and dataset.adminId
    if (userChatRow) {
      const group_id = userChatRow.parentElement.dataset.groupId;
      const chatListItems = allUsers.querySelectorAll(".chat-row");
      groupId = group_id;

      removeAllActiveUserClasses();
      userChatRow.classList.add("active-user-bg");
      getGroupMessage();

      // Display group information
      onLineUser(userChatRow.parentElement.dataset.groupName);
    }
  }
  try {
    if (user2_id) {
      const response = await axios.get(
        `${baseURL}/user/chat/oneToOne/msg/${user2_id}`,
        {
          headers: { Authorization: token },
        }
      );
    }
  } catch (error) {
    console.error(error);
  }
});

function removeAllActiveUserClasses() {
  const chatListItems = allUsers.querySelectorAll(".chat-row");
  chatListItems.forEach((item) => {
    item.classList.remove("active-user-bg");
  });
}

// Function to scroll the message box to the bottom
function scrollBarDown() {
  messageBox.scrollTop = messageBox.scrollHeight;
}

// Event listener to handle message submission
messageForm.addEventListener("submit", postMessage);

// Event listener to handle add-user-btn
addUserBtn.addEventListener("click", async (event) => {
  window.location.href = "/user/addUser";
});

function getOwnerName(userName) {
  const ownerName = document.getElementById("owner-name");
  ownerName.textContent = userName;
}

function onLineUser(username) {
  const div = document.createElement("div");
  div.innerHTML = `
    <div class="chat-row d-flex">
      <div class="row-img">
        <img
          src="../images/avatar.png"
          alt="avatar.png"
          style="width: 60px; height: 60px"
        />
      </div>
      <div class="d-flex align-items-center text-light">
        <p>${username}</p>
      </div>
    </div>
    <hr class="text-success" />
  `;
  activeUser.innerHTML = "";
  activeUser.appendChild(div);
}

// Initial data retrieval
getAllUsers();
getAllGroup();
