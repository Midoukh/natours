const stripe = require("stripe");
const catchAsync = require("../utils/catchAsync");
const Tour = require("../models/tourModel");
const User = require("../models/userModel");

const Booking = require("../models/bookingModel");
const factory = require("./handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1) Get the currently booked tour
  //const tour = await Tour.findById(req.params.tourID);
  const tour = await Tour.findOne({ slug: req.params.slug });

  //product image
  let prodImg;

  if (process.env.NODE_ENV === "development")
    prodImg = `http://localhost:3000/img/tours/${tour.imageCover}`;
  else prodImg = `"https://livest.herokuapp.com/img/tours/${tour.imageCover}`;
  //2)Create a checkout session

  const session = await stripe(
    process.env.STRIPE_SECRET
  ).checkout.sessions.create({
    payment_method_types: ["card"],
    /*success_url: `${req.protocol}://${req.get("host")}/?tour=${tour.id}&user=${
      req.user.id
    }&price=${tour.price}`,*/
    success_url: `${req.protocol}://${req.get("host")}/my-tours?alert=booking`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: tour.id,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [
          //`${req.protocol}://${req.get("host")}/img/tours/${tour.imageCover}`,
          prodImg,
        ],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });

  //3) Create session as a response
  console.log(prodImg);
  res.status(200).json({
    status: "succes",
    session,
    /*tourDetails: {
      name: `${tour.name} Tour`,
      description: tour.summary,
      images: ["image url from the deployed server"],
      amount: tour.price * 100,
      currency: "usd",
      quantity: 1,
    },*/
  });
});

/*exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;
  console.log({ tour, user, price });
  if (!tour && !user && !price) return next();

  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split('?')[0]);
});*/

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);

const createBookingCheckout = async (session) => {
  const tour = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.line_items[0].amount / 100;
  await Booking.create({ tour, user, price });
};

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return res.status(400).send("Webhook error" + " " + err.message);
  }
  if (event.type === "checkout.session.completed")
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};
