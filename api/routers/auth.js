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
auth.post("/signin", jsonParse, (request, response) => {

  const { password, email, username } = request.body;

      const db = request.app.get("appDb");

      db.execute(
        `SELECT * FROM users WHERE email=?`,
        [email],

        (err, results, fields) => {
          if (err) { console.log("err", err); }

          const [ dbUser ] = results;

          bcrypt.compare(password, dbUser.password).then( (result) => {
            console.log("Are they the same?", result);
          });

          response.json({
            message: "Sign in successful."
          });

        });

});
module.exports = auth;
