const mongoose = require('mongoose');
const Reserva = require('./reserva');
const Schema = mongoose.Schema;

const usuarioSchema = new Schema({
    nombre: String,
});

usuarioSchema.statics.reservar = async (biciId, userId, desde, hasta) => {
    const reserva = new Reserva({bicicleta: biciId, usuario: userId, desde: desde, hasta: hasta});
    await reserva.save();
}

module.exports = mongoose.model('Usuario', usuarioSchema);