import { backendURL } from "../utils/utils.js";

// Form Login
const form_login = document.getElementById("form_login");

form_login.onsubmit = async (e) => {
  e.preventDefault();
  console.log("Login submitted");

  // Disable Button
  document.querySelector("#form_login button").disabled = true;
  document.querySelector("#form_login button").innerHTML = `
    <div class="spinner-border me-2" role="status"></div>
    <span>Loading...</span>`;

  // Get Values of Form (input, textarea, select) set it as form-data
  const formData = new FormData(form_login);
  var toastEl = document.getElementById("liveToast");
  var toast = new bootstrap.Toast(toastEl);

  // Fetch API User Login Endpoint
  const response = await fetch(backendURL + "/api/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  // Get response if 200-299 status code
  if (response.ok) {
    const data = await response.json();

    console.log(data.user.username);
    // Store Token
    localStorage.setItem("token", data.token);

    form_login.reset();

    // Change the message of the toast before showing it
    toastEl.querySelector(".toast-body").textContent =
      `Welcome back ` + data.user.username;
    toast.show();

    // Redirect Page
    window.location.pathname = "/admin-interface.html";
  }
  // Get response if 422 status code
  else if (response.status == 422) {
    const json = await response.json();

    // Change the message of the toast before showing it
    toastEl.querySelector(".toast-body").textContent = json.message;
    toast.show();
  }

  // Enable Button
  document.querySelector("#form_login button").disabled = false;
  document.querySelector("#form_login button").innerHTML = `Login`;
};
