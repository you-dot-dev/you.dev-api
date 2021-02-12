const express = require("express");
const auth = express.Router();
const bcrypt = require("bcrypt");
const jsonParse = express.json();

const SALT_ROUNDS = 10;


/**
 * URI: /auth/register
 * Method: POST
 * Content-Type: application/json
 */
auth.post("/register", jsonParse, async (request, response) => {

  const { password, email, username } = request.body;
  const db = request.app.get("appDb");

  try {

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    const [ rows, fields ] = await db.execute(
      `INSERT INTO users(email, username, password) VALUES (?,?,?)`,
      [email, username, hash]);

    response.json({
      message: "Registration successful."
    });

  } catch (err) {
    console.log("err?:", err);
  }

});


/**
 * URI: /auth/signin
 * Method: POST
 * Content-Type: application/json
 */
auth.post("/signin", jsonParse, async (request, response) => {

  const db = request.app.get("appDb");
  const { password, email, username } = request.body;

  try {
    const [ rows, fields ] = await db.execute(`SELECT * FROM users WHERE email=?`, [email] );
    const [ dbUser ] = rows;
    const match = await bcrypt.compare(password, dbUser.password);
    if (match) {
      delete(dbUser.password);
      response.json({
        message: "Sign in successful.",
        user: dbUser
      });
    } else {
      response.status(401).json({
        message: "Invalid credentials"
      });
    }
  } catch (err) {
    console.log("err:", err);
  }

});

module.exports = auth;
