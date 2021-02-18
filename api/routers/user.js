const express = require("express");
const user = express.Router();
const jsonParse = express.json();


/**
 * URI: /user/pageview
 * Method: POST
 * Content-Type: application/json
 */
user.post("/pageview", jsonParse, async (request, response) => {

  const { user_id, page_url } = request.body;
  const db = request.app.get("appDb");

  try {

    const [ rows, fields ] = await db.execute(
      `INSERT INTO page_views(user_id, page_url) VALUES (?,?)`,
      [user_id, page_url]);

    response.json({
      message: "Page view recorded."
    });

  } catch (err) {
    console.log("err?:", err);
  }

});



module.exports = user;
