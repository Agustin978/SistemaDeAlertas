class Usuario
{
    static #idCounter = 0;

    constructor(nombre, password)
    {
        this.id = Usuario.#idCounter++;
        this.nombre = nombre;
        this.password = password;
        this.temasSuscrito = [];
        this.alertasNoLeidas = [];
    }

    getNombre(){return this.nombre;}
    suscribeATema(tema){
        this.temasSuscrito.push(tema);
    }
    recibirAlerta(alerta)
    {
        this.alertasNoLeidas.push(alerta);
    }
    alertaLeida(alerta)
    {
        this.alertasNoLeidas = this.alertasNoLeidas.filter(a => a !== alerta);
    }
    obtenerAlertasNoLeidas()
    {
        return this.alertasNoLeidas;
    }
}

module.exports = Usuario;