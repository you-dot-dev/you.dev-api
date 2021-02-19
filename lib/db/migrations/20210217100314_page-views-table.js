exports.up = function(knex) {
  return knex.schema.createTable( "page_views", (table) => {
    table.increments("id");
    table.integer("user_id").notNullable();
    table.string("page_url", 254).notNullable();
    table.timestamp("viewed_at").defaultTo( knex.fn.now() );
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable("page_views");
};

