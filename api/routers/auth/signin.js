/**
 * routers/auth/signin.js
 */
module.exports = async (request, response) => {

  const db = request.app.get("appDb");

  const { password, email, username } = request.body;

  try {

    const [ rows, fields ] = await db.execute( `SELECT * FROM users WHERE email=?`, [email] );
    const [ dbUser ] = rows;
    const match = await bcrypt.compare( password, dbUser.password );

    if ( match ) {

      delete( dbUser.password );
      request.session.user = dbUser;
      console.log("request.session", request.session);

      response.json({
        message: "Username and password matched.",
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

};
