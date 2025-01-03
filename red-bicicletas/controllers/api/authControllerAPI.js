const Usuario = require('../../models/usuario');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: function (req, res, next) {
        Usuario.findOne({ email: req.body.email }).then(user => {
            console.log('user:', user);
            if (!user) return res.status(401).json({ status: 'error', message: 'Invalid email', data: null });
            if (user.validPassword(req.body.password) === false) return res.status(401).json({ status: 'error', message: 'Invalid password', data: null });

            // User exists and password is valid
            const token = jwt.sign({ id: user._id }, req.app.get('secretKey'), { expiresIn: '7d' });
            return res.status(200).json({ message: 'usuario encontrado', data: { user: user, token: token } });
        }).catch(err => {
            next(err);
        });
    },
    forgotPassword: function (req, res, next) {
        Usuario.findOne({ email: req.body.email }).then(user => {
            if (!user) return res.status(401).json({ message: 'No existe el usuario', data: null });
            user.resetPassword().then(() => {
                return res.status(200).json({ message: 'Se envió email para restablecer contraseña', data: null });
            }).catch(err => {
                next(err);
            });
        }).catch(err => {
            next(err);
        });
    },
    authFacebookToken: function(req, res, next) {
        if (req.user) {  // se puede usar el user, porque
                         // se usó el passport.authenticate con facebook token como middleware
                         // en la ruta para facebook_token en auth.js
            req.user.save().then(() => {
                const token = jwt.sign({id: req.user.id}, req.app.get('secretKey'), {expiresIn: '7d'});
                res.status(200).json({message: "Usuario encontrado o creado!", data: {user: req.user, token: token}});
            }).catch(err => {
                console.error(err);
                res.status(500).json({message: err.message});
            })
        }
        else {
            res.status(401);
        }
    }
};
