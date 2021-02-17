
exports.seed = function(knex) {
  return knex('users').del()
    .then(function () {
      return knex('users').insert([
        {id: 1, username: 'john_doe', email: "johndoe@gmail.com", password: "$2b$10$o5VVmUiNLJKE0Yb/ze7DjeId56WDU0C/YLw9jhHpfHmYS6lhweWBS"},
        {id: 2, username: 'jane_doe', email: "janedoe@gmail.com", password: "$2b$10$v20b5IDM9M8JwFHbuOMyWOFtY7jHpOnxqHKcV3VjCCF4a2iD9VqHW"},
        {id: 3, username: 'doe_doe', email: "doedoe@gmail.com", password: "$2b$10$c1kgoBw5lSQZLaGURhwPLOO2xXOcIY/s2zwqTpuIEicbNR/phAE4K"}
      ]);
    });
};
