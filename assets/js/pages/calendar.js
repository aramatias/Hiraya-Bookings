import { backendURL } from "../utils/utils.js";

async function displayCalendarEvents() {
  console.log("Displaying calendar events...");
  const response = await fetch(backendURL + "/api/booking", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
  });

  if (response.ok) {
    const json = await response.json();
    console.log(json);

    json.forEach((booking) => {
      // Get the date and time from the booking
      const date = booking.date;
      const time = booking.time;

      // Format the date and time as needed for the calendar event
      const formattedDate = formatDate(date);
      const formattedTime = formatTime(time);

      // Create the calendar event

      createEvent(booking.id, booking.date, booking.purpose);
    });
  } else {
    const json = await response.json();
    console.log(json);
  }
  // Iterate through the bookings
}

displayCalendarEvents();

function formatDate(date) {
  // Format the date as needed (e.g., "yyyy-mm-dd" to "mm/dd/yyyy")
  // Implement your own logic here to format the date
  const parts = date.split("-");
  const formattedDate = `${parts[1]}/${parts[2]}/${parts[0]}`;

  return formattedDate;
}

function formatTime(time) {
  // Format the time as needed (e.g., "hh:mm" to "hh:mm AM/PM")
  // Implement your own logic here to format the time

  return time;
}

function displayEvent(event) {
  // Implement your own logic here to display the calendar event
  // This function can vary depending on the calendar library or API you are using
  console.log(event);
}

document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    timeZone: "UTC",
    themeSystem: "bootstrap",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
    },
    dateClick: function (dateClickInfo) {
      createEvent(dateClickInfo.dateStr, "Some event", undefined);
    },
    select: function (selectionInfo) {
      createEvent(selectionInfo.startStr, "Some event", selectionInfo.endStr);
    },
  });
  calendar.render();
});

// Event creation function
const events = [];
function createEvent(id, startDate, title) {
  const event = {
    id: id, // You must use a custom id generator
    title: title,
    start: startDate,
  };
  events.push(event);
}
