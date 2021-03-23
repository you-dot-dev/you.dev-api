const express = require("express");
const auth = express.Router();
const bcrypt = require("bcrypt");
const jsonParse = express.json();
const { generators } = require('openid-client');
const axios = require("axios");
const qs = require("qs");

const SALT_ROUNDS = 10;


auth.get("/userinfo", (request, response) => {
  console.log("request.session from userinfo?", request.session);
  response.json(request.session.user);
});

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

    const stripeUser = await axios({
      method: 'POST',
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
      request.session.user = dbUser;
      console.log("request.session", request.session);
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


/**
 * URI: /auth/redirect
 * Method: GET
 * Content-Type: application/json
 */
auth.get("/redirect", async (request, response) => {
  console.log("req.params?", request.params);
  console.log("req.query?", request.query);
  console.log("request.session?", request.session);

  const client = request.app.get("googleOAuthClient");
  const params = client.callbackParams(request);
  console.log("params?", params);

  const tokenSet = await client.callback(
    "http://localhost:7890/auth/redirect", params,
    {
      code_verifier: request.session["codeVerifier"]
    }
  );

  const claims = tokenSet.claims();
  const { email, name, iss } = claims;

  const db = request.app.get("appDb");

  try {
    const [ potentialUsers ] = await db.execute(`SELECT * FROM users WHERE email=?`, [email]);
    if (potentialUsers.length === 0) {
      await db.execute(
        `INSERT INTO users (username, email, google, issuer) VALUES (?,?,?,?)`,
        [name, email, 1, iss]
      );
      const [ users ] = await db.execute(`SELECT * FROM users WHERE email=?`, [email]);
      const [ dbUser ] = rows;
      delete dbUser.password;
      request.session.user = dbUser;
      console.log("dbUser wtf", dbUser);
      console.log("request.session:", request.session);
      console.log("We didn't have the user but we do now :)");
    } else {
      console.log("We have the user!");
      const [ dbUser ] = potentialUsers;
      delete dbUser.password;
      request.session.user = dbUser;
      console.log("request.session:", request.session);
    }
  } catch (err) {
    console.log("err", err);
  }

  response.redirect("http://localhost:8000/skillmap");
});


auth.get("/google", async (request, response) => {

  const code_verifier = generators.codeVerifier();
  const code_challenge = generators.codeChallenge(code_verifier);
  request.session["codeVerifier"] = code_verifier;

  const client = request.app.get("googleOAuthClient");
  const authorizationUrl = client.authorizationUrl({
    scope: 'openid email profile',
    resource: 'https://my.api.example.com/resource/32178',
    code_challenge,
    code_challenge_method: 'S256'
  });

  console.log("url?", authorizationUrl);
  console.log("request.session?", request.session);

  response.json({
    "message": "Generated Google OAuth authorization URL.",
    authorizationUrl
  });

});


module.exports = auth;
