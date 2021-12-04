const path = require("path");
const hpp = require("hpp");
const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const viewRouter = require("./Routes/viewRoutes");
const bookingRouter = require("./Routes/bookingRoute");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/errorControllers");
const reviewRouter = require("./Routes/reviewRoutes");

const app = express();
app.enable("trust-proxy");

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src  'self' api.mapbox.com",
    "script-src-elem 'self' api.mapbox.com"
  );
  next();
});
//set up pug engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
//middlewares
app.use(express.static(path.join(__dirname, "public")));

app.use(helmet());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(express.json());

//data sanitization against NoSql query injection
app.use(mongoSanitize());

//data sanitization against xss
app.use(xss());

//prevent parametre pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);
app.use(compression());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//uncomment this after installing express-rate-limit

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this api, please try again in one hour",
});
app.use("/api", limiter);

app.use((req, res, next) => {
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Routes MIDDLEWARE
app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);

//unhandled routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
