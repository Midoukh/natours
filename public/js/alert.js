export const showAlert = (type, message, time = 5) => {
  console.log(type, message);
  //type is eaither success or error
  hideAlert();
  const markup = `<div class="alert alert--${type}">${message}</div>`;

  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  setTimeout(() => {
    hideAlert();
  }, time * 1000);
};

export const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};
