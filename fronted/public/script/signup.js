const username = document.getElementById("name");
const email = document.getElementById("email");
const phone = document.getElementById("phone");
const password = document.getElementById("password");
const confirm_password = document.getElementById("confirm-password");
const form = document.getElementById("form");
const regSuccess = document.getElementById("reg-success");
const regUnSuccess = document.getElementById("reg-unsuccess");
const passUnSuccess = document.getElementById("pass-unsuccess");
const emailUnsuccess = document.getElementById("email-unsuccess");
const internalUnsuccess = document.getElementById("internal-unsuccess");
const baseURL = "http://localhost:3000";

console.log(username);
console.log(email);

form.addEventListener("submit", postUserDetails);

async function postUserDetails(event) {
  event.preventDefault();
  const details = {
    username: username.value,
    email: email.value,
    password: password.value,
    confirm_password: confirm_password.value,
    phone: phone.value,
  };
  try {
    const response = await axios.post(`${baseURL}/user/signup`, details);
    if (response.status == 202) {
      // Redirect to the login page after a delay
      regSuccess.style.display = "block";
      setTimeout(() => {
        regSuccess.style.display = "none";
        window.location.href = "/user/login";
      }, 2000);
    } else if (response.status == 400) {
      console.log("Password not matched");
      passUnSuccess.style.display = "block";
      setTimeout(() => {
        passUnSuccess.style.display = "none";
        form.reset();
      }, 2000);
    } else if (response.status == 409) {
      console.log("Email exists");
      emailUnsuccess.style.display = "block";
      setTimeout(() => {
        emailUnsuccess.style.display = "none";
        form.reset();
      }, 2000);
    } else if (response.status == 500) {
      console.log("Servererror");
      internalUnsuccess.style.display = "block";
      setTimeout(() => {
        internalUnsuccess.style.display = "none";
        form.reset();
      }, 2000);
    }
  } catch (error) {
    if (error.response.status === 400) {
      console.log("Password not matched");
      passUnSuccess.style.display = "block";
      setTimeout(() => {
        passUnSuccess.style.display = "none";
        form.reset();
      }, 3000);
    } else if (error.response.status === 409) {
      console.log("Email exists");
      emailUnsuccess.style.display = "block";
      setTimeout(() => {
        emailUnsuccess.style.display = "none";
        form.reset();
      }, 3000);
    } else if (error.response.status === 500) {
      console.log("Servererror");
      internalUnsuccess.style.display = "block";
      setTimeout(() => {
        internalUnsuccess.style.display = "none";
        form.reset();
      }, 3000);
    }
    console.log(error);
  }
}
