const Usuario = require('../models/usuario');
const Token = require('../models/token');

module.exports = {
    confirmationGet: function(req, res, next) {
        Token.findOne({token: req.params.token}).then(token => {
            if (!token) return res.status(400).send({
                type: 'not-verified',
                msg: 'No encontramos un usuario con ese token. Quizá haya expirado y debas solicitar uno nuevo.',
            })
            Usuario.findById(token._userId).then(usuario => {
                if (!usuario) return res.status(400).send({msg: 'No encontramos un usuario con ese token'});
                if (usuario.verificado) return res.redirect('/users');
                usuario.verificado = true;
                usuario.save().then(() => {
                    res.redirect('/');
                }).catch(err => {
                    return res.status(500).send({msg: err.message});
                });
            });
        });
    }
}