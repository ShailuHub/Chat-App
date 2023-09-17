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
function displayUsers(username, userId, phone, isAdmin, adminId, type) {
  const div = document.createElement("div");
  div.style.cursor = "pointer";
  div.innerHTML = `
      <div class="chat-row d-flex gap-3">
        <div class="row-img">
          <img src="../images/avatar.png" alt="avatar.png" style="width: 60px; height: 60px" />
        </div>
        <div class="d-flex flex-column text-light" style="width:50%">
          <p>${username}</p>
          <div class="d-flex justify-content-between">
            <p style="font-size: small;"><span>+91</span>-${phone}</p>
            ${
              type === "members"
                ? `<p class="mr-5" >${
                    isAdmin === false
                      ? ``
                      : `<span class="text-success">admin</span>`
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
              : `<a href="#" id="remove-contact">Remove Contact</a>`
          }
          ${
            type === "users"
              ? ``
              : `<a href="/user/group" id="make-admin">Make Admin</a>`
          }
          ${
            type === "users"
              ? ``
              : `<a href="#" id="remove-admin">Remove Admin</a>`
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
    allMembers.appendChild(div);
  }
  if (type === "users") {
    div.dataset.userId = userId;
    div.dataset.username = username;
    div.dataset.phone = phone;
    allUsers.appendChild(div);
  }
}

// Function to display an unknown user
function displayUnKnownUser(phone, msg, senderId, conversationId, userId) {
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
  allUsers.appendChild(div);
}

// Function to scroll the message box to the bottom
function scrollBarDown() {
  messageBox.scrollTop = messageBox.scrollHeight;
}

// Function to display the owner's name
function getOwnerName(userName) {
  const ownerName = document.getElementById("owner-name");
  ownerName.textContent = userName;
}

// Function to handle events on user selection and dropdowns
function eventTakePlaceOn(evetnOn) {
  // Event listener to show dropdown on mouseover
  evetnOn.addEventListener("mouseover", (event) => {
    const dropdown = event.target.closest(".chat-row");
    if (dropdown) {
      const dropdownDiv = dropdown.querySelector(".dropdown");
      dropdownDiv.style.display = "block";
    }
  });

  // Event listener to hide dropdown on mouseout
  evetnOn.addEventListener("mouseout", (event) => {
    const dropdown = event.target.closest(".chat-row");
    if (dropdown) {
      const dropdownDiv = dropdown.querySelector(".dropdown");
      dropdownDiv.style.display = "none";
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
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
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

// Display the active user name in the right container message box
function onLineUser(username) {
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
