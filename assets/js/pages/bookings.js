import { backendURL } from "../utils/utils.js";

const acceptButtonID = 0;

/**
 * Retrieves the list of bookings from the backend API.
 *
 * @return {Promise<void>} Returns a Promise that resolves once the bookings are retrieved.
 */
async function getBookingsLists() {
  const response = await fetch(backendURL + "/api/booking", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "69420",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (response.ok) {
    const json = await response.json();

    // Fetch all clients names asynchronously
    const clientPromises = json.map((booking) =>
      getClientById(booking.client_id)
    );

    // Counters for pending, accepted, and rejected bookings
    let pendingCount = 0;
    let acceptedCount = 0;
    let rejectedCount = 0;

    // Wait for all clients name promises to resolve
    const clients = await Promise.all(clientPromises);

    json.forEach((booking, index) => {
      // Get the clients frist and last name
      const client = clients[index];

      let bookingDiv = document.createElement("div");
      bookingDiv.className =
        "list-group-item d-flex justify-content-between align-items-center my-3";
      bookingDiv.innerHTML = `<div class="ms-2 me-auto">
        <div class="fw-bold"> ${client.first_name} ${client.last_name}</div>
         ${getWeekday(booking.date)} | ${booking.date}
        </div>
        ${
          booking.status == "pending"
            ? `<a
        class="btn btn-primary d-flex align-items-center justify-content-center"
        type="button"
        data-bs-toggle="modal"
        data-bs-target="#staticBackdrop"
        id="review_booking_${booking.id}">
        Review  <i class="bi bi-pen-fill ms-2"></i> 
        </a>`
            : `<a
              class="btn btn-outline-success d-flex align-items-center justify-content-center"
              type="button"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
              id="view_booking_${booking.id}">
              View  <i class="bi bi-eye-fill ms-2"></i> 
            </a>`
        }`;

      if (booking.status === "pending") {
        document.getElementById("pending-tab-pane").appendChild(bookingDiv);

        pendingCount++;
      } else if (booking.status === "accepted") {
        document.getElementById("accepted-tab-pane").appendChild(bookingDiv);

        acceptedCount++;
      } else if (booking.status === "rejected") {
        document.getElementById("rejected-tab-pane").appendChild(bookingDiv);

        rejectedCount++;
      }

      // Add click event listener for each booking
      const reviewBookingAnchor = bookingDiv.querySelector(
        `#review_booking_${booking.id}`
      );

      const viewBookingAnchor = bookingDiv.querySelector(
        `#view_booking_${booking.id}`
      );

      if (reviewBookingAnchor) {
        reviewBookingAnchor.addEventListener("click", async () => {
          try {
            const bookingDetails = await getBookingDetailsById(booking.id);

            // Update the UI to display the booking details
            document.querySelector(
              ".modal-title"
            ).innerHTML = `Booking Details`;
            document.querySelector(
              ".modal-body"
            ).innerHTML = `<h5 class="d-flex justify-content-between align-content-center">${
              client.first_name
            } ${client.last_name} 
            <span class="badge bg-primary">${
              client.affiliation_id == 1 || client.affiliation_id == 2
                ? `CSU Affiliated`
                : `Non-CSU Affiliated`
            }</span></h5>
            <div class="mt-4">
              <strong>Date</strong>
              <p>${booking.date} ${booking.time}</p>
            </div>
            <div class="mt-4">
            <strong>Purpose of Reservation</strong>
            <p>${booking.purpose}</p>
            </div>
            <div class="mt-4">
            <strong>Affiliation</strong>
            <p>${
              client.affiliation_id == 1
                ? "Student from Caraga State University"
                : client.affiliation_id == 3
                ? "Employee from Caraga State University"
                : "Non-CSU Affiliated"
            }</p>
            </div>
            `;

            document.querySelector(".modal-footer").innerHTML = `
              <button type="button" class="btn btn-outline-success" id="acceptButton" name="accept">Accept</button>
              <button type="button" class="btn btn-outline-danger" id="rejectButton" name="reject">Reject</button>`;

            acceptButton.dataset.bookingId = booking.id;
            rejectButton.dataset.bookingId = booking.id;
          } catch (error) {
            console.error("Error fetching booking details:", error);
          }
        });
      } else if (viewBookingAnchor) {
        viewBookingAnchor.addEventListener("click", async () => {
          try {
            const bookingDetails = await getBookingDetailsById(booking.id);

            // Update the UI to display the booking details
            document.querySelector(
              ".modal-title"
            ).innerHTML = `Booking Details`;
            document.querySelector(".modal-body").innerHTML = `
            <h5 class="d-flex justify-content-between align-content-center">
              ${client.first_name} ${client.last_name} 
              <span class="badge bg-primary">${
                client.affiliation_id == 1 || client.affiliation_id == 3
                  ? `CSU Affiliated`
                  : `Non-CSU Affiliated`
              }</span>
            </h5>
            <div class="mt-4">
              <strong>Date</strong>
              <p>${booking.date} ${booking.time}</p>
            </div>
            <div class="mt-4">
            <strong>Purpose of Reservation</strong>
            <p>${booking.purpose}</p>
            </div>
            <div class="mt-4">
            <strong>Affiliation</strong>
            <p>${
              client.affiliation_id == 1
                ? "Student from Caraga State University"
                : client.affiliation_id == 3
                ? "Employee from Caraga State University"
                : "Non-CSU Affiliated"
            }</p>
            </div>
            `;

            document.querySelector(".modal-footer").innerHTML = `
              <button type="button" class="btn btn-outline-danger" id="deleteButton" name="delete">Delete</button>`;

            deleteButton.dataset.bookingId = booking.id;
          } catch (error) {
            console.error("Error deleting booking:", error);
          }
        });
      }
    });

    // Update the badge counters in the UI
    document.getElementById("pending-badge").innerHTML = pendingCount;
    document.getElementById("accepted-badge").innerHTML = acceptedCount;
    document.getElementById("rejected-badge").innerHTML = rejectedCount;
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
async function getBookingDetailsById(bookingId) {
  const response = await fetch(`${backendURL}/api/booking/${bookingId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "69420",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch booking details");
  }

  return response.json();
}

// Get Client Name
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
    return clientJson;
  } else {
    console.error("Failed to fetch clients details");
    return "Unknown Client";
  }
}

// Function to update the booking status
async function updateBookingStatus(bookingId, newStatus) {
  var toastEl = document.getElementById("liveToast");
  var toast = new bootstrap.Toast(toastEl);

  try {
    const response = await fetch(
      backendURL + `/api/booking/status/${bookingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "69420",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (response.ok) {
      toastEl.querySelector(
        ".toast-body"
      ).textContent = `Booking Status: ${newStatus}`;
      toast.show();
    } else {
      const json = await response.json();
      console.error("Error updating booking status:", json);
      toastEl.querySelector(
        ".toast-body"
      ).textContent = `Error updating booking status: ${json.message}`;
      toast.show();
    }
  } catch (error) {
    console.error("Error updating booking status:", error);
  }
}

async function deleteBooking(bookingId) {
  var toastEl = document.getElementById("liveToast");
  var toast = new bootstrap.Toast(toastEl);

  try {
    const response = await fetch(backendURL + `/api/booking/${bookingId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (response.ok) {
      toastEl.querySelector(
        ".toast-body"
      ).textContent = `Booking ${bookingId} deleted successfully`;
      toast.show();
    } else {
      const json = await response.json();
      console.error("Error deleting booking:", json);
      toastEl.querySelector(
        ".toast-body"
      ).textContent = `Error deleting booking: ${json.message}`;
      toast.show();
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
  }
}

document.addEventListener("click", function (event) {
  if (event.target.id === "acceptButton") {
    event.preventDefault();
    const bookingId = event.target.dataset.bookingId;

    console.log("Accept button clicked", bookingId);
    if (bookingId) {
      // Update the booking status to 'accepted'
      updateBookingStatus(bookingId, "accepted");
    } else {
      console.error("Booking ID not found.");
    }
  }
});

document.addEventListener("click", function (event) {
  if (event.target.id === "rejectButton") {
    event.preventDefault();
    const bookingId = event.target.dataset.bookingId;

    console.log("Reject button clicked", bookingId);
    if (bookingId) {
      // Update the booking status to 'rejected'
      updateBookingStatus(bookingId, "rejected");
    } else {
      console.error("Booking ID not found.");
    }
  }
});

document.addEventListener("click", function (event) {
  if (event.target.id === "deleteButton") {
    event.preventDefault();
    const bookingId = event.target.dataset.bookingId;

    console.log("Delete button clicked", bookingId);
    if (bookingId) {
      // Delete the booking
      deleteBooking(bookingId);
    } else {
      console.error("Booking ID not found.");
    }
  }
});
