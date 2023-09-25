import { allUsers } from "./chat.js";
import { baseURL } from "./variable.js";
import { displayUsers } from "./common.js";

const showAddMemberBtn = document.getElementById("custom-btn");

const groupDetails = JSON.parse(localStorage.getItem("groupDetails"));

async function showRemainingContacts() {
  // Get the user's token from local storage
  const token = localStorage.getItem("token");

  // Clear the user list
  allUsers.innerHTML = "";

  try {
    // Fetch the list of all users
    const response = await axios.get(
      `${baseURL}/user/remaining/chat/list/${groupDetails.groupId}`,
      {
        headers: { Authorization: token },
      }
    );
    console.log(response.data.contacts.length);
    if (response.data.contacts.length > 0) {
      // Display each user in the list
      console.log("Hello");
      response.data.contacts.forEach((user) => {
        displayUsers(user.username, user.addedId, user.phone, "add");
      });
    } else {
      const noContacts = document.getElementById("no-contacts");
      noContacts.style.display = "block";
    }
  } catch (error) {
    console.error(error);
  }
}

if (window.location.pathname === "/user/searchOrAdd") {
  console.log("Hello22");
  showRemainingContacts();
}
