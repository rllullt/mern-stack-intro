const mongoose = require('mongoose');
const Bicicleta = require("../../models/bicicleta");
const bicicletaContainer = require("../../models/bicicletaContainer");
const request = require("request");
const server = require("../../bin/www");  // this gets up the server when the script runs

describe("Bicicleta API", () => {
    // beforeAll(function(done) {
    //     const mongoDB = 'mongodb://localhost/testdb';
    //     mongoose.connect(mongoDB);

    //     const db = mongoose.connection;
    //     db.on('error', console.error.bind(console, 'connection error'));
    //     db.once('open', function() {
    //         console.log('We are connected to test database!');
    //         done();
    //     });
    // });

    afterEach(function(done) {
        Bicicleta.deleteMany().then(() => {
            // Success
            Bicicleta.allBicis().then(bicis => {
                done();
            });
        }).catch(error => {
            // Failure
            console.log(error);
        });
    });

    describe("Bicicleta.allBicis", () => {
        it('Comienza vacía', (done) => {
            Bicicleta.allBicis().then(bicis => {
                expect(bicis.length).toBe(0);
                done();
            });
        });
    });

    describe('GET BICICLETAS /', () => {
        it('Status 200', (done) => {
            Bicicleta.allBicis().then(bicis => {
                expect(bicis.length).toBe(0);
                const aBici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana', lat: -34.6012424, lng: -58.3861497});
                Bicicleta.add(aBici).then(() => {
                    request.get('http://localhost:3000/api/bicicletas', function(error, response, body) {
                        // console.log('error:', error);
                        expect(response.statusCode).toBe(200);
                        done();
                    });
                });
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('Status 200', (done) => {  // done is a callback executed at the end of the test, to finish it
            const headers = {'content-type': 'application/json'};
            const bici_json = '{ "code": 10, "color": "rojo", "modelo": "urbana", "lat": -34, "lng": -54 }';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: bici_json,
            }, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                // console.log('error:', error);
                Bicicleta.allBicis().then(bicis => {
                    expect(bicis[0].code).toBe(10);
                    expect(bicis[0].color).toBe('rojo');
                    done();
                });
            });
        });
    });

    describe('DELETE BICICLETAS /delete', () => {
        it('Status 204', (done) => {
            const headers = {'Content-Type': 'application/json'};
            const bici_json = '{ "code": 10, "color": "rojo", "modelo": "urbana", "lat": -34, "lng": -54 }';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: bici_json,
            }, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                request.delete({
                    headers: headers,
                    url: 'http://localhost:3000/api/bicicletas/delete',
                    body: '{ "code": 10 }',
                }, (error, response, body) => {
                    expect(response.statusCode).toBe(204);
                    done();
                });
            });
        });
    });
});