export const handleSearch = async (e) => {
  const spinner = document.querySelector(".sk-circle");
  //set loading to true
  spinner.style.visibility = "visible";
  const url = "/api/v1/tours/search-tours";
  const data = {
    search: e.target.value,
  };
  console.log(data);
  await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      handlePopulateSearchList(res.data.filteredTours, {
        empty: e.target.value === "",
      });
      spinner.style.visibility = "hidden";
    })
    .catch((err) => {
      console.log(err);
      spinner.style.visibility = "hidden";
    });
};
const handlePopulateSearchList = (list, { empty }) => {
  const { origin } = location;
  console.log(location);
  const searchList = document.querySelector(".search-list");
  const message = document.createElement("h3");
  message.className = "search-message";

  searchList.style.visibility = "visible";
  searchList.innerHTML = "";
  message.innerHTML = "";
  if (!list.length) {
    message.innerHTML = "No tour was Found 🐵";
    searchList.append(message);

    console.log("No tours");
    console.log(message);
    return;
  }
  if (empty) {
    searchList.innerHTML = "";
    message.innerHTML = "SearchBar is empty 🐵";
    searchList.append(message);
    return;
  }
  console.log("Don't be here");
  list.forEach((tour) => {
    const { name, price, images } = tour;
    const tourCard = document.createElement("div");
    const link = `${origin}/tour/${tour.slug}`;
    tourCard.className = "tour-card--list";
    const img = document.createElement("img");
    const tourDetails = document.createElement("div");
    tourDetails.className = "tour-details--list";
    const tourName = document.createElement("h3");
    const tourPrice = document.createElement("h4");

    tourName.textContent = name;
    tourPrice.textContent = `$${price}`;
    tourPrice.style.color = colorizePrice(price);
    img.src = `/img/tours/${images[0]}`;

    tourCard.append(img);
    tourDetails.append(tourName);
    tourDetails.append(tourPrice);
    tourCard.append(tourDetails);
    searchList.append(tourCard);
    tourCard.addEventListener("click", () => {
      handleGoToTourPage(link);
    });
  });
  console.log("I called this function");
};

const colorizePrice = (price) => {
  if (+price <= 200) return "#eb8d2d";
  else if (+price > 200 && +price <= 600) return "#3073be";
  return "#e33b30";
};
const handleGoToTourPage = (link) => {
  if (link) {
    location.assign(link);
  }
};
const handleCloseSearchList = (e) => {
  //if className !== search-list
  const searchList = document.querySelector(".search-list");
  if (e.target.className !== "search-list") {
    console.log("This should close the searchList");
    searchList.style.visibility = "hidden";
  }
  console.log(searchList.parentElement.children);
};

document.addEventListener("click", handleCloseSearchList);
