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

module.exports = auth;
