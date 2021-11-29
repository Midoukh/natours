/*eslint-disable*/
import { PUB_STRIPE_API_KEY } from "./constants.js";
const stripe = Stripe(PUB_STRIPE_API_KEY);

export const bookTour = async (slug) => {
  //1) Get checkout session from endpoint API
  const url = `/api/v1/bookings/checkout-session/${slug}`;
  console.log(url);
  const session = await fetch(url, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch((err) => {
      showAlert("err", err);
    });
  console.log(session);

  //2) Create checkout form + charge credit card
  await stripe.redirectToCheckout({
    sessionId: session.session.id,
  });
};
