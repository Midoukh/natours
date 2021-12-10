const customStyle = {
  width: "10vh",
  height: "8vh",
};

const template = document.createElement("div");
template.className = "menu-content";
const a = document.createElement("a");
const svg = document.createElement("svg");
const use = document.createElement("use");
const li = document.createElement("li");
a.href = "/me";
a.textContent = "My Account";

//use.setAttribute("xlink:href", "../img/icons.svg#icon-home");
//svg.append(use);
//a.append(svg);
template.append(a);

template.style.width = customStyle.width;
template.style.height = customStyle.height;

export { template };
