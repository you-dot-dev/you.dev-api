/**
 *
 */
const mysql = require("mysql2/promise");

async function createDatabaseConnections(api) {

  const CONNECT_RETRIES = 5;

  for (let i = 0; i < CONNECT_RETRIES; i++) {
    console.log(`About to try attempt #${i+1}`);
    try {
      const root = await mysql.createConnection( require("./config/root") );
      api.set("rootDb", root);
      const app = await mysql.createConnection( require("./config/app") );
      api.set("appDb", app);
      return true;
    } catch (err) {
      console.log(`Attempt ${i+1} fail :( err:`, err);
      return false;
    }
  }
};

module.exports = createDatabaseConnections;
