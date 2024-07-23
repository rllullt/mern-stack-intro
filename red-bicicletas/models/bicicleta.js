const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bicicletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: { type: '2dsphere', sparse: true }
    }
});

bicicletaSchema.statics.createInstance = function(code, color, modelo, ubicacion) {
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion,
    });
};

bicicletaSchema.methods.toString = function() {
    return `code: ${this.code} | color: ${this.color}`;
};

// All three parameter [condition, query projection,
// general query options]
// First parameter is {} i.e. no condition
// Second parameter is null i.e. no projections
// Third parameter is null i.e. no query options (e.g. limit)
bicicletaSchema.statics.allBicis = function() {
    // this hace referencia al schema. find recibe el filtro (vacío en este caso) + el callback
    return this.find({}).exec();
};

bicicletaSchema.statics.add = function(aBici) {
    return this.create(aBici);
}

bicicletaSchema.statics.findByCode = function(aCode) {
    return this.findOne({code: aCode}).exec();
}

bicicletaSchema.statics.removeByCode = function(aCode) {
    return this.deleteOne({code: aCode}).exec();
}

module.exports = mongoose.model('Bicicleta', bicicletaSchema);
