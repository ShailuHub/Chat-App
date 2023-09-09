const messageForm = document.getElementById("message-form");
const message = document.getElementById("message");
const messageBox = document.getElementById("message-box");
const senderName = document.getElementById("sender-name");
const allUsers = document.getElementById("all-users");
const baseURL = "http://localhost:3000";

messageForm.addEventListener("submit", postMessage);

getAllUsers();
getMessage();
let firstTime = true;

async function postMessage(event) {
  event.preventDefault();
  const details = {
    message: message.value,
  };
  const token = localStorage.getItem("token");
  try {
    const response = await axios.post(`${baseURL}/user/chat`, details, {
      headers: { Authorization: token },
    });
    displayMessage(response.data.username, details.message, "user");
    scrollBarDown();
    if (response.status === 200) {
      messageForm.reset();
    }
  } catch (error) {
    console.log(error);
  }
}

async function getMessage() {
  const token = localStorage.getItem("token");
  try {
    let msgArray = [];
    if (localStorage.getItem("msgArray")) {
      msgArray = JSON.parse(localStorage.getItem("msgArray"));
    }
    let lastMsgId = 0;

    if (msgArray.length > 30) {
      msgArray = msgArray.splice(15);
    }

    if (msgArray.length > 0) {
      lastMsgId = msgArray[msgArray.length - 1].id;
    }

    const response = await axios.get(`${baseURL}/user/chat/msg/${lastMsgId}`, {
      headers: { Authorization: token },
    });

    //Will run for the first time
    if (firstTime && lastMsgId > 0) {
      msgArray.forEach((msg) => {
        if (msg.userId === response.data.userId) {
          displayMessage(msg.username, msg.message, "user");
        } else {
          displayMessage(msg.username, msg.message, "otheruser");
        }
      });
    }
    firstTime = false;

    //New msg list
    const newMsgLength = response.data.allMessage.length + lastMsgId;
    if (newMsgLength >= lastMsgId) {
      response.data.allMessage.forEach((msg) => {
        if (msg.userId === response.data.userId) {
          displayMessage(msg.username, msg.message, "user");
        } else {
          displayMessage(msg.username, msg.message, "otheruser");
        }
        lastMsgId = lastMsgId + 1;
        msgArray.push(msg);
      });
    }
    msgArray = JSON.stringify(msgArray);
    localStorage.setItem("msgArray", msgArray);
    scrollBarDown();
  } catch (error) {
    console.log(error);
  }
}

async function getAllUsers() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${baseURL}/user/chat/list`, {
      headers: { Authorization: token },
    });
    if (response.data.allUsers.length > 0) {
      response.data.allUsers.forEach((user) => {
        displayUsers(user.username);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

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

function displayUsers(username) {
  const div = document.createElement("div");
  div.innerHTML = `
  <div class="chat-row d-flex gap-3">
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
  allUsers.appendChild(div);
}

document.addEventListener("DOMContentLoaded", scrollBarDown);

function scrollBarDown() {
  messageBox.scrollTop = messageBox.scrollHeight;
}
