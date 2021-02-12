const mysql = require("mysql2/promise");


/** createDatabaseConnections
 *
 * @param "api" - an Express application
 *
 */
async function createDatabaseConnections(api) {

  const CONNECT_RETRIES = 5;

  for (let i = 0; i < CONNECT_RETRIES; i++) {

    console.log(`Trying to contact database. Attempt #${i+1}.`);

    try {

      const root = await mysql.createConnection( require("./config/root") );
      api.set("rootDb", root);
      console.log(`root dbConnection established.`);

      const app = await mysql.createConnection( require("./config/app") );
      api.set("appDb", app);
      console.log(`app dbConnection established.`);

      break;

    } catch (err) {

      console.log(`Could not contact database Waiting ${i+1} second/s to retry.`);

      await new Promise( (resolve, reject) => {
        setTimeout( () => { resolve(`Waited ${i+1} seconds to retry.`) }, 1000*(i+1) );
      });

      continue;
    }

  }

};

module.exports = createDatabaseConnections;
