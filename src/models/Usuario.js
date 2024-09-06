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
        alerta.marcaComoLeida();
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
        let alertas = [...this.alertasNoLeidas, ...this.alertasYaLeidas];
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
                this.#eliminarAlerta(alertaGuardada.id);
                return false;
            }else if(alertaGuardada.prioridad === alertaNueva.prioridad)
            {
                return true;
            }else if(alertaGuardada.prioridad > alertaNueva.prioridad)
            {
                return true;
            }else
            {
                this.#eliminarAlerta(alertaGuardada.id);
                return false;
            }
        }else
        {
            return false;
        }
    }
}

module.exports = Usuario;