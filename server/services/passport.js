const passport = require("passport")
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt")

passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_KEY
    },
    async (jwtPayload, done) => {
        try {
            return done(null, jwtPayload);
        } catch (error) {
            done(error, false);
        }
    }
))

module.exports = passport;
