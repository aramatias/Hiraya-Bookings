function setRouter() {
  alert(window.location.pathname);
  switch (window.location.pathname) {
    case "/":
    case "/Hiraya-Bookings-main/Hiraya/admin-login.html":
    case "/Hiraya-Bookings-main/Hiraya/admin-register.html":
      if (localStorage.getItem("token")) {
        window.location.pathname =
          "/Hiraya-Bookings-main/Hiraya/admin-interface.html";
      }
      break;

    case "/Hiraya-Bookings-main/Hiraya/admin-interface.html":
      if (!localStorage.getItem("token")) {
        window.location.pathname =
          "/Hiraya-Bookings-main/Hiraya/admin-login.html";
      }
  }
}

export { setRouter };
