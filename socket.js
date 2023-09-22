// Import the Socket.io client library

// Connect to the Socket.io server (replace 'http://localhost:3000' with your server's URL)
const socket = io("http://localhost:3000");

// Add event listeners to handle messages from the server
socket.on("connect", () => {
  console.log("Connected to the server");
});

const data = { name: "Shailu", from: "Bihar" };
socket.emit("customEvent", data);

socket.on("sendEvent", (data) => {
  console.log(data);
});

// // // Emit events to the server
// // document.getElementById("sendButton").addEventListener("click", () => {
// //   const inputData = document.getElementById("inputField").value;
// //   socket.emit("customEvent", inputData);
// // });
