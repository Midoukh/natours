const tours = document.querySelector(".card-container");
const toursLength = tours.getAttribute("data-tourslength");
//page = 1: show from 0 to 3
//page = 2: show from 4 to 7
//each page can have 4 results
const RESULTS = 4;
let currentPage = 1;

export const handlePagination = (e) => {
  const btnId = handleGetButtonId(e.target);
  handleSetLoading();

  setTimeout(() => {
    //if (btnId === "previous") previous(e.target);
    //else next(e.target);
  }, 1000);
};

const handleGetButtonId = (element) => {
  let id;
  if (element.tagName === "STRONG" || element.tagName === "SPAN")
    id = element.parentElement.getAttribute("id");
  else id = element.getAttribute("id");
  return id;
};
const next = (button) => {
  console.log("Calling the next");

  const prevButton = document.getElementById("previous");
  console.log(currentPage * RESULTS, parseInt(toursLength) + 3);
  //styling the next and the previous button
  if (currentPage * RESULTS >= parseInt(toursLength) + 3) {
    handleCheckingIfTargetIsButton(button, "next");
    return;
  }
  handleCheckingIfTargetIsButton(prevButton, "previous");

  currentPage++;
  handleResultsToShow();
};
const previous = (button) => {
  console.log("Calling the previous");

  if (currentPage > 1) {
    currentPage--;
  }

  const nextButton = document.getElementById("next");
  handleCheckingIfTargetIsButton(nextButton, "next");

  handleCheckingIfTargetIsButton(button, "previous");

  console.log(currentPage);
  handleResultsToShow();
};
const handleResultsToShow = () => {
  const skip = (currentPage - 1) * RESULTS;

  handleRequest(skip);
};
const handleRequest = (skip) => {
  Array.from(tours.children).forEach((tour) => {
    const tourId = +tour.getAttribute("data-id");
    if (tourId >= skip && tourId < skip + 4) {
      tour.style.display = "flex";
    } else {
      tour.style.display = "none";
    }
  });
};
const handleStyleNextButton = (button) => {
  if (currentPage * RESULTS >= parseInt(toursLength) + 3) {
    button.style.opacity = ".2";
    button.setAttribute("disabled", true);
    button.style.cursor = "not-allowed";
  } else {
    button.style.opacity = "1";
    button.removeAttribute("disabled");
    button.style.cursor = "pointer";
  }
};
const handleStylePreviousButton = (button) => {
  if (currentPage > 1) {
    button.removeAttribute("disabled");
    button.style.opacity = "1";
  } else {
    button.style.opacity = ".2";
    button.setAttribute("disabled", true);
  }
};

const handleCheckingIfTargetIsButton = (target, type) => {
  console.log(target.tagName);
  if (target.tagName === "STRONG" || target.tagName === "SPAN") {
    if (type === "next") handleStyleNextButton(target.parentElement);
    else handleStylePreviousButton(target.parentElement);
  } else if (target.tagName === "BUTTON") {
    if (type === "next") handleStyleNextButton(target);
    else handleStylePreviousButton(target);
  }
};

const handleSetLoading = () => {
  Array.from(tours.children).map((tour) => (tour.style.display = "none"));
  /*const spinner = `
        <div class="sk-folding-cube" style="margin: 5% 50%; display: inline-block;">
        <div class="sk-cube1 sk-cube"></div>
        <div class="sk-cube2 sk-cube"></div>
        <div class="sk-cube4 sk-cube"></div>
        <div class="sk-cube3 sk-cube"></div>
        </div>`;*/
  const spinner = document.createElement("div");
  spinner.className = "sk-folding-cube";
  spinner.style.margin = "5% 50%";
  spinner.style.display = "inline-block";

  [0, 0, 0, 0].forEach((el, i) => {
    const div = document.createElement("div");
    div.className = `sk-cube${i + 1} sk-cube`;
    spinner.append(div);
  });
  tours.style.display = "block";
  tours.append(spinner);
};

const handleRemoveLoading = () => {
  Array.from(tours.children).map((tour) => (tour.style.display = "none"));
};
