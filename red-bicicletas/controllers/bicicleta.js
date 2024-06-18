const Bicicleta = require("../models/bicicleta");
const BicicletaContainer = require("../models/bicicletaContainer");

const a = new Bicicleta(1, 'rojo', 'urbana', [-34.6012424, -58.3861497]);
const b = new Bicicleta(2, 'azul', 'urbana', [-34.596932, -58.3808287]);

const bicicletaContainer = new BicicletaContainer();

bicicletaContainer.add(a);
bicicletaContainer.add(b);

exports.bicicleta_list = function(req, res) {
    res.render('bicicletas/index', {bicis: bicicletaContainer.allBicis});
}

exports.bicicleta_create_get = function(req, res) {
    res.render('bicicletas/create');
}

exports.bicicleta_update_get = function(req, res) {
    const bici = bicicletaContainer.findById(req.params.id);

    res.render('bicicletas/update', {bici});
}

exports.bicicleta_create_post = function(req, res) {
    const bici = new Bicicleta(req.body.id, req.body.color, req.body.modelo);
    bici.ubicacion = [req.body.lat, req.body.lng];
    bicicletaContainer.add(bici);

    res.redirect('/bicicletas');
}

exports.bicicleta_update_post = function(req, res) {
    const bici = bicicletaContainer.findById(req.params.id);
    bici.id = req.body.id;
    bici.color = req.body.color;
    bici.modelo = req.body.modelo;
    bici.ubicacion = [req.body.lat, req.body.lng];

    res.redirect('/bicicletas');
}

exports.bicicleta_delete_post = function(req, res) {
    bicicletaContainer.removeById(req.body.id);
    
    res.redirect('/bicicletas');
}