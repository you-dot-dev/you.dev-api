
exports.seed = function(knex) {
  return knex('plans').del()
    .then(function () {
      return knex('plans').insert([
        {id: "plan_J7zBzy2zjOdIqI", title: 'Enterprise-grade', price: 500}
      ]);
    });
};
