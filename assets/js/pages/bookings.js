import { backendURL } from "../utils/utils.js";

/**
 * Retrieves the list of bookings from the backend API.
 *
 * @return {Promise<void>} Returns a Promise that resolves once the bookings are retrieved.
 */
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
      <div>${getWeekday(booking.date)} | ${booking.date}</div>
      Purpose: ${booking.purpose} 
      </div>
      <button 
        type="button" 
        class="btn btn-primary" 
        data-bs-toggle="modal" 
        data-bs-target="#staticBackdrop"
        id: "view_booking_${booking.id}">
      View
      </button>`;

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

/**
 * Displays the booking details as a modal.
 *
 * @param {Object} booking - The booking object containing the details.
 */
function displayBookingDetailsModal(booking) {
  // Code to create and display the modal
  // You can use the booking object to populate the modal with the necessary information
  console.log(booking + "running");
}
