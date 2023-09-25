import { baseURL } from "./variable.js";
// Get references to HTML elements
const allUsers = document.getElementById("all-users");
const createGroupBtn = document.getElementById("newGroupBtn");
const createContactBtn = document.getElementById("newContactBtn");
const chatListContainer = document.getElementById("chat-list-container");
const newContactContainer = document.getElementById("new-contact-container");
const addUserGroupContainer = document.getElementById("add-user-grp");
const directionToUser = document.getElementById("direction-to-user");
const phone = document.getElementById("phone");
const username = document.getElementById("username");
const nextBtn = document.getElementById("next-btn");
const form = document.getElementById("form");

let type = "create";
// Event listener for form submission
if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get the user's token from local storage
    const token = localStorage.getItem("token");

    // Prepare user details from form inputs
    const details = {
      phone: phone.value,
      username: username.value,
    };

    try {
      // Send a POST request to create a contact
      const response = await axios.post(
        `${baseURL}/user/createContact`,
        details,
        {
          headers: { Authorization: token },
        }
      );

      if (response.status === 200) {
        window.location.href = "/user/chat";
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 405) {
        // Handle specific error cases with appropriate messages
        const phoneUnsuccess = document.getElementById("phone-unsuccess");
        directionToUser.style.display = "none";
        phoneUnsuccess.style.display = "block";
        form.reset();
        setTimeout(() => {
          phoneUnsuccess.style.display = "none";
          directionToUser.style.display = "block";
        }, 2000);
      } else if (error.response && error.response.status === 405) {
        const internalUnsuccess = document.getElementById("internal-unsuccess");
        directionToUser.style.display = "none";
        internalUnsuccess.style.display = "block";
        form.reset();
        setTimeout(() => {
          internalUnsuccess.style.display = "none";
          directionToUser.style.display = "block";
        }, 2000);
      }
    }
  });
}

if (createGroupBtn) {
  // Event listener for creating a group
  createGroupBtn.addEventListener("click", async () => {
    // Display user list and hide other containers
    const pTag = document.querySelector("p");
    pTag.style.display = "block";
    addUserGroupContainer.style.display = "none";
    newContactContainer.style.display = "none";
    chatListContainer.style.display = "block";

    // Get the user's token from local storage
    const token = localStorage.getItem("token");

    // Clear the user list
    allUsers.innerHTML = "";

    try {
      // Fetch the list of all users
      const response = await axios.get(`${baseURL}/user/chat/list`, {
        headers: { Authorization: token },
      });

      if (response.data.allUsers.length > 0) {
        // Display each user in the list
        response.data.allUsers.forEach((user) => {
          displayUsers(user.username, user.addedId, user.phone, "create");
        });
      }
    } catch (error) {
      console.error(error);
    }
  });
}

if (createContactBtn) {
  // Event listener for creating a contact
  createContactBtn.addEventListener("click", () => {
    // Show the new contact container and hide the user list
    chatListContainer.style.display = "none";
    newContactContainer.style.display = "block";
  });
}
// Function to display a user in the user list
function displayUsers(username, userId, phone, type) {
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
    </div>
    <hr class="text-success" />
  `;

  // Add user information as dataset attributes
  div.dataset.userId = userId;
  div.dataset.username = username;
  div.dataset.phone = phone;
  div.dataset.type = type;
  allUsers.appendChild(div);
}

// Event listener to handle user selection
allUsers.addEventListener("click", (event) => {
  let parentDiv = event.target;
  while (parentDiv && !parentDiv.dataset.userId) {
    parentDiv = parentDiv.parentElement;
  }
  type = parentDiv.dataset.type;
  const firstChild = parentDiv.querySelector(".chat-row");
  if (firstChild.classList.contains("active-user-bg")) {
    firstChild.classList.remove("active-user-bg");
  } else {
    firstChild.classList.add("active-user-bg");
    nextBtn.style.display = "inline-block";
  }
});

// Event listener for creating a group
nextBtn.addEventListener("click", async () => {
  const groupIdArray = [];

  // Get selected users from the user list
  const chatListItems = allUsers.querySelectorAll(".chat-row");
  chatListItems.forEach((item) => {
    if (item.classList.contains("active-user-bg")) {
      groupIdArray.push(item.parentElement.dataset.userId);
    }
  });

  if (groupIdArray.length <= 0) {
    alert("No contact has selected");
    window.location.href = "/user/addUser";
  }
  // Display the create group container if hidden
  const createGroupContainer = document.getElementById(
    "create-group-container"
  );
  const addGroupContainer = document.getElementById("add-group-container");
  if (type === "create" && createGroupContainer.style.display === "none") {
    createGroupContainer.style.display = "block";
  }
  if (type === "add" && addGroupContainer.style.display === "none") {
    addGroupContainer.style.display = "block";
  }
  const createBtn = document.getElementById("create-group-btn");
  const addGroupBtn = document.getElementById("add-group-btn");

  createBtn.addEventListener("click", async (event) => {
    event.preventDefault();

    // Get the user's token from local storage
    const token = localStorage.getItem("token");

    // Get the group name from the input field
    const groupName = document.getElementById("groupName").value;

    try {
      // Send a POST request to create a group
      const response = await axios.post(
        `${baseURL}/user/create/group/${groupName}`,
        {},
        {
          headers: { Authorization: token },
        }
      );

      try {
        // Send a POST request to add selected users to the group
        const response = await axios.post(
          `${baseURL}/user/create/group`,
          { groupIdArray, groupName: groupName },
          {
            headers: { Authorization: token },
          }
        );
        if (response.status === 200) {
          window.location.href = "/user/chat";
        } else {
          window.location.href = "/user/addUser";
        }
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  });
  const cancelBtn = document.getElementById("cancel-create-group");
  const cancelAddGroupBtn = document.getElementById("cancel-add-group");
  cancelAddGroupBtn.addEventListener("click", () => {
    if (addGroupContainer.style.display === "block") {
      addGroupContainer.style.display = "none";
    }
  });
  cancelBtn.addEventListener("click", () => {
    if (createGroupContainer.style.display === "block") {
      createGroupContainer.style.display = "none";
    }
  });
});
