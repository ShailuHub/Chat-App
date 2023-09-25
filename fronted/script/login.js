import {
  baseURL,
  email,
  password,
  signup_mainBtn,
  emailUnsuccess,
  internalUnsuccess,
  form,
} from "./variable.js";

// Event listeners
if (signup_mainBtn) {
  signup_mainBtn.addEventListener("click", () => {
    // Redirect to signup page
    window.location.href = "/user/signup";
  });
}

form.addEventListener("submit", postLoginDetails);

// Function to handle login form submission
async function postLoginDetails(event) {
  event.preventDefault();

  const details = {
    email: email.value,
    password: password.value,
  };

  try {
    const response = await axios.post(`${baseURL}/user/login`, details);

    // Store the token in localStorage
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("ownerId", response.data.ownerId);
    localStorage.setItem("ownerName", response.data.ownerName);

    if (response.status === 200) {
      // Redirect to chat page on successful login
      localStorage.removeItem("userDetails");
      localStorage.removeItem("groupDetails");
      window.location.href = "/user/chat";
    } else {
      // Redirect to login page on unsuccessful login
      window.location.href = "/user/login";
    }
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        // Display email validation message on 401 error
        emailUnsuccess.style.display = "block";
        setTimeout(() => {
          emailUnsuccess.style.display = "none";
        }, 3000);
      } else if (error.response.status === 500) {
        // Display internal server error message on 500 error
        internalUnsuccess.style.display = "block";
        setTimeout(() => {
          internalUnsuccess.style.display = "none";
        }, 3000);
      }
    }

    console.error(error);
  }
}
