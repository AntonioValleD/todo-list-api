const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
require('dotenv').config();

const initPassport = () => {
    const strategy = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
        secretOrKey: process.env.JWT_SECRET
    };
    passport.use(new JwtStrategy(strategy, (decoded, done) => {
        return done(null, decoded);
    }));
};

const protectWithJwt = (req, res, next) => {
    if (req.path == '/' || req.path == '/auth/signup' || req.path == '/auth/login'){
        return next();
    }
    return passport.authenticate('jwt', {session: false})(req, res, next);
};

exports.initPassport = initPassport;
exports.protectWithJwt = protectWithJwt;