class Alerta
{
    static #idCounter = 0;
    static TIPO_INFORMATIVA = 'Informativa';
    static TIPO_URGENTE = 'Urgente';

    constructor(tipo, mensaje, fechaExpira, paraTodos = false, usuarioParticular = null)
    {
        this.id = Alerta.#idCounter++;
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.fechaExpira = fechaExpira;
        this.paraTodos = paraTodos;
        this.usuarioParticular = usuarioParticular;
    }

    estaExpirada()
    {
        return new Date() > this.fechaExpira;
    }
}

module.exports = Alerta;