const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(
    (username, password, done) => {
      return done( null, {username:"Demo user", role:"admin"} );
    }
  )
);

module.exports = passport;
