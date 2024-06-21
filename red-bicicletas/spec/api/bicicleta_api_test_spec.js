const Bicicleta = require("../../models/bicicleta");
const bicicletaContainer = require("../../models/bicicletaContainer");
const request = require("request");
const server = require("../../bin/www");  // this gets up the server when the script runs

beforeEach(() => { bicicletaContainer.allBicis = []; });

describe("Bicicleta API", () => {
    describe('GET BICICLETAS /', () => {
        it('Status 200', () => {
            expect(bicicletaContainer.allBicis.length).toBe(0);

            const a = new Bicicleta(1, 'verde', 'urbana', [-34.6012424, -58.3861497]);
            bicicletaContainer.add(a);

            request.get('http://localhost:3000/api/bicicletas', function(error, response, body) {
                expect(response.statusCode).toBe(200);
            });
        });
    });

    describe('POST BICICLETAS /create', () => {
        it('Status 200', (done) => {  // done is a callback executed at the end of the test, to finish it
            const headers = {'content-type': 'application/json'};
            const bici_json = '{ "id": 10, "color": "rojo", "modelo": "urbana", "lat": -34, "lng": -54 }';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: bici_json,
            }, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                expect(bicicletaContainer.findById(10).color).toBe('rojo');
                done();
            });
        });
    });

    describe('DELETE BICICLETAS /delete', () => {
        it('Status 204', (done) => {
            const headers = {'content-type': 'application/json'};
            const bici_json = '{ "id": 10, "color": "rojo", "modelo": "urbana", "lat": -34, "lng": -54 }';
            request.post({
                headers: headers,
                url: 'http://localhost:3000/api/bicicletas/create',
                body: bici_json,
            }, (error, response, body) => {
                expect(response.statusCode).toBe(200);
                expect(bicicletaContainer.findById(10).color).toBe('rojo');
                done();
            });
            request.delete({
                url: 'http://localhost:3000/api/bicicletas/delete',
                body: '{ "id": 10 }',
            }, (error, response, body) => {
                expect(response.statusCode).toBe(204);
            });
        });
    });
});