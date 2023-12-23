import { backendURL } from "../utils/utils.js";

// Form Register
const form_register = document.getElementById("form_register");

var toastEl = document.getElementById("liveToast");
var toast = new bootstrap.Toast(toastEl);

/**
 * Submits the registration form data to the server.
 *
 * @param {Event} e - The form submit event.
 * @return {Promise} A promise that resolves with the result of the form submission.
 */
form_register.onsubmit = async (e) => {
  e.preventDefault();

  console.log("Form submitted");

  document.querySelector("#form_register button").disabled = true;
  document.querySelector("#form_register button").innerHTML = `
  <div class="spinner-border me-2" role="status"></div>
  <span>Loading...</span>`;

  const formData = new FormData(form_register);

  const response = await fetch(backendURL + "/api/user", {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
    body: formData,
  });

  if (response.ok) {
    const json = await response.json();
    console.log(json);

    // Change the message of the toast before showing it
    toastEl.querySelector(".toast-body").textContent =
      "Account created successfully!";
    toast.show();

    form_register.reset();
  } else if (response.status == 422) {
    const json = await response.json();

    // Change the message of the toast before showing it
    toastEl.querySelector(".toast-body").textContent = json.message;
    toast.show();

    console.log(json);
  }

  document.querySelector("#form_register button").disabled = false;
  document.querySelector("#form_register button").innerHTML = "Create Account";
};
