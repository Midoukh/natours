export const getData = async (url) => {
  const response = await fetch(url, {
    method: "GET",
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));

  console.log(response);
};

export const postData = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((data) => data.json())
    .catch((err) => console.log(err));

  console.log(response);
};

export const simplifyString = (str) => {
  if (str.split(" ").length < 2) return `/${str.toLowerCase()}`;

  return `/${str.toLowerCase().split(" ").join("-")}`;
};
