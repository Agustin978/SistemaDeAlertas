class Tema
{
    static #idCounter = 1;
    
    constructor(titulo) {
        this.id = Tema.#idCounter++;
        this.titulo = titulo;
    }

    obtenerTitulo()
    {
        return this.titulo;
    }
}

module.exports = Tema;