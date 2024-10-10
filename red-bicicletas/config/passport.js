const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const Usuario = require('../models/usuario');

passport.use(new localStrategy(function (email, password, done) {
    Usuario.findOne({ email: email }).then(user => {
        if (!user) return done(null, false, { message: 'Email no existe' });
        if (!user.validPassword(password)) return done(null, false, { message: 'Password Incorrecto' });
        done(null, user);
    }).catch(err => {
        return done(err);
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