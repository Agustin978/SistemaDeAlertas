class Tema
{
    static #idCounter = 0;
    
    constructor(nombre) {
        this.id = Tema.#idCounter++;
        this.nombre = nombre;
    }
}

module.exports = Tema;