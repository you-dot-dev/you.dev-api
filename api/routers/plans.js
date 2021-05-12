const express = require("express");
const plans = express.Router();

plans.get("/", async (request, response) => {

  const db = request.app.get("appDb");

  const [ plans ] = await db.execute(`SELECT * FROM plans;`);

  response.json({
    message: "You got plans!!",
    data: plans
  });

});

module.exports = plans;
