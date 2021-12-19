import "@babel/polyfill";
import { login, logout, signup, resetPassword } from "./login";
import { updateUserSettigns } from "./updateSettings";
import { displayMap } from "./mapbox";
import { bookTour } from "./stripe";
import { showAlert } from "./alert";
import * as carousell from "./carousell";
import { handleSearch } from "./search";

import { handlePagination } from "./paginate";
import { handleBurgerOpenClose } from "./burgerMenu";

//DOM ELEMENTS
const form = document.querySelector(".form");
const formUserData = document.querySelector(".form-user-data");
const formUserPassword = document.querySelector(".form-user-password");
const mapBox = document.getElementById("map");
const logOutBtn = document.querySelector(".nav__el--logout");
const photoName = document.getElementById("photoNm");
const bookingBtn = document.getElementById("booking-btn");
const searchInp = document.getElementById("search");
const prevButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const profilePictureMenu = document.getElementById("profile-pic");
const burgerMenu = document.getElementById("burger-menu");
//Delegation

if (mapBox) {
  const locations = JSON.parse(
    document.getElementById("map").dataset.locations
  );
  displayMap(locations);
}
if (formUserData) {
  formUserData.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const file = document.getElementById("photo").files[0];

    formData.append("email", document.getElementById("email_setting").value);
    formData.append("name", document.getElementById("name_setting").value);
    formData.append("photo", file);

    updateUserSettigns(formData, "emailAndName");
  });
}
if (formUserPassword) {
  formUserPassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    const passwordCurrent = document.getElementById("password-current").value;
    const password = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;
    const data = {
      passwordCurrent,
      password,
      passwordConfirm,
    };
    await updateUserSettigns(data, "password");
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const { pathname } = window.location;

    const name =
      pathname === "/signup" ? document.getElementById("name").value : null;
    const password =
      pathname === "/signup" || pathname === "/login"
        ? document.getElementById("password").value
        : null;
    const passwordConfirm =
      pathname === "/signup"
        ? document.getElementById("password-confirm").value
        : null;
    console.log(pathname);
    if (pathname === "/login") {
      //login
      console.log("Pathname is login");
      login(email, password);
    } else if (pathname === "/signup") {
      //signup
      signup(email, name, password, passwordConfirm);
    } else {
      console.log("Resetting password");
      resetPassword(email);
    }
  });
}
if (profilePictureMenu) {
  const dropDownMenu = document.getElementById("drp-down-menu");

  profilePictureMenu.addEventListener("click", (e) => {
    dropDownMenu.classList.toggle("show-drp");
  });
}
if (logOutBtn) {
  logOutBtn.addEventListener("click", logout);
}
if (photoName) {
  document.getElementById("photo").addEventListener("change", (e) => {
    const file = document.getElementById("photo").files[0];
    const phtoNameTxt =
      file.name.split(".")[0].length > 11
        ? file.name.split(".")[0].slice(0, 10) +
          "...." +
          file.name.split(".")[1]
        : file.name.split(".")[0];
    photoName.textContent = phtoNameTxt;
  });
}

if (bookingBtn) {
  bookingBtn.addEventListener("click", async (e) => {
    const tourId = e.target.getAttribute("data-tourID");
    const slug = location.pathname.split("/")[2];
    console.log(location.pathname);
    console.log(tourId);
    e.target.textContent = "Processing...";
    await bookTour(slug);
    e.target.textContent = "BOOK TOUR NOW";
  });
}

if (burgerMenu) {
  burgerMenu.addEventListener("click", handleBurgerOpenClose);
}

const alertMessage = document.body.dataset.alert;

if (alertMessage) showAlert("sucess", alertMessage, 15);

searchInp.addEventListener("keydown", handleSearch);

if (prevButton) {
  prevButton.addEventListener("click", handlePagination);
  nextButton.addEventListener("click", handlePagination);
}
