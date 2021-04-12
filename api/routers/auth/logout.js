/**
 * routers/auth/logout.js
 */

const {
  NODE_ENV
} = process.env;

module.exports = (request, response) => {

  const log = {
    message:"request.session from /auth/logout",
    session: request.session
  };

  if ( NODE_ENV == "production" ) {
    console.log( JSON.stringify(log) );
  } else {
    console.log( log );
  }

  request.session.destroy();

  response.json({
    message: "User has been signed out successfully."
  });

}
