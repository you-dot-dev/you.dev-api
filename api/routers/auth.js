const express = require("express");
const auth = express.Router();
const bcrypt = require("bcrypt");
const jsonParse = express.json();
const { generators } = require('openid-client');
const axios = require("axios");
const qs = require("qs");


const {
  NODE_ENV
} = process.env;


auth.get("/userinfo", require("./auth/userinfo") );
auth.post("/register", jsonParse, require("./auth/register") );
auth.post("/signin", jsonParse, require("./auth/signin") );
auth.get("/redirect", require("./auth/redirect") );
auth.get("/logout", require("./auth/logout") );


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
