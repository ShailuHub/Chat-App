const messageForm = document.getElementById("message-form");
const message = document.getElementById("message");
const baseURL = "http://localhost:3000";

messageForm.addEventListener("submit", postMessage);
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
    if (response.status === 200) {
      console.log("Message Posted");
    }
  } catch (error) {
    console.log(error);
  }
}
