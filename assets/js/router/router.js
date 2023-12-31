function setRouter() {
  switch (window.location.pathname) {
    case "/admin-login.html":
    case "/admin-register.html":
      if (localStorage.getItem("token")) {
        window.location.pathname = "/admin-interface.html";
      }
      break;

    case "/admin-interface.html":
    case "/admin-stats.html":
    case "/admin-accsettings.html":
    case "/admin-calendar":
    case "/admin-bookings.html":
      if (!localStorage.getItem("token")) {
        window.location.pathname = "/admin-login.html";
      }
  }
}

export { setRouter };
