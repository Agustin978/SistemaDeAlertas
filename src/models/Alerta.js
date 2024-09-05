class Alerta
{
    static #idCounter = 1;

    constructor(tipo, mensaje, fechaExpira, paraTodos = false, usuarioParticular = null, temaID)
    {
        this.id = Alerta.#idCounter++;
        this.mensaje = mensaje;
        this.fechaExpira = fechaExpira;
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
    prioridad()
    {
        return 0;
    }
}

class AlertaInformativa extends Alerta
{
    prioridad(){return 1;}
}

class AlertaUrgente extends Alerta
{
    prioridad(){return 2;}
}
module.exports = {Alerta, AlertaInformativa, AlertaUrgente};