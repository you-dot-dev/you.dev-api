/**
 * routers/auth/register.js
 */
const axios = require("axios");
const bcrypt = require("bcrypt");
const qs = require("qs");
const createStripeUser = require("../../../lib/auth/createStripeUser");

const SALT_ROUNDS = 10;

module.exports = async (request, response) => {

  const { password, email, username } = request.body;

  const db = request.app.get("appDb");

  try {
    const [emails, email_fields] = await db.execute(`SELECT email, username FROM users WHERE email=?`, [email]);
    if (emails.length > 0) {
      console.log("FOUND A DUPLICATE!!! NOT GOOD!!!");
      response.status(409).json({
        message: "Email already registered."
      });
      return "dupe";
    }
    const [usernames, username_fields] = await db.execute(`SELECT email, username FROM users WHERE username=?`, [username]);
    if (usernames.length > 0) {
      console.log("FOUND A DUPLICATE!!! NOT GOOD!!!");
      response.status(409).json({
        message: "Username taken."
      });
      return "dupe";
    }
  } catch (err) {
    console.log("CAN'T CONTACT DB!!! Sad!");
  }

  try {

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const stripeUser = await createStripeUser(username, email);

    console.log("stripeUser from createStripeUser?:", stripeUser);

    const [ rows, fields ] = await db.execute(
      `INSERT INTO users(email, username, password, stripe_customer_id) VALUES (?,?,?,?)`,
      [email, username, hash, stripeUser.id]);

    const [ newUser, newUserFields ] = await db.execute( `SELECT * FROM users WHERE email=?`, [email] );

    response.json({
      message: "Registration successful.",
      user: newUser[0],
      success: true
    });

  } catch (err) {
    console.log("err?:", err);
  }

}
