const showAddMemberBtn = document.getElementById("custom-btn");

const groupDetail = JSON.parse(localStorage.getItem("groupDetail"));

async function showRemainingContacts() {
  // Get the user's token from local storage
  const token = localStorage.getItem("token");

  // Clear the user list
  allUsers.innerHTML = "";

  try {
    // Fetch the list of all users
    const response = await axios.get(
      `${baseURL}/user/remaining/chat/list/${groupDetail.groupId}`,
      {
        headers: { Authorization: token },
      }
    );

    console.log(response.data);
    if (response.data.contacts.length > 0) {
      // Display each user in the list
      response.data.contacts.forEach((user) => {
        displayUsers(user.username, user.addedId, user.phone, "add");
      });
    }
  } catch (error) {
    console.error(error);
  }
}

showRemainingContacts();

// // Function to display a user in the user list
// function displayUsers(username, userId, phone) {
//   const div = document.createElement("div");
//   div.style.cursor = "pointer";
//   div.innerHTML = `
//       <div class="chat-row d-flex gap-3">
//         <div class="row-img">
//           <img src="../images/avatar.png" alt="avatar.png" style="width: 60px; height: 60px" />
//         </div>
//         <div class="d-flex flex-column text-light">
//           <p>${username}</p>
//           <p style="font-size: small; "><span>+91</span>-${phone}</p>
//         </div>
//       </div>
//       <hr class="text-success" />
//     `;

//   // Add user information as dataset attributes
//   div.dataset.userId = userId;
//   div.dataset.username = username;
//   div.dataset.phone = phone;
//   allUsers.appendChild(div);
// }
