
exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {id: 1, username: 'john_doe', email: "johndoe@gmail.com", password: "$2b$10$o5VVmUiNLJKE0Yb/ze7DjeId56WDU0C/YLw9jhHpfHmYS6lhweWBS"},
        {id: 2, username: 'angelika', email: "angelika.hoeflich@gmail.com", password: "$2b$10$w09L9AwqxHkIZNaPcUpmce76/5NeUTw6TFSylloEdlQjV0mlZtira"}, /* test-password */
        {id: 3, username: 'paul', email: "paul@you.dev", password: "$2b$10$w09L9AwqxHkIZNaPcUpmce76/5NeUTw6TFSylloEdlQjV0mlZtira"} /* test-password */
      ]);
    });
};
