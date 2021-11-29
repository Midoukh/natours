const express = require('express');
const Router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

//routes handlers
Router.post('/signup', authController.signUp);
Router.post('/login', authController.login);
Router.get('/logout', authController.logout);

Router.post('/forgotPassword', authController.forgetPassword);
Router.patch('/resetPassword/:token', authController.resetPassword);

Router.patch(
  '/updateMe',
  authController.protect,
  userController.updateUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);

Router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);

Router.get(
  '/me',
  authController.protect,
  userController.getMe,
  userController.getUserById
);

//Router.use(authController.restrictTo('admin'));

Router.route('/')
  .get(userController.getAllUsers)
  .post(authController.protect, userController.createUser);
Router.route('/:id')
  .get(authController.protect, userController.getUserById)
  .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser);

module.exports = Router;
