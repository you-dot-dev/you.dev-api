const express = require("express");
const user = express.Router();
const jsonParse = express.json();
const { STRIPE_SECRET_KEY } = process.env;
const stripe = require("stripe")(STRIPE_SECRET_KEY);


/**
 * URI: /user/pageview
 * Method: POST
 * Content-Type: application/json
 */
user.post("/pageview", jsonParse, async (request, response) => {

  const { user_id, page_url } = request.body;
  const db = request.app.get("appDb");

  try {

    const [ rows, fields ] = await db.execute(
      `INSERT INTO page_views(user_id, page_url) VALUES (?,?)`,
      [user_id, page_url]);

    response.json({
      message: "Page view recorded."
    });

  } catch (err) {
    console.log("err?:", err);
  }

});

user.put("/update", jsonParse, async (request, response) => {

  try {

    const {
      username, email
    } = request.body;

    const db = request.app.get("appDb");
    const result = await db.execute(
      `UPDATE users SET username=?, email=? WHERE id=?;`,
      [username, email, request.session.user.id]
    );

    const [ updateUser ] = await db.execute(`SELECT * FROM users WHERE id=?;`, [request.session.user.id]);

    console.log("result?", result);

    response.json({
      message: "Successfully updated user info.",
      user: updateUser[0]
    });

  } catch (err) {
    console.log("err in /user/update?", err);
    response.json({
      message: "Error while updating user info.",
      error: err
    });
  }

});

user.post("/add-card", jsonParse, async (request, response) => {
  const { stripeCustomerId, paymentMethodId } = request.body;
  console.log("request.session", request.session);
  const paymentMethod = await stripe.paymentMethods.attach(
    paymentMethodId,
    { customer: request.session.user.stripe_customer_id }
  );
  response.json(paymentMethod);
});

user.get("/subscriptions", async (request, response) => {
  const subscriptions = await stripe.customers.retrieve(request.session.user.stripe_customer_id);
  response.json(subscriptions);
});



module.exports = user;
