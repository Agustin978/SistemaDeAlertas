const Alerta = require('../models/Alerta');
const Tema = require('../models/Tema');
const Usuario = require('../models/Usuario');

class SistemaNotificaciones
{
    constructor()
    {
        this.usuarios = [];
        this.temas = [];
        this.alertas = [];
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

    enviarAlerta(tipo, mensaje, fechaExpira, temaId, usuarioId = null)
    {
        const tema = this.temas.find(tem => tem.id == temaId);
        const alerta = new Alerta(tipo, mensaje, fechaExpira, usuarioId === null, usuarioId);
        this.alertas.push(alerta);
        if(usuarioId === null)
            {
                this.usuarios.forEach(usuario =>{
                    if(usuario.temasSuscrito.includes(tema))
                    {
                        usuario.recibirAlerta(alerta);
                    }
                });
            }else
            {
                const usuario = this.usuarios.find(user => user.id == usuarioId);
                usuario.recibirAlerta(alerta);
            }        
    }

    ordenarAlertas(alertas)
    {
        return alertas.sort((a,b) => {
            if(a.tipo === Alerta.TIPO_URGENTE && b.tipo !== Alerta.TIPO_URGENTE){
                return -1; //a es urgente sin embargo b no => a va antes
            }else if(a.tipo !== Alerta.TIPO_URGENTE && b.tipo === Alerta.TIPO_URGENTE)
            {
                return 1; //a no es urgente sin embargo b si => b va antes
            }
            return b.id - a.id; //Para temas urgentes, se utiliza el orden LIFO (Last in, First out)
                                //Para temas informativos, se utiliza el orden FIFO (Fist in, First out)
        });
    }
    
    ObtenerAlertasNoLeidasDeUsuario(usuarioId)
    {
        const usuario = this.usuarios.find(user => user.id === usuarioId);
        return this.ordenarAlertas(usuario.obtenerAlertasNoLeidas());
    }

    ObtenerAlertasNoExpiradasDeTema(temaId)
    {
        const alertasNoExpiradas = this.alertas.filter(alerta => 
            alerta.temaId === temaId && 
            !alerta.estaExpirada() && 
            alerta.paraTodos);
        return this.ordenarAlertas(alertasNoExpiradas);
    }
}
module.exports = SistemaNotificaciones; 