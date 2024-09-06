const Alerta = require('../models/Alerta');
const Tema = require('../models/Tema');
const Usuario = require('../models/Usuario');

class SistemaNotificaciones
{
    constructor()
    {
        this.usuarios = [];
        this.temas = [];
    }

    registrarUsuario(nombre, password)
    {
        const usuario = new Usuario(nombre, password);
        this.usuarios.push(usuario);
        return usuario;
    }

    registrarTema(titulo)
    {
        const tema = new Tema(titulo);
        this.temas.push(tema);
        return tema;
    }

    #buscaUsuarioPorID(usuarioId)
    {
        return this.usuarios.find(user => user.id == usuarioId);
    }

    #buscaTemaPorId(temaId)
    {
        return this.temas.find(tem => tem.id == temaId);
    }

    suscribeUsuarioEnTema(usuarioId, temaId)
    {
        try
        {
            let usuario = this.#buscaUsuarioPorID(usuarioId);
            if(usuario)
            {
                let tema = this.#buscaTemaPorId(temaId);
                if(tema)
                {
                    if(tema.suscribirUsuario(usuario))
                    {
                        return 200;
                    }
                }else
                {
                    throw new Error(`El usuario ${usuario.getNombre()} no se puede suscribir al tema, ya que el tema no esta registrado en el sistema.'`)
                }
            }else
            {
                throw new Error(`No se puede realizar la suscripcion en el tema ya que el usuario no se encuentra registrado.`)
            }
        }catch(error)
        {
            console.log(error.message);
        }
    }

    enviarAlerta(tipo, mensaje, fechaExpira, temaId, usuarioId = null)
    {
        try
        {
            const tema = this.#buscaTemaPorId(temaId);
            //Para el caso que se ingrese el id de un tema no registrado
            if(!tema)
            {
                throw new Error(`Error: El tema con ID ${temaId} no existe. No se puede crear la alerta.`);
            }
            //const alerta = new Alerta(tipo, mensaje, fechaExpira, usuarioId === null, usuarioId, temaId);
            //Se crea el tema segun el nivel de importancia
            let alerta;
            if(tipo === 'Urgente')
            {
                alerta = new Alerta.AlertaUrgente(mensaje, fechaExpira, usuarioId === null, usuarioId, temaId);
            }else
            {
                alerta = new Alerta.AlertaInformativa(mensaje, fechaExpira, usuarioId === null, usuarioId, temaId);
            }

            if(usuarioId === null)
            {
                tema.notificar(alerta);
            }else
            {
                const usuario = this.#buscaUsuarioPorID(usuarioId);
                //Para el caso en que el id del usuario no se encuentre registrado o el mismo no este suscripto al tema.
                if( usuario && tema.verificaUsuarioSuscrito(usuario))
                {
                    usuario.update(alerta);
                }else
                {
                    throw new Error(`El usuario no se encuetra registrado o el mismo no esta suscripto al tema ${tema.obtenerTitulo()}`);
                }
            }        
            return alerta;
        }catch(error)
        {
            console.error(error.message);
        }
    }

    #ordenarAlertas(alertas)
    {
        //Separamos las alertas urgentes de las informativas
        let urgentes = alertas.filter(a => a.prioridad() == 2);
        let informativas = alertas.filter(a => a.prioridad() != 2);
        //Ordenamiento
        urgentes.sort((a,b)=>b.id-a.id);
        informativas.sort((a,b)=>a.id-b.id);
        return [...urgentes, ...informativas];
/*
        return alertas.sort((a,b) => {
            if(a.prioridad === 2 && b.prioridad !== 2){
                return -1; //a es urgente sin embargo b no => a va antes
            }else if(a.prioridad !== 2 && b.prioridad === 2)
            {
                return 1; //a no es urgente sin embargo b si => b va antes
            }
            return b.id - a.id; //Para temas urgentes, se utiliza el orden LIFO (Last in, First out)
                                //Para temas informativos, se utiliza el orden FIFO (Fist in, First out)
        });*/
    }
    
    //Alertas no leidas del usuario y no expiradas.
    ObtenerAlertasNoLeidasDeUsuario(usuarioId)
    {
        try
        {
            const usuario = this.#buscaUsuarioPorID(usuarioId);
            if(usuario)
            {
                return this.#ordenarAlertas(usuario.obtenerAlertasNoLeidas().filter(alerta => !alerta.estaExpirada()));
            }else
            {
                throw new Error('El usuario no fue encontrado.');
            }
        }catch(error)
        {
            console.log(error.message);
        }
    }

    ObtenerAlertasNoExpiradasDeTema(temaId)
    {
        try
        {
            let tema = this.#buscaTemaPorId(temaId);
            if(tema)
            {
                let alertasNoExpiradas = [];
                tema.observers.forEach(usuario => {
                    let alertasUsuario = usuario.buscarAlertasPorTema(temaId);
                    alertasNoExpiradas = [...alertasNoExpiradas, ...alertasUsuario];
                });
                return this.#ordenarAlertas(alertasNoExpiradas);
            }else
            {
                throw new Error('El tema del que se estan buscando alertas no existe.')
            }
        }catch(error)
        {
            console.log(error.message);
        }
        /*
        const alertasNoExpiradas = this.alertas.filter(alerta =>  
            !alerta.estaExpirada() && 
            alerta.paraTodos &&
            alerta.temaID === temaId
        );*/
    }

    marcarAlertaComoLeida(usuarioId, alertaId)
    {
        try
        {
            const usuario = this.#buscaUsuarioPorID(usuarioId);
            if(usuario)
            {
                const alertaNoLeida = usuario.obtenerAlertasNoLeidas().find(al=>al.id===alertaId);
                if(alertaNoLeida)
                {
                    usuario.alertaLeida(alertaNoLeida); //Muevo la alerta a alerta leida
                    console.log('La alerta ',alertaNoLeida.mensaje,' con id ',alertaNoLeida.id,' se marco como leida, para el ususario ',usuario.getNombre());
                }else
                {
                    throw new Error('La alerta no fue encontrada o ya fue leída.');
                }
            }else
            {
                throw new Error('El usuario no fue encontrado.');
            }
        }catch(error)
        {
            console.log(error.message);
        }
    }

    ObtenerAlertasLeidasPorUsuario(usuarioId)
    {
        try
        {
            const usuario = this.#buscaUsuarioPorID(usuarioId);
            if(usuario)
            {
                return this.#ordenarAlertas(usuario.obtenerAlertasYaLeidas());
            }else
            {
                throw new Error('El usuario no fue encontrado.');
            }
        }catch(error)
        {
            console.log(error.message);
        }
    }
}
module.exports = SistemaNotificaciones; 