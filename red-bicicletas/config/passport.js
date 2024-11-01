const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');

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
        return cb(null, user);
    }).catch(err => {
        return cb(err, null);
    });
  }
));

passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.HOST + "/auth/facebook/callback",
},
function(accessToken, refreshToken, profile, cb) {
    User.findOneOrCreateByFacebook(profile).then(user => {
        return cb(null, user);
    }).catch(err => {
        return cb(err, null);
    });
}));

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