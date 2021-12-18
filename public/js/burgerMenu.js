export const handleBurgerOpenClose = (e) => {
  document.getElementById("burger-menu").classList.toggle("close");
  const isOpen = document
    .getElementById("burger-menu")
    .classList.contains("close")
    ? "isOpen"
    : "isNotOpen";

  createMenu(isOpen);
};

const createMenu = (state) => {
  if (state === "isOpen") {
    const menuContainer = document.createElement("div");
    menuContainer.setAttribute("id", "menu");
    menuContainer.classList.add("overlay");
    const menuUlist = document.createElement("ul");
    const li1 = document.createElement("li");
    const li2 = document.createElement("li");
    if (checkIfThereIsAuser) {
      const a = document.createElement("a");
      const logoutLink = document.createElement("a");
      a.className = "nav__el";
      a.href = "/me";
      logoutLink.className = "nav__el.nav__el--logout";
      logoutLink.textContent = "Log Out";
      const img = document.createElement("img");
      const span = document.createElement("span");
      const logoutIcon = document.createElement("img");
      logoutIcon.className = "logout";
      logoutIcon.src = "/img/logout.png";
      img.className = "nav__user-img";
      const userObj = JSON.parse(
        document
          .querySelector("#burger-menu span")
          .getAttribute("data-user-obj")
      );

      console.log(typeof userObj);
      const src = userObj.photo
        ? `/img/users/${userObj.photo}`
        : "/img/users/default.jpg";
      img.src = src;
      img.alt = `Photo of ${userObj.name}`;
      span.textContent = userObj.name.split(" ")[0];

      a.append(img);
      a.append(span);

      li1.className = "drowp-down-menu--item";
      li2.className = "drowp-down-menu--item";

      li1.append(a);
      li2.append(logoutIcon);
      li2.append(logoutLink);
    } else {
      const a = document.createElement("a");
      a.className = "nav__el.nav__el--cta";
      a.href = "/login";
      a.textContent = "Log in";

      li1.innerHTML = "";
      li2.innerHTML = "";
      li1.append(a);
    }
    menuUlist.append(li1);
    menuUlist.append(li2);
    menuContainer.append(menuUlist);
    document.body.append(menuContainer);
  } else {
    document.getElementById("menu").classList.remove("overlay");
    document.body.removeChild(document.getElementById("menu"));
  }
};

const checkIfThereIsAuser = () =>
  +document.querySelector("#burger-menu span").getAttribute("data-user");
