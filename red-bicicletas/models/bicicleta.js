class Bicicleta {
    constructor(id, color, modelo, ubicacion) {
        this.id = id;
        this.color = color;
        this.modelo = modelo;
        this.ubicacion = ubicacion;
    }
    
    toString() {
        return `id: ${this.id} | color: ${this.color}`;
    }
}

module.exports = Bicicleta;