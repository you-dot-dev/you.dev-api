const express = require("express");
const articles = express.Router();

articles.get("/", (request, response) => {
  
  response.json({
    message: "You got Articles!!"
  });

});

articles.post("/", (request, response) => {

  response.json({
    message: "You posted an Article!!"
  });

});

module.exports = articles;
