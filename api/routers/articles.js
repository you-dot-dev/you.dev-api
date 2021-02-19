const express = require("express");
const articles = express.Router();

articles.get("/", (request, response) => {
  
  response.json({
    message: "You got Articles!!"
  });

});

articles.get("/:slug", async (request, response) => {

  const db = request.app.get("appDb");

  const [articles] = await db.execute(`SELECT * FROM articles WHERE slug=? `, [request.params.slug]);

  const [article] = articles;
  response.json({
    message: "You got the Article!!",
    article
  });

});

articles.post("/", (request, response) => {

  response.json({
    message: "You posted an Article!!"
  });

});

module.exports = articles;
