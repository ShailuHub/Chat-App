import {
  baseURL,
  email,
  password,
  username,
  phone,
  confirm_password,
  form,
  regSuccess,
  passUnSuccess,
  emailUnsuccess,
  internalUnsuccess,
  phoneUnsuccess,
  login,
} from "./variable.js";

login.addEventListener("click", () => {
  window.location.href = "/user/login";
});

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
    }
  } catch (error) {
    if (error.response.status === 400) {
      passUnSuccess.style.display = "block";
      setTimeout(() => {
        passUnSuccess.style.display = "none";
      }, 3000);
    } else if (error.response.status === 409) {
      emailUnsuccess.style.display = "block";
      setTimeout(() => {
        emailUnsuccess.style.display = "none";
        form.reset();
      }, 3000);
    } else if (error.response.status === 500) {
      internalUnsuccess.style.display = "block";
      setTimeout(() => {
        internalUnsuccess.style.display = "none";
        form.reset();
      }, 3000);
    } else if (error.response.status === 405) {
      phoneUnsuccess.style.display = "block";
      setTimeout(() => {
        phoneUnsuccess.style.display = "none";
        form.reset();
      }, 3000);
    }
    console.log(error);
  }
}
