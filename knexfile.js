const {
  MYSQL_PASSWORD
} = process.env;

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host : '127.0.0.1',
      user : 'you-dev-rw',
      password : MYSQL_PASSWORD,
      database : 'you.dev'
    },

    migrations: {
      directory: "lib/db/migrations",
      tableName: "migrations"
    },

    seeds: {
      directory: "./lib/db/seeds"
    }
  },

  staging: {
    client: 'mysql2',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },

    pool: {
      min: 2,
      max: 10
    },

    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'mysql2',
    connection: {
      database: 'you.dev',
      user:     'you-dev-rw',
      password: MYSQL_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    }
  }

};
