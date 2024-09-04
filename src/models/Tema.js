class Tema
{
    static #idCounter = 0;
    
    constructor(titulo) {
        this.id = Tema.#idCounter++;
        this.titulo = titulo;
    }
}

module.exports = Tema;