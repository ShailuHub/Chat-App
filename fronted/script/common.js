// Import necessary modules and components
import { allUsers, messageBox, activeUser, messageForm } from "./chat.js";
import { allMembers } from "./groupChat.js";
import { userDetails, emojiBtn } from "./chat.js";

const pickerOptions = {
  onEmojiSelect: handleEmojiSelect,
};
const emojiPicker = new EmojiMart.Picker(pickerOptions);

let isPickerVisible = false;
emojiBtn.addEventListener("click", () => {
  const emojiContainer = document.getElementById("emojiContainer");
  if (!isPickerVisible) {
    emojiContainer.appendChild(emojiPicker);
    isPickerVisible = true;
  } else {
    emojiPicker.remove();
    isPickerVisible = false;
  }
});

function handleEmojiSelect(emoji) {
  const message = document.getElementById("message");
  message.value += emoji.native;
}

// Create a Socket.IO connection
let socket = io("/", {
  auth: {
    ownerId: localStorage.getItem("ownerId"),
  },
});

// API Base URL
let baseURL = "http://65.1.107.213:3000";

// Function to display a message in the message box
export function displayMessage(username, message, user) {
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

// Function to handle form submission
export async function postMessage(event) {
  event.preventDefault();
  const details = { message: message.value };
  const token = localStorage.getItem("token");
  let user2_id = 0;
  if (Object.keys(userDetails).length > 0) {
    user2_id = Number(userDetails.user2_id);
  } else {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    if (userDetails) {
      user2_id = Number(userDetails.user2_id);
    } else {
      user2_id = Number(localStorage.getItem("senderId"));
    }
  }
  try {
    if (user2_id > 0) {
      const response = await axios.post(
        `${baseURL}/user/chat/oneToOne/msg/${user2_id}`,
        details,
        { headers: { Authorization: token } }
      );
      if (response.status === 200) {
        socket.emit("oneToOneMsg", response.data);
        // Display the user's message
        displayMessage("You", details.message, "user");
        scrollBarDown();
        emojiPicker.remove();
        messageForm.reset();
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to retrieve and display one-to-one messages
export async function getoneToMessage(user2_id) {
  const token = localStorage.getItem("token");

  try {
    // Send a request to retrieve messages (you can still use the axios request for initial load)
    const response = await axios.get(
      `${baseURL}/user/chat/oneToOne/msg/${user2_id}`,
      {
        headers: { Authorization: token },
      }
    );
    messageBox.innerHTML = "";

    //Display existing one-to-one messages (as you were doing before)
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

    // Listen for new messages in real-time using Socket.IO
    socket.on("oneToOneMsg", (data) => {
      const senderName =
        data.messages.senderId === data.user1_id ? "You" : data.username;
      displayMessage(
        senderName,
        data.messages.message,
        data.messages.senderId === data.user1_id ? "user" : "otheruser"
      );

      scrollBarDown();
    });
  } catch (error) {
    console.log(error);
  }
}

// Function to display a user in the user list
export function displayUsers(
  username,
  userId,
  phone,
  isAdmin,
  adminId,
  type,
  isActive
) {
  const div = document.createElement("div");
  div.style.cursor = "pointer";
  div.innerHTML = `
  <div class="chat-row d-flex gap-3">
  <div class="row-img">
    <img src="../images/avatar.png" alt="avatar.png" style="width: 60px; height: 60px" />
  </div>
  <div class="d-flex flex-column text-light" style="width:50%">
    <div class="d-flex text-light gap-4">
      <p>${username}</p>
      ${
        type === "users"
          ? `
            <div id="status-${userId}">
              ${
                isActive === true
                  ? `<p class="text-primary">online</p>`
                  : `<p class="text-danger">offline</p>`
              }
            </div>`
          : ""
      }
      
    </div>
    <div class="d-flex justify-content-between">
      <p style="font-size: small;"><span>+91</span>-${phone}</p>
      ${
        type === "members"
          ? `<p class="mr-5" >${
              isAdmin === false ? `` : `<span class="text-success">admin</span>`
            }</p>`
          : ``
      }
    </div>
  </div>
  ${
    adminId === userId
      ? ``
      : `<div class="dropdown" style="display:none">
    <button class="dropdown-btn">
      <div class="dot"></div>
      <div class="dot"></div>
      <div class="dot"></div>
    </button>
    <div class="dropdown-content">
      ${
        type === "users"
          ? `<a href="#" id="delete-contact">Delete Contact</a>`
          : `<a href="#" id="remove-contact">Remove</a>`
      }
      
      ${
        type === "users"
          ? ``
          : `<a href="/user/group" id="make-admin">Make Admin</a>`
      }
      ${
        type === "users" ? `` : `<a href="#" id="remove-admin">Remove Admin</a>`
      }
    </div>
  </div>`
  }
</div>
<hr class="text-success" />

    `;
  if (type === "members") {
    div.dataset.userId = userId;
    div.dataset.username = username;
    div.dataset.phone = phone;
    div.dataset.isAdmin = isAdmin;
    if (allMembers) {
      allMembers.appendChild(div);
    }
  }
  if (type === "users") {
    div.dataset.userId = userId;
    div.dataset.username = username;
    div.dataset.phone = phone;
    if (allUsers) {
      allUsers.appendChild(div);
    }
  }
}

// Function to display an unknown user
export function displayUnKnownUser(
  phone,
  msg,
  senderId,
  conversationId,
  userId
) {
  const div = document.createElement("div");
  div.style.cursor = "pointer";
  div.innerHTML = `
      <div class="chat-row d-flex gap-3">
        <div class="row-img">
          <img src="../images/avatar.png" alt="avatar.png" style="width: 60px; height: 60px" />
        </div>
        <div class="d-flex flex-column text-light" style="width:50%">
          <p>${phone}</p>
          <div class="d-flex justify-content-between">
            <p style="font-size: small;">${msg}</p>
          </div>  
        </div>
        <div class="dropdown" style="display:none">
          <button class="dropdown-btn">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
          </button>
          <div class="dropdown-content">
            <a href="#" id="add-to-contact">Add to Contacts</a>
          </div>
        </div>  
      </div>
      <hr class="text-success" />
    `;
  div.dataset.senderId = senderId;
  div.dataset.userId = userId;
  div.dataset.phone = phone;
  div.dataset.conversationId = conversationId;
  if (allUsers) {
    allUsers.appendChild(div);
  }
}

// Function to scroll the message box to the bottom
export function scrollBarDown() {
  messageBox.scrollTop = messageBox.scrollHeight;
}

// Function to display the owner's name
export function getOwnerName(userName) {
  const ownerName = document.getElementById("owner-name");
  if (ownerName) {
    ownerName.textContent = userName;
  }
}

// Function to handle events on user selection and dropdowns
export function eventTakePlaceOn(evetnOn) {
  // Event listener to show dropdown on mouseover
  if (evetnOn) {
    evetnOn.addEventListener("mouseover", (event) => {
      const dropdown = event.target.closest(".chat-row");
      if (dropdown) {
        const dropdownDiv = dropdown.querySelector(".dropdown");
        if (dropdownDiv) {
          dropdownDiv.style.display = "block";
        }
      }
    });

    // Event listener to hide dropdown on mouseout
    evetnOn.addEventListener("mouseout", (event) => {
      const dropdown = event.target.closest(".chat-row");
      if (dropdown) {
        const dropdownDiv = dropdown.querySelector(".dropdown");
        if (dropdownDiv) {
          dropdownDiv.style.display = "none";
        }
      }
    });

    // Event listener for clicks on .dropdown-content using event delegation
    evetnOn.addEventListener("click", async (event) => {
      event.preventDefault();
      const toDeleteDiv = event.target.closest(".chat-row");
      const clickedAnchor = event.target.closest(".dropdown-content a");
      const deleteContainer = document.getElementById("delete-main-container");
      // Event listeners for cancel and delete actions
      const cancel = document.getElementById("cancel-delete-chat");
      const deleteChat = document.getElementById("delete-chat");

      if (clickedAnchor && clickedAnchor.id === "delete-contact") {
        deleteContainer.style.display = "block";

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
                localStorage.removeItem("userDetails");
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

      if (clickedAnchor && clickedAnchor.id === "make-admin") {
        const userId = Number(toDeleteDiv.parentElement.dataset.userId);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.patch(
            `${baseURL}/user/make/admin/${userId}`,
            {},
            {
              headers: { Authorization: token },
            }
          );
          if (response.status === 200) {
            window.location.href = "/user/group";
          } else {
            console.log("Something went wrong");
          }
        } catch (error) {
          console.log(error);
          if (error.response && error.response.status === 401) {
            alert("You are not an admin");
          }
        }
      }

      if (clickedAnchor && clickedAnchor.id === "remove-admin") {
        const userId = Number(toDeleteDiv.parentElement.dataset.userId);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.patch(
            `${baseURL}/user/remove/admin/${userId}`,
            {},
            {
              headers: { Authorization: token },
            }
          );
          if (response.status === 200) {
            window.location.href = "/user/group";
          } else {
            console.log("Something went wrong");
          }
        } catch (error) {
          console.log(error);
          if (error.response && error.response.status === 401) {
            alert("You are not an admin");
          }
        }
      }

      if (clickedAnchor && clickedAnchor.id === "remove-contact") {
        const userId = Number(toDeleteDiv.parentElement.dataset.userId);
        console.log(userId);
        try {
          const token = localStorage.getItem("token");
          const response = await axios.delete(
            `${baseURL}/user/remove/contact/${userId}`,
            {
              headers: { Authorization: token },
            }
          );
          if (response.status === 200) {
            window.location.href = "/user/group";
          } else {
            console.log("Something went wrong");
          }
        } catch (error) {
          console.log(error);
          if (error.response && error.response.status === 401) {
            alert("You are not an admin");
          }
          if (error.response && error.response.status === 404) {
            alert("Member not Found");
          }
        }
      }

      if (clickedAnchor && clickedAnchor.id === "add-to-contact") {
        const phone = toDeleteDiv.parentElement.dataset.phone;
        localStorage.setItem("addToContact", phone);
        try {
          const response = await axios.get(`${baseURL}/user/toContact`);
          if (response.status === 200) {
            window.location.href = "/user/toContact";
          } else {
            window.location.href = "/user/chat";
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
}

// Display the active user name in the right container message box
export function onLineUser(username) {
  const div = document.createElement("div");
  div.innerHTML = `
    <div class="chat-row d-flex">
      <div class="row-img">
        <img src="../images/avatar.png" alt="avatar.png" style="width: 60px; height: 60px" />
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

if (window.location.pathname === "/user/chat") {
  // Attach ownerId to the socket when connecting
  socket.on("connect", () => {
    console.log("Connected to socket.io");
  });

  // Send the ownerId when the user disconnects
  socket.on("disconnect", () => {
    console.log("Socket.io disconnected");
  });

  // Handle incoming one-to-one messages
  socket.on("msgFor", (data) => {
    const ownerId = localStorage.getItem("ownerId");

    let user2_id = 0;
    if (Object.keys(userDetails).length > 0) {
      user2_id = userDetails.user2_id;
    } else {
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));
      user2_id = userDetails.user2_id;
    }

    if (data.recieverId == ownerId && data.senderId == user2_id) {
      displayMessage(data.sendername, data.message, "otheruser");
      scrollBarDown();
    }
  });

  // Handle user connect events
  socket.on("userConnect", (data) => {
    const { userId, active } = data;
    const statusElement = document.querySelector(`#status-${userId}`);
    if (statusElement) {
      statusElement.innerHTML = `<p class="text-primary">online</p>`;
    }
  });

  // Handle user disconnect events
  socket.on("userDisconnect", (data) => {
    const { userId, active } = data;
    const statusElement = document.querySelector(`#status-${userId}`);
    if (statusElement) {
      statusElement.innerHTML = `<p class="text-danger">offline</p>`;
    }
  });
}

export { baseURL, socket };
