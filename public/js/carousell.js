const elem = document.querySelector(".main-carousel");
const flkty = new Flickity(elem, {
  // options
  cellAlign: "left",
  contain: true,
  draggable: true,
  wrapAround: true,
  autoPlay: true,
});
