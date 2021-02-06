// lib/db/config/root.js

// Get Environment Variables
const {
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_ROOT_PASSWORD,
  MYSQL_DATABASE
} = process.env;

// Export root db connection config
module.exports = {
  host: MYSQL_HOST,
  port: +MYSQL_PORT,
  user: "root",
  password: MYSQL_ROOT_PASSWORD,
  database: MYSQL_DATABASE
}
