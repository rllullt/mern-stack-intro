const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Reserva = require('./reserva');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const Token = require('../models/token');
const mailer = require('../mailer/mailer');

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
    googleId: String,
    facebookId: String,
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

usuarioSchema.methods.resetPassword = function() {
    const token = new Token({ _userId: this.id, token: crypto.randomByites(16).toString('hex') });
    const email_destination = this.email;
    return new Promise((resolve, reject) => {
        token.save(err => {
            if (err) reject(err);

            const mailOptions = {
                from: 'no-reply@redbicicletas.com',
                to: email_destination,
                subject: 'Restablecimiento de contraseña',
                text: `<p>Hola,</p>
                <br>
                <p>Por favor, para restablecer su contraseña haga clic en el siguiente enlace:
                <br>
                http://localhost:3000/resetPassword/${token.token} .
                </p>`
            };

            mailer.sendEmail(mailOptions).then(() => {
                console.log(`Se envió un email para restablecer la contraseña a: ${email_destination}.`);
                resolve();
            }).catch(err => reject(err));
        });
    });
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

usuarioSchema.statics.findOneOrCreateByGoogle = function findOneOrCreate(condition) {
    console.log('condition:', condition);
    return new Promise((resolve, reject) => {
        this.findOne({
            $or:[
                {'googleId': condition.id}, {'email': condition.emails[0].value}
            ]
        }).then(user => {
            if (user) return resolve(user);  // login
    
            // Not user, registro
            console.log('--------- CONDITION ---------');
            console.log(condition);
            const values = {};
            values.googleId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'SIN NOMBRE';
            values.verificado = true;
            values.password = crypto.randomBytes(16).toString('hex');  // random password not given to user
            // values.password = condition._json.etag;
            console.log('--------- VALUES ---------');
            console.log(values);
            this.create(values).then(user => {
                return resolve(user);
            }).catch(err => {
                console.error(err);
                reject(new Error(err));
            })
        }).catch(err => {
            console.error(err);
            reject(new Error(err));
        });
    })
}

usuarioSchema.statics.findOneOrCreateByFacebook = function findOneOrCreate(condition) {
    console.log('condition:', condition);
    return new Promise((resolve, reject) => {
        this.findOne({
            $or:[
                {'facebookId': condition.id}, {'email': condition.emails[0].value}
            ]
        }).then(user => {
            if (user) return resolve(user);  // login
    
            // Not user, registro
            console.log('--------- CONDITION ---------');
            console.log(condition);
            const values = {};
            values.facebookId = condition.id;
            values.email = condition.emails[0].value;
            values.nombre = condition.displayName || 'SIN NOMBRE';
            values.verificado = true;
            values.password = crypto.randomBytes(16).toString('hex');  // random password not given to user
            // values.password = condition._json.etag;
            console.log('--------- VALUES ---------');
            console.log(values);
            this.create(values).then(user => {
                return resolve(user);
            }).catch(err => {
                console.error(err);
                reject(new Error(err));
            })
        }).catch(err => {
            console.error(err);
            reject(new Error(err));
        });
    })
}

usuarioSchema.methods.enviar_email_bienvenida = function(cb) {
    const token = new Token({
        _userid: this.id,
        token: crypto.randomByites(16).toString('hex'),
    });
    const email_destination = this.email;
    token.save(function(err) {
        if (err) {
            return console.log(err.message);
        }
        const html = `<p>Hola,</p>
            <br>
            <p>Por favor, para verificar su cuenta haga clic en el siguiente enlace:
            <br>
            http://localhost:3000\/token/confirmation\/${token.token} .
            </p>`;
        console.log('Sending email:', html);
        return mailer.sendEmail(
            email_destination,
            'Verificación de cuenta',
            html
        );
    });
}

module.exports = mongoose.model('Usuario', usuarioSchema);