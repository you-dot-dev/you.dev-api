exports.up = function(knex) {
  return knex.schema
    .createTable("articles", (table) => {
      table.increments("id");
      table.string("slug", 64);
      table.timestamp("created_at").defaultTo( knex.fn.now() );
      table.string("title", 64).notNullable();
      table.string("image", 64);
      table.string("author", 64);
      table.integer("time_to_read");
      table.text("body");
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable("articles");
};

