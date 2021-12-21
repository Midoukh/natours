const tours = document.querySelector(".card-container");

const toursLength = tours ? tours.getAttribute("data-tourslength") : 0;
//page = 1: show from 0 to 3
//page = 2: show from 4 to 7
//each page can have 4 results
const RESULTS = 4;
let currentPage = 1;

export const handlePagination = (e) => {
  const btnId = handleGetButtonId(e.target);
  handleSetLoading();

  setTimeout(() => {
    handleRemoveLoading();
    if (btnId === "previous") previous(e.target);
    else next(e.target);
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
  const prevButton = document.getElementById("previous");

  //styling the next and the previous button
  if (currentPage * RESULTS >= parseInt(toursLength)) {
    handleCheckingIfTargetIsButton(button, "next");
    console.log("This condition should stop it");
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
  if (tours) {
    Array.from(tours.children).forEach((tour) => {
      const tourId = +tour.getAttribute("data-id");
      if (tourId) {
        if (tourId >= skip && tourId < skip + 4) {
          tour.style.display = "flex";
        } else {
          tour.style.display = "none";
        }
      }
    });
  }
};
const handleStyleNextButton = (button) => {
  if (currentPage * RESULTS > parseInt(toursLength)) {
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
  if (tours) {
    Array.from(tours.children).map((ele) => {
      if (ele.className !== "sk-folding-cube") ele.style.display = "none";
      else ele.style.display = "inline-block";
    });

    tours.style.display = "block";
  }
};

const handleRemoveLoading = () => {
  /*Array.from(tours.children).map((ele) => {
    if (ele.className === "sk-folding-cube") ele.style.display = "none";
  });*/
  if (tours) {
    tours.lastChild.style.display = "none";
    tours.style.display = "grid";
  }
};

//when click on next or previous: show spinner for 1.5s then continue to the next or the previous page
//DOM manipulation necessary for this to happen
//1)hide all the tours
//2)append the spinner to the end of the page
//3)after 1.5s remove the spinner
