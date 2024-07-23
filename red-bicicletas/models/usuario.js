const mongoose = require('mongoose');
const Reserva = require('./reserva');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: String,
});

usuarioSchema.statics.allUsuarios = function() {
    // this hace referencia al schema. find recibe el filtro (vacío en este caso) + el callback
    return this.find({}).exec();
};

usuarioSchema.statics.add = function(usuario) {
    return this.create(usuario);
}

usuarioSchema.statics.reservar = (biciId, userId, desde, hasta) => {
    const reserva = new Reserva({bicicleta: biciId, usuario: userId, desde: desde, hasta: hasta});
    return reserva.save();
}

module.exports = mongoose.model('Usuario', usuarioSchema);