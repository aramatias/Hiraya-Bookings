import { setRouter } from "../router/router.js";

// Set Router
setRouter();

const backendURL = "http://hiraya-audi-booking-backend.test";

// Get Logged User Profile
async function getLoggedUser() {
  // Access User Profile API Endpoint
  const response = await fetch(backendURL + "/api/profile", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  // Get response if 200-299 status code
  if (response.ok) {
    const json = await response.json();
    console.log(json);

    document.getElementById("user_logged").innerHTML = `
    <img src="${backendURL}/storage/${json.avatar}" alt="a" class="rounded-circle" />
    <span
      class="d-none d-md-block dropdown-toggle ps-2"
      >${json.name}
      </span>`;

    document.getElementById("profile_card").innerHTML = `<img
    src="${backendURL}/storage/${json.avatar}"
    alt="Profile"
    class="rounded-circle"
  />
  <h2>${json.name}</h2>
  <h3>Admin</h3>`;

    document.getElementById("user_email").innerHTML = json.email;

    if (document.getElementById("user_id")) {
      document.getElementById("user_id").value = json.id;
    }
  }
  // Get response if 400 or 500 status code
  else {
    const json = await response.json();
  }
}

export { backendURL, getLoggedUser };
