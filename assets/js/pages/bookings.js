import { backendURL } from "../utils/utils.js";

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
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (response.ok) {
    const json = await response.json();
    console.log(json);

    // Fetch all client names asynchronously
    const clientNamePromises = json.map((booking) =>
      getClientNameById(booking.client_id)
    );

    // Wait for all client name promises to resolve
    const clientNames = await Promise.all(clientNamePromises);

    json.forEach((booking, index) => {
      // Get the clients frist and last name
      const clientName = clientNames[index];

      let bookingDiv = document.createElement("div");
      bookingDiv.className =
        "list-group-item d-flex justify-content-between align-items-center my-3";
      bookingDiv.innerHTML = `<div class="ms-2 me-auto">
        <div class="fw-bold">${getWeekday(booking.date)} | ${
        booking.date
      } | ${clientName} </div>
        ${booking.purpose}
        </div>
        <a
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          id="view_booking_${booking.id}">
          <i class="bi bi-eye-fill"></i>
        </a>`;

      if (booking.status === "pending") {
        document.getElementById("pending-tab-pane").appendChild(bookingDiv);
      } else if (booking.status === "accepted") {
        document.getElementById("accepted-tab-pane").appendChild(bookingDiv);
      } else if (booking.status === "rejected") {
        document.getElementById("rejected-tab-pane").appendChild(bookingDiv);
      }

      // Add click event listener for each booking
      const viewBookingAnchor = bookingDiv.querySelector(
        `#view_booking_${booking.id}`
      );

      if (viewBookingAnchor) {
        viewBookingAnchor.addEventListener("click", async () => {
          try {
            const bookingDetails = await getBookingDetailsById(booking.id);
            console.log("Booking Details:", bookingDetails);

            // Update the UI to display the booking details
            document.querySelector(
              ".modal-title"
            ).innerHTML = `Booking Details`;
            document.querySelector(
              ".modal-body"
            ).innerHTML = `<h5>${clientName}</h5>
            <p>Scheduled Date: ${booking.date}/p>
            <p>Scheduled Time: ${booking.time}</p>
            <p>Booking Purpose: ${booking.purpose}</p>`;

            acceptButton.dataset.bookingId = booking.id;
            rejectButton.dataset.bookingId = booking.id;
          } catch (error) {
            console.error("Error fetching booking details:", error);
          }
        });
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
async function getBookingDetailsById(bookingId) {
  const response = await fetch(`${backendURL}/api/booking/${bookingId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch booking details");
  }

  return response.json();
}

// Get Client Name
async function getClientNameById(clientId) {
  const clientResponse = await fetch(backendURL + `/api/clients/${clientId}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (clientResponse.ok) {
    const clientJson = await clientResponse.json();

    const first_name = clientJson.first_name;
    const last_name = clientJson.last_name;
    const name = first_name.concat(" ", last_name);

    console.log(clientJson);

    return name;
  } else {
    console.error("Failed to fetch client details");
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
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    if (response.ok) {
      console.log(`Booking status updated to: ${newStatus}`);
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

acceptButton.addEventListener("click", async function () {
  // Get the booking ID from the data attribute
  console.log("Accept button clicked");
  const bookingId = acceptButton.dataset.bookingId;

  if (bookingId) {
    // Update the booking status to 'accepted'
    await updateBookingStatus(bookingId, "accepted");

    // Close the modal if needed
    $("#staticBackdrop").modal("hide");
  } else {
    console.error("Booking ID not found.");
  }
});

rejectButton.addEventListener("click", async function () {
  // Get the booking ID from the data attribute
  console.log("Reject button clicked");
  const bookingId = rejectButton.dataset.bookingId;

  if (bookingId) {
    // Update the booking status to 'reject'
    await updateBookingStatus(bookingId, "rejected");

    // Close the modal if needed
    $("#staticBackdrop").modal("hide");
  } else {
    console.error("Booking ID not found.");
  }
});
