const mongoose = require('mongoose');
const Reserva = require('./reserva');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const saltRounds = 10;  // introduces some randomness to a ‘cryptonization’

const validateEmail = function(email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
}

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio'],
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,  // install this feature via `npm i mongoose-unique-validator --save`
        validate: [validateEmail, 'Por favor, ingrese un email válido'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
    password: {
        type: String,
        required: [true, 'El password es obligatorio'],
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false,
    },
});

/**
 * PATH hace referencia al atributo email
 */
usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario.' })

/**
 * Siempre, antes de que se ejecute un save, se ejecutará la función
 */
usuarioSchema.pre('save', function(next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

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