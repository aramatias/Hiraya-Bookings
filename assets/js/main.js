import { backendURL } from "./utils/utils.js";

const apiUrl = backendURL + "/api/booking";

async function checkAvailability() {
  // Toast Initialization
  var toastEl = document.getElementById("liveToast");
  var toast = new bootstrap.Toast(toastEl);
  // Get the date and time from the input fields
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;

  // Fetch bookings from the database
  const response = await fetch(apiUrl, {
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "69420",
    },
  });
  const bookings = await response.json();

  const selectedDateTime = new Date(`${date}T${time}`);

  const bufferTime = 30 * 60 * 1000;

  const endOfDay = new Date(selectedDateTime);
  endOfDay.setHours(23, 59, 59, 999);

  const bookingsForSelectedDate = bookings.filter(
    (booking) => booking.date === date
  );

  const isAvailable = bookings.every((booking) => {
    const bookingDateTime = new Date(`${booking.date}T${booking.time}`);
    const startTime = bookingDateTime.getTime() - bufferTime;
    const endTime = endOfDay.getTime();

    return (
      selectedDateTime.getTime() < startTime ||
      selectedDateTime.getTime() > endTime
    );
  });

  if (isAvailable || bookingsForSelectedDate.length === 0) {
    toastEl.querySelector(
      ".toast-body"
    ).textContent = `The selected date and time are available!`;
    toastEl.querySelector(
      "#toastToAction"
    ).innerHTML = `<a href="client-form.html" class="btn btn-primary btn-sm">
    Book Now!
  </a>
  <button
    type="button"
    class="btn btn-secondary btn-sm"
    data-bs-dismiss="toast"
  >
    Close
  </button>`;
    toast.show();
  } else {
    toastEl.querySelector(".toast-body").textContent =
      "Sorry, the selected date and time are not available.";
    toastEl.querySelector("#toastToAction").innerHTML = `
  <button
    type="button"
    class="btn btn-secondary btn-sm"
    data-bs-dismiss="toast"
  >
    Close
  </button>`;
    toast.show();
  }
  // Display the availability result
  // const availabilityResult = document.getElementById("availabilityResult");
  // availabilityResult.innerHTML = isAvailable
  //   ? `The selected date and time are available! <a href="client-form.html" class="text-info">Book Now!</a>`
  //   : "Sorry, the selected date and time are not available.";
}

// Attach the function to the button click event
const checkAvailabilityButton = document.getElementById("checkAvailability");
checkAvailabilityButton.addEventListener("click", checkAvailability);

(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let header = select("#header");
    let offset = header.offsetHeight;

    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos - offset,
      behavior: "smooth",
    });
  };

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select("#header");
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add("header-scrolled");
      } else {
        selectHeader.classList.remove("header-scrolled");
      }
    };
    window.addEventListener("load", headerScrolled);
    onscroll(document, headerScrolled);
  }

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("#navbar").classList.toggle("navbar-mobile");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Mobile nav dropdowns activate
   */
  on(
    "click",
    ".navbar .dropdown > a",
    function (e) {
      if (select("#navbar").classList.contains("navbar-mobile")) {
        e.preventDefault();
        this.nextElementSibling.classList.toggle("dropdown-active");
      }
    },
    true
  );

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let navbar = select("#navbar");
        if (navbar.classList.contains("navbar-mobile")) {
          navbar.classList.remove("navbar-mobile");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Initiate  glightbox
   */
  const glightbox = GLightbox({
    selector: ".glightbox",
  });

  /**
   * Skills animation
   */
  let skilsContent = select(".skills-content");
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: "80%",
      handler: function (direction) {
        let progress = select(".progress .progress-bar", true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          portfolioIsotope.on("arrangeComplete", function () {
            AOS.refresh();
          });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox",
  });

  /**
   * Portfolio details slider
   */
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });
})();
