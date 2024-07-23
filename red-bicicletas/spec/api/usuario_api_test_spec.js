const mongoose = require('mongoose');
const Usuario = require("../../models/usuario");
const Bicicleta = require("../../models/bicicleta");
const Reserva = require("../../models/reserva");
const request = require("request");
const server = require("../../bin/www");  // this gets up the server when the script runs

describe("Usuario API", () => {
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
        Bicicleta.deleteMany().then(() => {
            // Success
            Usuario.deleteMany().then(() => {
                // Success
                Reserva.deleteMany().then(() => {
                    done();
                });
            });
        }).catch(error => {
            // Failure
            console.log(error);
        });
    });

    describe('GET USUARIOS /', () => {
        it('Status 200', (done) => {
            Usuario.allUsuarios().then(usuarios => {
                expect(usuarios.length).toBe(0);
                const usuario = new Usuario({nombre: 'Adán'});
                Usuario.add(usuario).then(() => {
                    request.get('http://localhost:3000/api/usuarios', function(error, response, body) {
                        expect(response.statusCode).toBe(200);
                        done();
                    });
                });
            });
        });
    });

    describe('POST USUARIOS /reservar', () => {
        it('Status 200', (done) => {
            const usuario = new Usuario({nombre: 'Elvis'});
            usuario.save().then(() => {
                const bicicleta = new Bicicleta({code: 1, color: 'rojo', modelo: 'urbana'});
                bicicleta.save().then(() => {
                    const hoy = new Date();
                    const mañana = new Date();
                    mañana.setDate(hoy.getDate()+1);
                    const headers = {'Content-Type': 'application/json'};
                    const reserva_json = `{ "id": "${usuario.id}", "bici_id": "${bicicleta.id}", "desde": "${hoy}", "hasta": "${mañana}" }`;
                    request.post({
                        headers: headers,
                        url: 'http://localhost:3000/api/usuarios/reservar',
                        body: reserva_json,
                    }, (err, res, body) => {
                        Reserva.find({}).populate('bicicleta').populate('usuario').exec().then(reservas => {
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

    describe('POST USUARIOS /create', () => {
        it('Status 200', (done) => {
            const headers = {'content-type': 'application/json'};
            const usuario_json = '{ "nombre": "Efrofriendlyns" }';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/usuarios/create',
                body: usuario_json,
            }, (err, res, body) => {
                expect(res.statusCode).toBe(200);
                Usuario.allUsuarios().then(usuarios => {
                    expect(usuarios[0].nombre).toBe('Efrofriendlyns');
                    done();
                });
            });
        });
    });
});