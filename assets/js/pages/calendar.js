import { backendURL } from "../utils/utils.js";

document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",

    events: {
      url: backendURL + "/api/booking",
      method: "GET",
      headers: {
        Accept: "application/json",
        "ngrok-skip-browser-warning": "69420",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },

      failure: function () {
        console.log("there was an error while fetching events");
      },
    },
    eventClick: async function (info) {
      // Handle event click here

      showEventModal(info.event);
    },
  });

  calendar.render();
});

async function showEventModal(event) {
  console.log("you are in showEventModal");
  // Get the modal
  const modal = new bootstrap.Modal(document.getElementById("eventModal"));

  // Get Client
  const client = await getClientById(event.extendedProps.client_id);
  const clientName = client.first_name + " " + client.last_name;

  document.getElementById("clientName").innerHTML = clientName;
  document.getElementById("clientBadge").innerHTML = `
  <span class="badge bg-primary">${
    client.affiliation_id == 1 || client.affiliation_id == 3
      ? `CSU Affiliated`
      : `Non-CSU Affiliated`
  }</span>
`;

  document.getElementById("modalDate").innerHTML =
    event.start.toLocaleDateString();
  document.getElementById("modalTime").innerHTML =
    event.start.toLocaleTimeString();

  document.getElementById("modalPurpose").innerHTML =
    event.extendedProps.purpose;

  document.getElementById("modalAffiliation").innerHTML = `${
    client.affiliation_id == 1
      ? "Student from Caraga State University"
      : client.affiliation_id == 3
      ? "Employee from Caraga State University"
      : "Non-CSU Affiliated"
  }`;

  // Show the modal by adding a CSS class
  modal.show();
}

// Close the modal when the close button is clicked
document.getElementById("closeModalBtn").addEventListener("click", function () {
  console.log("you are in closeModalBtn");
  const modal = new bootstrap.Modal(document.getElementById("eventModal"));
  modal.hide();
});

async function getClientById(clientId) {
  const clientResponse = await fetch(backendURL + `/api/clients/${clientId}`, {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "69420",
      Accept: "application/json",
    },
  });

  if (clientResponse.ok) {
    const clientJson = await clientResponse.json();

    console.log(clientJson);

    return clientJson;
  } else {
    console.error("Failed to fetch clients details");
    return "Unknown Client";
  }
}
