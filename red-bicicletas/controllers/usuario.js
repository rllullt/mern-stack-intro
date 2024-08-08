const Usuario = require('../models/usuario');

module.exports = {
    list: function(req, res, next) {
        Usuario.find({}).then(usuarios => {
            res.render('users/index', {usuarios: usuarios});
        });
    },
    update_get: function(req, res, next) {
        Usuario.findById(req.params.id).then(usuario => {
            res.render('users/update', {errors: {}, usuario: usuario});
        });
    },
    update: function(req, res, next) {
        const update_values = {nombre: req.body.nombre};
        Usuario.findByIdAndUpdate(req.param.id, update_values).then(usuario => {
            res.redirect('/users');
            return;
        }).catch(err => {
            console.log(err);
            res.render('users/update', {
                errors: err.errors,
                usuario: new Usuario({
                    nombre: req.body.nombre,
                    email: req.body.email,
                }),
            });
        });
    },
    create_get: function(req, res, next) {
        res.render('users/create', {errors: {}, usuario: new Usuario()});
    },
    create: function(req, res, next) {
        console.log('in create:');

        if (req.body.password != req.body.confirm_password) {
            const sending_object = {
                errors: {confirm_password: {message: "No coincide con el password ingresado"}},
                usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})
            };
            console.log('sending_object:', sending_object);
            res.render('users/create', {
                errors: {confirm_password: {message: "No coincide con el password ingresado"}},
                usuario: new Usuario({nombre: req.body.nombre, email: req.body.email})
            });
            return;
        }

        console.log('in create, after errors. Creating user...');

        Usuario.create({
            nombre: req.body.nombre,
            email: req.body.email,
            password: req.body.password,
        }).then(nuevoUsuario => {
            nuevoUsuario.enviar_email_bienvenida();
            res.redirect('/users');
        }).catch(err => {
            res.render('users/create', {errors: err.errors, usuario: new Usuario()});
        })
    },
    delete: function(req, res, next) {
        Usuario.findByIdAndDelete(req.body.id).then(() => {
            res.redirect('/users');
        }).catch(err => {
            next(err);
        });
    },
}