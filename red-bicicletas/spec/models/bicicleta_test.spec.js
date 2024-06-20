const Bicicleta = require("../../models/bicicleta");
const BicicletaContainer = require("../../models/bicicletaContainer");

const bicicletaContainer = new BicicletaContainer();

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