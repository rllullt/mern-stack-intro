const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new localStrategy(function (email, password, done) {
    Usuario.findOne({ email: email }).then(user => {
        if (!user) return done(null, false, { message: 'Email no existe' });
        if (!user.validPassword(password)) return done(null, false, { message: 'Password Incorrecto' });
        done(null, user);
    }).catch(err => {
        return done(err);
    });
}));

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.HOST + "/auth/google/callback",  // HOST: local o producción
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('profile:', profile);
    Usuario.findOneOrCreateByGoogle(profile).then(user => {
        if (user) return cb(null, user);
        return cb(err, null);
    }).catch(err => {
        return cb(err, null);
    });
  }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Usuario.findById(id).then(user => {
        done(null, user);
    }).catch(err => {
        done(err);
    });
});

module.exports = passport;