const mongoose = require('mongoose');
const Reserva = require('./reserva');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: String,
});

usuarioSchema.statics.reservar = (biciId, userId, desde, hasta) => {
    const reserva = new Reserva({bicicleta: biciId, usuario: userId, desde: desde, hasta: hasta});
    return reserva.save();
}

module.exports = mongoose.model('Usuario', usuarioSchema);