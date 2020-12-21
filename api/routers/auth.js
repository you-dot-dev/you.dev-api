const express = require("express");
const auth = express.Router();

auth.post("/register", (request, response) => {

  response.json({
    message: "Registration successful."
  });

})

module.exports = auth;
