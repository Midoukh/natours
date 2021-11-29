export const showAlert = (type, message) => {
  console.log(type, message);
  //type is eaither success or error
  hideAlert();
  const markup = `<div class="alert alert--${type}">${message}</div>`;

  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);

  setTimeout(() => {
    hideAlert();
  }, 3000);
};

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};
