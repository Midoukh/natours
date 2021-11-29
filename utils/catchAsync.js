//standard error catcher

module.exports = (fn) => {
  //it receive an asynchrounous function
  //and return another function
  return (req, res, next) =>
    // eslint-disable-next-line no-undef
    fn(req, res, next).catch((error) => next(error));
};
