import { backendURL } from "../utils/utils.js";

console.log(backendURL + " dashboard js loaded");

async function displayUpcomingBookings() {
  const currentDate = new Date();
  const futureDate = new Date(currentDate.setDate(currentDate.getDate() + 5));

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
    console.log(json);

    // Filter Bookings based on the
    const upcomingBookings = json.filter((booking) => {
      const bookingDate = new Date(booking.date);
      return bookingDate >= futureDate;
    });
    // Limit the number of upcoming bookings to 5 to display
    const limitedBookings = upcomingBookings.slice(0, 4);

    // Group bookings by month
    const bookingsByMonth = {};
    limitedBookings.forEach((booking) => {
      const bookingDate = new Date(booking.date);
      const month = bookingDate.toLocaleString("default", { month: "long" });
      if (!bookingsByMonth[month]) {
        bookingsByMonth[month] = [];
      }
      bookingsByMonth[month].push(booking);
    });

    // Count booking Status
    const bookingsCount = {
      pending: 0,
      accepted: 0,
      rejected: 0,
    };

    json.forEach((booking) => {
      const status = booking.status;
      if (status === "pending") {
        bookingsCount.pending++;
      } else if (status === "accepted") {
        bookingsCount.accepted++;
      } else if (status === "rejected") {
        bookingsCount.rejected++;
      }
    });

    document.getElementById("pendingCount").innerHTML = bookingsCount.pending;
    document.getElementById("acceptedCount").innerHTML = bookingsCount.accepted;
    document.getElementById("rejectedCount").innerHTML = bookingsCount.rejected;

    // Display todays Events
    const currentDate = new Date();
    if (bookingDate.toDateString() === currentDate.toDateString()) {
      console.log("Today's event:", booking);
    }

    console.log(bookingsByMonth);
  } else {
    const json = await response.json();
    console.log(json);
  }
}

displayUpcomingBookings();
