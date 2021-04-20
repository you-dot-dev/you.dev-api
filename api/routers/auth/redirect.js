/**
 * routers/auth/redirect.js
 */
const createStripeUser = require("../../../lib/auth/createStripeUser");
module.exports = async (request, response) => {
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
      const stripeUser = await createStripeUser(name, email);
      await db.execute(
        `INSERT INTO users (username, email, google, issuer, stripe_customer_id) VALUES (?,?,?,?,?)`,
        [name, email, 1, iss, stripeUser.id]
      );
      const [ users ] = await db.execute(`SELECT * FROM users WHERE email=?`, [email]);
      const [ dbUser ] = users;
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
};
