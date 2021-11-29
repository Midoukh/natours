const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/AppError');
exports.getOverview = catchAsync(async (req, res) => {
  //1 get tours data from collection
  const tours = await Tour.find();
  //2 build template

  //3 render that template using tour data from 1
  res.status(200).render('overview', {
    tour: 'All Tours',
    tours,
  });
});

exports.getTour = async (req, res, next) => {
  //get mapbox

  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
};

exports.getMyTours = async (req, res, next) => {
  //1) find all booking
  const bookings = await Booking.find({ user: req.user.id });

  //2) Find tours with the returned IDs
  const tourIds = bookings.map((item) => item.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours,
  });
};

exports.getLoginForm = async (req, res) => {
  res.status(200).render('loginForm', {
    title: 'Log into your account',
  });
};
exports.getSignUpForm = async (req, res) => {
  res.status(200).render('signupForm', {
    title: 'Create A New Account account',
  });
};
exports.getForgetPasswordForm = async (req, res) => {
  res.status(200).render('forgetPassword', {
    title: 'Reset Your Password',
  });
};
exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  console.log(req.user.id);
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser,
  });
});
