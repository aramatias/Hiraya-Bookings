import { backendURL, loggedUserID } from "../utils/utils.js";

console.log("settings js loaded");

// Get the input element
const imageUploadInput = document.getElementById("avatar");
// Get the container element to display the image preview
const imagePreviewContainer = document.getElementById("profileImagePreview");

const submitProfile = document.getElementById("submitProfile");
getUser();

async function getUser() {
  const response = await fetch(backendURL + "/api/profile", {
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "69420",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (response.ok) {
    const json = await response.json();
    getUserDetails(json.user_id);

    console.log("Profile " + loggedUserID);
  } else {
    const json = await response.json();
    console.log(json);
  }
}

// Add an event listener to the input element to handle the image upload
imageUploadInput.addEventListener("change", function (event) {
  const file = event.target.files[0];

  if (file) {
    // Create a new FileReader instance
    const reader = new FileReader();

    // Set up the reader to load the image as a data URL
    reader.readAsDataURL(file);

    // Callback function when the reader has finished loading the image
    reader.onloadend = function () {
      // Create a new image element
      const image = document.createElement("img");
      image.classList.add("profileImagePreview");

      // Set the source of the image to the data URL
      image.src = reader.result;

      // Append the image to the container
      imagePreviewContainer.appendChild(image);
    };
  }
});

// Add an event listener to the image preview container to handle image removal
imagePreviewContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("profileImagePreview")) {
    // Remove the clicked image element from the container
    event.target.remove();
  }
});

submitProfile.addEventListener("click", function (event) {
  event.preventDefault();

  // Update the user Avatar
  updateUserAvatar();
});

async function updateUserAvatar() {
  const formData = new FormData();
  formData.append("avatar", document.getElementById("avatar").files[0]);

  const response = await fetch(
    backendURL + `/api/user/avatar/${loggedUserID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: formData,
    }
  );
  if (response.ok) {
    const json = await response.json();
    console.log("Successfully updated avatar" + json);
  } else {
    const json = await response.json();
    console.log("Failed to update avatar" + json);
  }
}

async function updateUserName(UserId) {
  const response = await fetch(backendURL + `/api/user/name/${UserId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "69420",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
    }),
  });
  if (response.ok) {
    const json = await response.json();
    console.log(json);
  } else {
    const json = await response.json();
    console.log(json);
  }
}

async function updateUserDetailsUserId(UserDetailsId, UserId) {
  const response = await fetch(
    backendURL + `/api/userdetails/userid/${UserDetailsId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        user_id: UserId,
      }),
    }
  );
  if (response.ok) {
    const json = await response.json();
    console.log(json);
  } else {
    const json = await response.json();
    console.log(json);
  }
}

async function updateUserDetailsAbout(UserDetailsId) {
  const response = await fetch(
    backendURL + `/api/userdetails/about/${UserDetailsId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        about: document.getElementById("about").value,
      }),
    }
  );
  if (response.ok) {
    const json = await response.json();
    console.log(json);
  } else {
    const json = await response.json();
    console.log(json);
  }
}

async function updateUserDetailsCompany(UserDetailsId) {
  const response = await fetch(
    backendURL + `/api/userdetails/company/${UserDetailsId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        company: document.getElementById("company").value,
      }),
    }
  );
  if (response.ok) {
    const json = await response.json();
    console.log(json);
  } else {
    const json = await response.json();
    console.log(json);
  }
}

async function updateUserDetailsJob(UserDetailsId) {
  const response = await fetch(
    backendURL + `/api/userdetails/job/${UserDetailsId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        job: document.getElementById("job").value,
      }),
    }
  );
  if (response.ok) {
    const json = await response.json();
    console.log(json);
  } else {
    const json = await response.json();
    console.log(json);
  }
}

async function updateUserDetailsCountry(UserDetailsId) {
  const response = await fetch(
    backendURL + `/api/userdetails/country/${UserDetailsId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        country: document.getElementById("country").value,
      }),
    }
  );
  if (response.ok) {
    const json = await response.json();
    console.log(json);
  } else {
    const json = await response.json();
    console.log(json);
  }
}

async function updateUserDetailsAddress(UserDetailsId) {
  const response = await fetch(
    backendURL + `/api/userdetails/address/${UserDetailsId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        address: document.getElementById("address").value,
      }),
    }
  );
  if (response.ok) {
    const json = await response.json();
    console.log(json);
  } else {
    const json = await response.json();
    console.log(json);
  }
}

async function updateUserDetailsPhone(UserDetailsId) {
  const response = await fetch(
    backendURL + `/api/userdetails/phone/${UserDetailsId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "69420",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        phone: document.getElementById("phone").value,
      }),
    }
  );
  if (response.ok) {
    const json = await response.json();
    console.log(json);
  } else {
    const json = await response.json();
    console.log(json);
  }
}

// Get User Details
async function getUserDetails() {
  // Access User Creds API Endpoint
  const response = await fetch(backendURL + `/api/userinfo/${loggedUserID}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "ngrok-skip-browser-warning": "69420",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  if (response.ok) {
    const json = await response.json();

    document.getElementById("about").innerHTML = json.about;
    document.getElementById("company").innerHTML = json.company;
    document.getElementById("job").innerHTML = json.job;
    document.getElementById("country").innerHTML = json.country;
    document.getElementById("address").innerHTML = json.address;
    document.getElementById("phone").innerHTML = json.phone;
    console.log(json);
  } else {
    const json = await response.json();
    console.log(json);
  }
}
