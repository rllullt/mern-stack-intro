const Bicicleta = require("../models/bicicleta");

exports.bicicleta_list = function(req, res) {
    Bicicleta.find({}).exec().then(bicis => {
        res.render('bicicletas/index', {bicis: bicis});
    })
}

exports.bicicleta_create_get = function(req, res) {
    res.render('bicicletas/create');
}

exports.bicicleta_update_get = function(req, res) {
    Bicicleta.findByCode(req.params.code).then(bici => {
        res.render('bicicletas/update', {bici});
    });
}

exports.bicicleta_create_post = function(req, res) {
    const bici = new Bicicleta({code: req.body.id, color: req.body.color, modelo: req.body.modelo});
    bici.ubicacion = [req.body.lat, req.body.lng];
    Bicicleta.add(bici).then(() => {
        res.redirect('/bicicletas');
    });
}

exports.bicicleta_update_post = function(req, res) {
    Bicicleta.findByCode(req.params.code).then(bici => {
        bici.code = req.body.id;
        bici.color = req.body.color;
        bici.modelo = req.body.modelo;
        bici.ubicacion = [req.body.lat, req.body.lng];
        res.redirect('/bicicletas');
    });
}

exports.bicicleta_delete_post = function(req, res) {
    Bicicleta.removeByCode(req.body.id);
    res.redirect('/bicicletas');
}