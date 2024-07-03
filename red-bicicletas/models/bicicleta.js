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
bicicletaSchema.statics.allBicis = async function() {
    // this hace referencia al schema. find recibe el filtro (vacío en este caso) + el callback
    return await this.find({});
};

bicicletaSchema.statics.add = async function(aBici) {
    await this.create(aBici);
}

module.exports = mongoose.model('Bicicleta', bicicletaSchema);
