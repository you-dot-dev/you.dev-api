/**
 * routers/auth/register.js
 */
const axios = require("axios");
const bcrypt = require("bcrypt");

const SALT_ROUNDS = 10;

module.exports = async (request, response) => {

  const { password, email, username } = request.body;

  const db = request.app.get("appDb");

  try {

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const stripeUser = await axios({
      method: "POST",
      url: "https://api.stripe.com/v1/customers",
      data: qs.stringify({
        name: username,
        email,
      }),
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      }
    });

    console.log("stripeUser", stripeUser);

    const [ rows, fields ] = await db.execute(
      `INSERT INTO users(email, username, password, stripe_customer_id) VALUES (?,?,?,?)`,
      [email, username, hash, stripeUser.data.id]);

    response.json({
      message: "Registration successful."
    });

  } catch (err) {
    console.log("err?:", err);
  }

}
