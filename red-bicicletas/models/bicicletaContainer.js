class BicicletaContainer {
    constructor() {
        this.allBicis = [];
    }

    add(aBici) {
        this.allBicis.push(aBici);
    }
    
    findById(aBiciId) {
        const id = parseInt(aBiciId);
        const aBici = this.allBicis.find(x => x.id === id);
        if (aBici !== undefined)
            return aBici;
        throw new Error(`No existe una bicicleta con el id ${aBiciId}`);
    }

    removeById(aBiciId) {
        const id = parseInt(aBiciId);
        this.findById(id);  // se revisa la existencia
        for (let i = 0; i < this.allBicis.length; i++) {
            if (this.allBicis[i].id === id) {
                this.allBicis.splice(i, 1);
                break;
            }
        }
    }
}

module.exports = BicicletaContainer;