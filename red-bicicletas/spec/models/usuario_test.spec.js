const mongoose = require('mongoose');
const Bicicleta = require('../../models/bicicleta');
const Usuario = require('../../models/usuario');
const Reserva = require('../../models/reserva');

describe('Testing Usuarios', function() {
    beforeAll(function(done) {
        /*
        ready states:
          0: disconnected
          1: connected
          2: connecting
          3: disconnecting
        */
        const db = mongoose.connection;
        const mongoDB = 'mongodb://localhost/testdb';
        if (db.readyState === 0) {
            mongoose.connect(mongoDB);
            db.on('error', console.error.bind(console, 'connection error'));
            db.once('open', function() {
                console.log('We are connected to test database!');
                done();  // con done sale del beforeEach
            });
        }
        else {
            db.useDb(mongoDB); // Switching happens here..
            done();
        }
    });

    afterEach(function(done) {
        Reserva.deleteMany().then(() => {
            // Success
            Usuario.deleteMany().then(() => {
                Bicicleta.deleteMany().then(() => {
                    done();
                });
            });
        }).catch(error => {
            // Failure
            console.log(error);
        });
    });

    describe("Usuario.allUsuarios", () => {
        it('Comienza vacía', (done) => {
            Usuario.allUsuarios().then(usuarios => {
                expect(usuarios.length).toBe(0);
                done();
            });
        });
    });

    describe("Usuario.add", () => {
        it('agregamos solo un usuario', (done) => {
            const usuario = new Usuario({nombre: 'Adán'});
            Usuario.add(usuario).then(() => {
                Usuario.allUsuarios().then(usuarios => {
                    expect(usuarios.length).toBe(1);
                    expect(usuarios[0].nombre).toBe('Adán');
                    done();
                });
            });
        });
    });

    describe('Cuando un Usuario reserva una bici', () => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({nombre: 'Ezequiel'});
            usuario.save().then(() => {
                const bicicleta = new Bicicleta({code: 1, color: 'rojo', modelo: 'urbana'});
                bicicleta.save().then(() => {
                    const hoy = new Date();
                    const mañana = new Date();
                    mañana.setDate(hoy.getDate()+1);
                    Usuario.reservar(bicicleta.id, usuario.id, hoy, mañana).then(reserva => {
                        // console.log('reserva hecha');
                        Reserva.find({}).populate('bicicleta').populate('usuario').exec().then(reservas => {
                            // console.log('debe existir la reserva, reservas:', reservas);
                            expect(reservas.length).toBe(1);
                            expect(reservas[0].diasDeReserva()).toBe(2);
                            expect(reservas[0].bicicleta.code).toBe(1);
                            expect(reservas[0].usuario.nombre).toBe(usuario.nombre);
                            done();
                        });
                    });
                });
            });
    
        });
    });
});
