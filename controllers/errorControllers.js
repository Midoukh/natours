const AppError = require('../utils/AppError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  const message = `Duplicate field value : ${value} please use another one.`;
  return new AppError(message, 400);
};
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};
const handleJWTError = () =>
  new AppError('Invalid Token. please log in again', 401);
const handleJWTExpiredError = () =>
  new AppError('You token was expired. Please log in again', 401);

const sendErrorDev = (err, res, req) => {
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
  } else {
    res.status(err.statusCode).render('error', {
      title: 'Something Went Wrong!',
      msg: err.message,
    });
  }
};
const sendErrorProd = (err, res, req) => {
  //Operation trusted errors: send them to the client

  //api errors
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      //Unknow Errors
      //1) Log error
      console.log('💣', err);
      //2)send generic message
      res.status(500).json({
        status: 'fail',
        message: 'Something went very wrong!',
      });
    }
  }
  //rendered website
  else {
    if (err.isOperational) {
      res.status(err.statusCode).render('error', {
        title: 'Something Went Wrong!',
        msg: err.message,
      });
    } else {
      //Unknow Errors
      //1) Log error
      console.err('💣', err);
      //2)send generic message
      res.status(err.statusCode).render('error', {
        title: 'Something Went Wrong!',
        msg: 'Please try again later',
      });
    }
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res, req);
  } else if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line prettier/prettier
    // eslint-disable-next-line prefer-object-spread
    let error = Object.assign({}, err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res, req);
  }
  next();
};

exports.forgotPassword = (req, res, next) => {};
exports.resetPassword = (req, res, next) => {};
