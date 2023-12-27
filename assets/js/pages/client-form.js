import { backendURL } from "../utils/utils.js";

console.log("client form js loaded");
// Form Book
const form_bookings = document.getElementById("form_bookings");

var toastEl = document.getElementById("liveToast");
var toast = new bootstrap.Toast(toastEl);

/**
 * Submits the registration form data to the server.
 *
 * @param {Event} e - The form submit event.
 * @return {Promise} A promise that resolves with the result of the form submission.
 */
form_bookings.onsubmit = async (e) => {
  e.preventDefault();

  console.log("Form submitted");

  document.querySelector("#form_bookings button").disabled = true;
  document.querySelector("#form_bookings button").innerHTML = `
  <div class="spinner-border me-2" role="status"></div>
  <span>Loading...</span>`;

  const formData = new FormData(form_bookings);

  const response = await fetch(backendURL + "/api/booking", {
    method: "POST",
    headers: {
      Accept: "application/json",
      ContentType: "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
    body: formData,
  });

  if (response.ok) {
    const json = await response.json();
    console.log(json);

    // Change the message of the toast before showing it
    toastEl.querySelector(".toast-body").textContent = "Booked successfully!";
    toast.show();

    form_bookings.reset();
  } else if (response.status == 422) {
    const json = await response.json();

    // Change the message of the toast before showing it
    toastEl.querySelector(".toast-body").textContent = json.message;
    toast.show();

    console.log(json);
  } else if (response.status == 401) {
    const json = await response.json();

    // Change the message of the toast before showing it
    toastEl.querySelector(".toast-body").textContent = json.message;
    toast.show();

    console.log(json);
  }

  document.querySelector("#form_bookings button").disabled = false;
  document.querySelector("#form_bookings button").innerHTML = "Confirm";
};
