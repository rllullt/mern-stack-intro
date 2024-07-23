const Bicicleta = require('../../models/bicicleta');
const bicicletaContainer = require('../../models/bicicletaContainer');

const a = Bicicleta.createInstance(1, 'rojo', 'urbana', [-34.6012424, -58.3861497]);
const b = Bicicleta.createInstance(2, 'azul', 'urbana', [-34.596932, -58.3808287]);

bicicletaContainer.add(a);
bicicletaContainer.add(b);

exports.bicicleta_list = function(req, res) {
    Bicicleta.find({}).exec().then(bicicletas => {
        res.status(200).json({
            bicicletas: bicicletas
        });
    });
}

exports.bicicleta_create = function(req, res) {
    const bici = Bicicleta.createInstance(parseInt(req.body.code), req.body.color, req.body.modelo);
    bici.ubicacion = [parseFloat(req.body.lat), parseFloat(req.body.lng)];

    bici.save().then(() => {
        res.status(200).json(bici);
    });
}

exports.bicicleta_delete = function(req, res) {
    Bicicleta.deleteOne({ code: parseInt(req.body.code) }).then(d => {
        // returns {deletedCount: 1}
        res.status(204).send();
    });
}

exports.bicicleta_update = function(req, res) {
    const query = { code: parseInt(req.body.code) };
    Bicicleta.updateOne(query, {
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng],
    }).then(u => {
        res.status(204).send();
    });
}