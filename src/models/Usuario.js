class Usuario
{
    static #idCounter = 1;

    constructor(nombre, password)
    {
        this.id = Usuario.#idCounter++;
        this.nombre = nombre;
        this.password = password;
        this.temasSuscrito = [];
        this.alertasNoLeidas = [];
        this.alertasYaLeidas = [];
    }

    getNombre(){return this.nombre;}
    suscribeATema(tema){
        if(!this.temasSuscrito.includes(tema))
        {
            this.temasSuscrito.push(tema);
        }else
        {
            console.error('El usuario ',this.nombre,' ya se encuentra suscripto en este tema (',tema.titulo,')');
        }
    }

    verificaSuscripcionATema(tema)
    {
        return this.temasSuscrito.includes(tema);
    }

    recibirAlerta(alerta)
    {
        this.alertasNoLeidas.push(alerta);
    }

    alertaLeida(alerta)
    {
        this.alertasNoLeidas = this.alertasNoLeidas.filter(a => a !== alerta);
        if(!this.alertasNoLeidas.includes(alerta))
        {
            this.alertasYaLeidas.push(alerta);
        }
        alerta.marcaComoLeida(); //Cambia el estado de la alerta a 'leida'
    }

    obtenerAlertasNoLeidas()
    {
        return this.alertasNoLeidas;
    }

    obtenerAlertasYaLeidas()
    {
        return this.alertasYaLeidas;
    }

    obtenerTemasSuscriptos()
    {
        return this.temasSuscrito;
    }
}

module.exports = Usuario;