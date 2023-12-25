import { setRouter } from "../router/router.js";

// Set Router
setRouter();

const backendURL = "http://hiraya-audi-booking-backend.test";

// Get Logged User Credentials
async function getLoggedUser() {
  // Access User Creds API Endpoint
  const response = await fetch(backendURL + "/api/profile", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  // Get response if 200-299 status code
  if (response.ok) {
    const json = await response.json();
    var userrole = "no";
    console.log(json);

    if (json.is_admin == "yes") {
      userrole = "Admin";
    } else {
      userrole = "User";
    }

    document.getElementById("user_email").innerHTML = json.email;
    document.getElementById("user_role").innerHTML = userrole;
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
    <h3>${userrole}</h3>`;

    if (window.location.pathname == "/admin-accsettings.html") {
      document.getElementById("user_name").innerHTML = json.name;
      document.getElementById("email").innerHTML = json.email;
      document.getElementById(
        "profileImage"
      ).innerHTML = `<img src="${backendURL}/storage/${json.avatar}" alt="Profile" />`;
    }
  }
  // Get response if 400 or 500 status code
  else {
    const json = await response.json();
  }
}

// Get User Details
async function getUserDetails() {
  // Access User Creds API Endpoint
  const response = await fetch(backendURL + "/api/user/details", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (response.ok) {
    const json = await response.json();
    console.log(json);

    document.getElementById("about").innerHTML = json.about;
    document.getElementById("company").innerHTML = json.company;
    document.getElementById("job").innerHTML = json.job;
    document.getElementById("country").innerHTML = json.country;
    document.getElementById("address").innerHTML = json.address;
    document.getElementById("phone").innerHTML = json.phone;
  } else {
    const json = await response.json();
    console.log(json);
  }
}

/**
 * Updates the details of the logged-in user.
 *
 * @param {object} userDetails - The updated details of the user.
 * @return {Promise} A promise that resolves with the updated user details.
 */
async function updateUserDetails(userDetails) {
  const response = await fetch("/api/user/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userDetails),
  });

  if (response.ok) {
    return await response.json();
  }

  throw new Error("Failed to update user details.");
}

export { backendURL, getLoggedUser, getUserDetails };
