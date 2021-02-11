const express = require("express");
const auth = express.Router();
const bcrypt = require("bcrypt");
const jsonParse = express.json();

const saltRounds = 10;

/** POST /auth/register
 */
auth.post("/register", jsonParse, (request, response) => {

  const { password, email, username } = request.body;

  bcrypt.genSalt(saltRounds, (err, salt) => {

    bcrypt.hash(password, salt, (err, hash) => {

      if (err) { console.error(err) }

      const db = request.app.get("appDb");

      db.execute(
        `INSERT INTO users(email, username, password) VALUES (?,?,?)`,
        [email, username, hash],
        (err, results, fields) => {
          console.log("err", err);
          console.log("results:", results);
          console.log("fields:", fields);

          response.json({
            message: "Registration successful."
          });

        }
      );
    });
  });

});

/** POST /auth/signin
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
