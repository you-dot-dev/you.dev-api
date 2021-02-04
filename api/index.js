'use strict';

/** Dependencies
 */
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const passport = require("../lib/passport");
const mysql = require('mysql2');
const cors = require("cors");

/** Create API
 */
const api = express();

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
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_ROOT_PASSWORD,
  MYSQL_DATABASE
} = process.env;

/** Create database config
 */
const appDb = {
  host: MYSQL_HOST,
  port: +MYSQL_PORT,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE
}
const rootDb = {
  host: MYSQL_HOST,
  port: +MYSQL_PORT,
  user: "root",
  password: MYSQL_ROOT_PASSWORD,
  database: MYSQL_DATABASE
}


api.set("rootDb", mysql.createConnection(rootDb));
api.set("appDb", mysql.createConnection(appDb));


/** Make sure sessions table exists
 */
/*db.query(
  'CREATE TABLE IF NOT EXISTS sessions;',

  (err, results, fields) => {
    if (err) {
      console.error(err);
    }
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);*/

const sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MySQLStore(rootDb),

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
