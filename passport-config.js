 /* The local authentication strategy authenticates users using a username and password.
  The strategy requires a verify callback, which accepts these credentials and calls done providing a user.
  flash messages are used with express-flash in order to display status information to the user.
   */

const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

function initialize (passport, getUserByName, getUserById) {

  const authenticateUser = async (name, password, done) => {
    const user = getUserByName(name)
    if (user == null) {
      return done(null, false, { message: "Incorrect username. Please try again." })
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: "Password incorrect. Please try again." })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ usernameField: "name" },
    authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize

