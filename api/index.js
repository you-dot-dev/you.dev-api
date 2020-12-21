'use strict';

/** Dependencies
 */
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("../lib/passport");



/** Create API
 */
const api = express();



/** Configuration
 */
const {
  SESSION_SECRET,
  COOKIE_DOMAIN,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE
} = process.env;

const databaseConfig = {
  host: MYSQL_HOST,
  port: MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE
}

const sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(databaseConfig),

  cookie: {
    domain: COOKIE_DOMAIN,
    secure: true,
    httpOnly: true,
    sameSite: true,
    path: "/",
    maxAge: null
  }
}



/** Middleware
 */
api.use( session(sessionConfig) );
api.use( passport.initialize() );
api.use( passport.session() );



/** Routes
 */
api.use(`/auth`, require("./routers/auth") );



/** Listen for traffic
 */
const DEFAULT_PORT = 7890;
const PORT = process.env.PORT || DEFAULT_PORT;

api.listen( PORT, () => {
  console.log(`api.you.dev is listening for HTTP on ${PORT}.`);
});
