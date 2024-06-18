const Bicicleta = require('../../models/bicicleta');
const BicicletaContainer = require('../../models/bicicletaContainer');

const a = new Bicicleta(1, 'rojo', 'urbana', [-34.6012424, -58.3861497]);
const b = new Bicicleta(2, 'azul', 'urbana', [-34.596932, -58.3808287]);

const bicicletaContainer = new BicicletaContainer();

bicicletaContainer.add(a);
bicicletaContainer.add(b);

exports.bicicleta_list = function(req, res) {
    res.status(200).json({
        bicicletas: bicicletaContainer.allBicis
    });
}

exports.bicicleta_create = function(req, res) {
    const bici = new Bicicleta(parseInt(req.body.id), req.body.color, req.body.modelo);
    bici.ubicacion = [parseFloat(req.body.lat), parseFloat(req.body.lng)];

    bicicletaContainer.add(bici);

    res.status(200).json({
        bicicleta: bici
    });
}

exports.bicicleta_delete = function(req, res) {
    bicicletaContainer.removeById(parseInt(req.body.id));
    res.status(204).send();
}