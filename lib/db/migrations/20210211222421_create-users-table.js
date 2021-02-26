exports.up = function(knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id");
      table.string("username", 32).notNullable();
      table.string("email", 254).notNullable();
      table.string("password", 254);
      table.boolean("google");
      table.boolean("github");
      table.string("issuer", 254);
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("users");
};
