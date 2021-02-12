'use strict';

/** Dependencies
 */
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("../lib/passport");
const mysql = require('mysql2/promise');
const cors = require("cors");

const createDatabaseConnections = require("../lib/db/connections");

/** Create API
 */
const api = express();

async function main() {

  try {
    await createDatabaseConnections(api);
  } catch (err) {
    console.log("err?:", err);
  }
}

main();



/** Set CORS policy
 */
api.use( cors({
  origin: 'http://localhost:8000',
  optionsSuccessStatus: 200
}) );

/** Get Environment Variables
 */
const {
  SESSION_SECRET,
  COOKIE_DOMAIN,
} = process.env;

createDatabaseConnections(api);



const sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(require("../lib/db/config/root")),

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
api.get(`/`, (req, res) => {
  res.json({
    message: "Welcome to You.Dev"
  });
});

api.use(`/auth`, require("./routers/auth") );
api.use(`/articles`, require("./routers/articles"));


/** Listen for traffic
 */
const DEFAULT_PORT = 7890;
const PORT = process.env.PORT || DEFAULT_PORT;

api.listen( PORT, () => {
  console.log(`api.you.dev is listening for HTTP on ${PORT}.`);
});
