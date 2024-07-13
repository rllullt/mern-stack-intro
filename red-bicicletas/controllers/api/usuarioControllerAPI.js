const Usuario = require('../../models/usuario');

exports.usuarios_list = async (req, res) => {
    Usuario.find({}).exec().then(usuarios => {
        res.status(200).json({
            usuarios: usuarios
        });
    });
}

exports.usuarios_create = (req, res) => {
    const usuario = new Usuario({nombre: req.body.nombre});

    usuario.save().then(() => {
        res.status(200).json(usuario);
    });
}

exports.usuario_reservar = (req, res) => {
    Usuario.reservar(req.body.bici_id, req.body.id, req.body.desde, req.body.hasta).then(() => {
        console.log('Reserva hecha');
        res.status(200).send();
    });
}