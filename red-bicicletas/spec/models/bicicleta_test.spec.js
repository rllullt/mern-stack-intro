const mongoose = require('mongoose');
const Bicicleta = require("../../models/bicicleta");
const bicicletaContainer = require("../../models/bicicletaContainer");

describe('Testing Bicicletas', function() {
    beforeAll(function(done) {
        const mongoDB = 'mongodb://localhost/testdb';
        mongoose.connect(mongoDB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error'));
        db.once('open', function() {
            console.log('We are connected to test database!');
            done();  // con done sale del beforeEach
        });
    });

    afterEach(function(done) {
        Bicicleta.deleteMany().then(() => {
            // Success
            console.log("Deleted Many");
            done();
        }).catch(error => {
            // Failure
            console.log(error);
        });
    });

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de Bicicleta', (done) => {
            const bici = Bicicleta.createInstance(1, "verde", "urbana", [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe("verde");
            expect(bici.modelo).toBe("urbana");
            expect(bici.ubicacion[0]).toEqual(-34.5);
            expect(bici.ubicacion[1]).toEqual(-54.1);

            done();
        });
    });

    describe("Bicicleta.allBicis", () => {
        it('Comienza vacía', async () => {
            const bicis = await Bicicleta.allBicis();
            expect(bicis.length).toBe(0);
        });
    });

    describe("Bicicleta.add", () => {
        it('agregamos solo una bici', async () => {
            const aBici = new Bicicleta({code: 1, color: 'rojo', modelo: 'urbana'});
            await Bicicleta.add(aBici);
            const bicis = await Bicicleta.allBicis();
            expect(bicis.length).toBe(1);
            expect(bicis[0].code).toEqual(aBici.code);
        });
    });
});

/*
beforeEach(() => { bicicletaContainer.allBicis = []; });

describe("bicicletaContainer.allBicis", () => {
    it('Comienza vacía', () => {
        expect(bicicletaContainer.allBicis.length).toBe(0);
    });
});

describe("bicicletaContainer.add", () => {
    it('agregamos una', () => {
        const a = new Bicicleta(1, 'rojo', 'urbana', [-34.6012424, -58.3861497]);
        bicicletaContainer.add(a);
        expect(bicicletaContainer.allBicis.length).toBe(1);
        expect(bicicletaContainer.allBicis[0]).toBe(a);
    });
});

describe("bicicletaContainer.findById", () => {
    it('debe devolver bici con id 1', () => {
        expect(bicicletaContainer.allBicis.length).toBe(0);
        const a = new Bicicleta(1, 'verde', 'urbana', [-34.6012424, -58.3861497]);
        const b = new Bicicleta(2, 'azul', 'urbana', [-34.596932, -58.3808287]);
        bicicletaContainer.add(a);
        bicicletaContainer.add(b);

        const targetBici = bicicletaContainer.findById(1);
        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(a.color)
        expect(targetBici.modelo).toBe(a.modelo);
    });
});

describe("bicicletaContainer.removeById", () => {
    it('debe remover bici con id 1', () => {
        expect(bicicletaContainer.allBicis.length).toBe(0);
        const a = new Bicicleta(1, 'verde', 'urbana', [-34.6012424, -58.3861497]);
        const b = new Bicicleta(2, 'azul', 'urbana', [-34.596932, -58.3808287]);
        bicicletaContainer.add(a);
        bicicletaContainer.add(b);

        expect(bicicletaContainer.allBicis.length).toBe(2);

        bicicletaContainer.removeById(1);
        expect(bicicletaContainer.allBicis.length).toBe(1);
        expect(bicicletaContainer.findById(2)['color']).toBe('azul');
    })
})
*/