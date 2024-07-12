const mongoose = require('mongoose');
const Bicicleta = require('../../models/bicicleta');
const Usuario = require('../../models/usuario');
const Reserva = require('../../models/reserva');

describe('Testing Usuarios', function() {
    beforeAll(function(done) {
        const mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB);

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            console.log('We are connected to test database!');
            done();  // con done sale del beforeEach
        });
    });

    afterEach(function(done) {
        Reserva.deleteMany().then(() => {
            // Success
            console.log("Deleted Many Reserva");
            Usuario.deleteMany().then(() => {
                console.log("Deleted Many Usuario");
                Bicicleta.deleteMany().then(() => {
                    console.log("Deleted Many Bicicleta");
                    done();
                });
            });
        }).catch(error => {
            // Failure
            console.log(error);
        });
    });

    describe('Cuando un Usuario reserva una bici', () => {
        it('debe existir la reserva', async () => {
            const usuario = new Usuario({nombre: 'Ezequiel'});
            await usuario.save();
            const bicicleta = new Bicicleta({code: 1, color: 'rojo', modelo: 'urbana'});
            await bicicleta.save();
    
            const hoy = new Date();
            const mañana = new Date();
            mañana.setDate(hoy.getDate()+1);
            await Usuario.reservar(bicicleta.id, usuario.id, hoy, mañana);

            const reservas = await Reserva.find({}).populate('bicicleta').populate('usuario').exec();
            // console.log('debe existir la reserva, reservas:', reservas);
            expect(reservas.length).toBe(1);
            expect(reservas[0].diasDeReserva()).toBe(2);
            expect(reservas[0].bicicleta.code).toBe(1);
            expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
        });
    });
});
