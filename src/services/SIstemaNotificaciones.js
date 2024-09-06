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
            if(!tema)
            {
                throw new Error(`Error: El tema con ID ${temaId} no existe. No se puede crear la alerta.`);
            }
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
        let urgentes = alertas.filter(a => a.prioridad() == 2);
        let informativas = alertas.filter(a => a.prioridad() != 2);
        urgentes.sort((a,b)=>b.id-a.id);
        informativas.sort((a,b)=>a.id-b.id);
        return [...urgentes, ...informativas];
    }
    
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
                    usuario.alertaLeida(alertaNoLeida);
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