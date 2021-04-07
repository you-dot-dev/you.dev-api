/**
 * routers/auth/userinfo.js
 */

const {
  NODE_ENV
} = process.env;

module.exports = (request, response) => {

  const log = {
    message:"request.session from /auth/userinfo",
    session: request.session
  };

  if ( NODE_ENV == "production" ) {
    console.log( JSON.stringify(log) );
  } else {
    console.log( log );
  }

  response.json( request.session.user );

}
