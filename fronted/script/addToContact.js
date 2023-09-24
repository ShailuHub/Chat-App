const form = document.getElementById("form");
const phoneInput = document.getElementById("phone");
const username = document.getElementById("username");
const chatListContainer = document.getElementById("chat-list-container");
const baseURL = "http://65.1.107.213:3000";

const phoneNumber = localStorage.getItem("addToContact");
phoneInput.value = phoneNumber;

// Event listener for form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get the user's token from local storage
  const token = localStorage.getItem("token");

  // Prepare user details from form inputs
  const details = {
    phone: phoneInput.value,
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
      const internalUnsuccess = document.getElementById("internal-unsuccess");
      directionToUser.style.display = "none";
      internalUnsuccess.style.display = "block";
      setTimeout(() => {
        internalUnsuccess.style.display = "none";
        directionToUser.style.display = "block";
      }, 2000);
    }
  }
});
