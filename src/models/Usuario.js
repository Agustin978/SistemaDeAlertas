class Usuario
{
    static #idCounter = 1;

    constructor(nombre, password)
    {
        this.id = Usuario.#idCounter++;
        this.nombre = nombre;
        this.password = password;
        this.alertasNoLeidas = [];
        this.alertasYaLeidas = [];
    }

    getNombre(){return this.nombre;}
    /*
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
    }*/

    #recibirAlerta(alerta)
    {
        this.alertasNoLeidas.push(alerta);
    }

    #eliminarAlerta(alertaId)
    {
        this.alertasNoLeidas = this.alertasNoLeidas.filter(a => a.id !== alertaId);
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

    buscarAlertasPorTema(temaId)
    {
        //Combino alertas leidas con no leidas
        let alertas = [...this.alertasNoLeidas, ...this.alertasYaLeidas];

        //Filtrado de alertas por id del tema y por expiracion de alerta
        let alertasFiltradas = alertas.filter(alerta => alerta.temaID === temaId && !alerta.estaExpirada());
        return alertasFiltradas;
    }

    update(alerta)
    {
        try
        {
            if(!this.#alertaRepetida(alerta))
            {
                return this.#recibirAlerta(alerta);
            }else
            {
                throw new Error(`El usuario ${this.getNombre()} ya contiene una alerta similar o idéntica a la ingresada`);
            }
        }catch(error)
        {
            console.log(error.message);
        }
    }

    #alertaRepetida(alertaNueva)
    {
        let alertaGuardada = this.alertasNoLeidas.find(al => al.temaID === alertaNueva.temaID);
        if(alertaGuardada)
        {
            if(alertaGuardada.estaExpirada())
            {
                this.#eliminarAlerta(alertaGuardada.id); //Se elimina la alerta repetida que esta expirada
                return false;
            }else if(alertaGuardada.prioridad === alertaNueva.prioridad)
            {
                return true; //Entonces la alerta se estaria repitiendo
            }else if(alertaGuardada.prioridad > alertaNueva.prioridad)
            {
                return true; //Si ya existe una alerta con alta prioridad sobre un tema
            }else
            {
                this.#eliminarAlerta(alertaGuardada.id); //Se elimina la alerta almacenada ya que tiene menor prioridad que la entrante.
                return false;
            }
        }else
        {
            return false;
        }
    }
}

module.exports = Usuario;