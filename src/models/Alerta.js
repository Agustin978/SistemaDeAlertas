class Alerta
{
    static #idCounter = 1;
    static TIPO_INFORMATIVA = 'Informativa';
    static TIPO_URGENTE = 'Urgente';

    constructor(tipo, mensaje, fechaExpira, paraTodos = false, usuarioParticular = null, temaID)
    {
        this.id = Alerta.#idCounter++;
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.fechaExpira = fechaExpira;
        this.paraTodos = paraTodos;
        this.usuarioParticular = usuarioParticular;
        this.temaID = temaID;
        this.leida = false;
    }

    estaExpirada()
    {
        return new Date() > this.fechaExpira;
    }
    marcaComoLeida()
    {
        this.leida = true;
    }
}

module.exports = Alerta;