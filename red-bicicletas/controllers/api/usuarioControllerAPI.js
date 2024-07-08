const Usuario = require('../../models/usuario');

exports.usuarios_list = async (req, res) => {
    const usuarios = await Usuario.find({});
    res.status(200).json({
        usuarios: usuarios
    });
}

exports.usuarios_create = (req, res) => {
    const usuario = new Usuario({nombre: req.body.nombre});

    usuario.save().then(() => {
        res.status(200).json(usuario);
    });
}

exports.usuario_reservar = async (req, res) => {
    await Usuario.reservar(req.body.bici_id, req.body.id, req.body.desde, req.body.hasta);
    res.status(200).send();
}