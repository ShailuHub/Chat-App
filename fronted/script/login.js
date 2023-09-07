const login_mainBtn = document.getElementById("login-main-btn");
const signup_mainBtn = document.getElementById("signup-main-btn");
const loginBtn = document.getElementById("login-btn");
const forgotBtn = document.getElementById("forgot-password-btn");
const registerBtn = document.getElementById("register-btn");
const email = document.getElementById("email");
const password = document.getElementById("password");
const logSuccess = document.getElementById("log-success");
const emailUnsuccess = document.getElementById("email-unsuccess");
const internalUnsuccess = document.getElementById("internal-unsuccess");
const form = document.getElementById("form");
const baseURL = "http://localhost:3000";

console.log(email);
console.log(password);
console.log(`${baseURL}/user/login`);

signup_mainBtn.addEventListener("click", () => {
  window.location.href = "/user/signup";
});

form.addEventListener("submit", postLoginDetails);

async function postLoginDetails(event) {
  event.preventDefault();
  const details = {
    email: email.value,
    password: password.value,
  };
  try {
    const response = await axios.post(`${baseURL}/user/login`, details);
    if (response.status === 200) {
      logSuccess.style.display = "block";
      setTimeout(() => {
        logSuccess.style.display = "none";
      }, 3000);
      localStorage.setItem(token, response.data.token);
    }
  } catch (error) {
    if (error.response.status === 401) {
      emailUnsuccess.style.display = "block";
      setTimeout(() => {
        emailUnsuccess.style.display = "none";
      }, 3000);
    } else if (error.response.status === 500) {
      internalUnsuccess.style.display = "block";
      setTimeout(() => {
        internalUnsuccess.style.display = "none";
      }, 3000);
    }
    console.log(error);
  }
}
