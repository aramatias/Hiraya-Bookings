import { backendURL } from "../utils/utils.js";

async function getBookingsLists() {
  const response = await fetch(backendURL + "/api/booking", {
    headers: {
      Accept: "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (response.ok) {
    const json = await response.json();
    console.log(json);

    json.forEach((booking) => {
      let bookingDiv = document.createElement("div");
      bookingDiv.className =
        "list-group-item d-flex justify-content-between align-items-center";
      bookingDiv.innerHTML = `<div class="ms-2 me-auto">
      <div class="fw-bold ">${getWeekday(booking.date)} | ${booking.date}</div>
      ${booking.client_id}, Purpose: ${booking.purpose} 
    </div><a href="#" class="btn btn-light">View</a>`;

      if (booking.status === "pending") {
        document.getElementById("pendingBookings").appendChild(bookingDiv);
      } else if (booking.status === "accepted") {
        document.getElementById("acceptedBookings").appendChild(bookingDiv);
      } else if (booking.status === "rejected") {
        document.getElementById("rejectedBookings").appendChild(bookingDiv);
      }
    });
  } else {
    const json = await response.json();
    console.log(json);
  }
}

getBookingsLists();

// Get Weekdays
function getWeekday(dateString) {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(dateString);
  const dayName = days[date.getDay()];
  return dayName;
}
