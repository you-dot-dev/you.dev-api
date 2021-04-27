/**
 *
 * routers/auth/redirect.js
 */
const axios = require("axios");
const qs = require("qs");

const createStripeUser = require("../../../lib/auth/createStripeUser");
const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  REDIRECT_URI
} = process.env;


module.exports = async (request, response) => {

  console.log("req.params?", request.params);
  console.log("req.query?", request.query);
  console.log("req.query['scope']?", request.query["scope"]);
  console.log("req.headers?", request.headers);
  console.log("request.session?", request.session);

  if ( request.query["scope"] && request.query["scope"].includes("googleapis") ) {
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
  } else {
    try {
      console.log("Github flow is working!");
      const code = request.query["code"];
      console.log("code?:", code);
      const params = {
        client_id: `${GITHUB_CLIENT_ID}`,
        client_secret: `${GITHUB_CLIENT_SECRET}`,
        code,
        state: `${request.session["state"]}`,
        redirect_uri: `${REDIRECT_URI}`
      };
      const url = `https://github.com/login/oauth/access_token?${qs.stringify(params)}`
      console.log("access token request?:", url);
      const { data } = await axios.post(url, {
        withCredentials: true,
        headers: {
          "Accept": "application/json"
        }
      });
      const { access_token, token_type, scope } = qs.parse(data);

      const githubUser = await axios.get("https://api.github.com/user", {
        headers: {
          "Authorization": `token ${access_token}`
        }
      });

      console.log("githubUser?:", githubUser.data);

      const db = request.app.get("appDb");
      const username = githubUser.data.login;
      await db.execute(
        `INSERT INTO users (username, github, issuer) VALUES (?,?,?)`,
        [username, 1, "github"]
      );

      const [ users ] = await db.execute( `SELECT * FROM users WHERE username=?;`, [username] );
      const [ dbUser ] = users;

      dbUser.email = `${username} (no email)`;

      request.session.user = dbUser;


    } catch (err) {
      console.log("err in github authcode?:", err);
    }

  }


  response.redirect("http://localhost:8000/skillmap");
};
