exports.up = function(knex) {
  return knex.schema
    .createTable("plans", (table) => {
      table.string("id", 64).notNullable();
      table.string("title", 254).notNullable();
      table.integer("price").notNullable();
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("plans");
};
