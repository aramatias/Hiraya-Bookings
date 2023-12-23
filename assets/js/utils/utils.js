import { setRouter } from "../router/router.js";

// Set Router
setRouter();

const backendURL = "http://hiraya-audi-booking-backend.test";

// Get Logged User Profile
// async function getLoggedUser() {
//     // Access User Profile API Endpoint
//     const response = await fetch(backendURL + "/api/profile/show", {
//       headers: {
//         Accept: "application/json",
//         Authorization: "Bearer " + localStorage.getItem("token"),
//       },
//     });

//     // Get response if 200-299 status code
//     if (response.ok) {
//       const json = await response.json();

//       document.getElementById("user_logged").innerHTML =
//         json.firstname + " " + json.lastname;

//       if (document.getElementById("user_id")) {
//         document.getElementById("user_id").value = json.id;
//       }
//     }
//     // Get response if 400 or 500 status code
//     else {
//       const json = await response.json();

//       errorNotification(json.message, 10);
//     }
//   }

export { backendURL };
