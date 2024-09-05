class Tema
{
    static #idCounter = 1;
    
    constructor(titulo) {
        this.id = Tema.#idCounter++;
        this.titulo = titulo;
        this.observers = []; //Aqui se almacenara la lista de usuarios suscritos al tema
    }

    obtenerTitulo()
    {
        return this.titulo;
    }

    suscribirUsuario(usuario)
    {
        try
        {
            if(!this.observers.includes(usuario))
            {
                this.observers.push(usuario);
            }else
            {
                throw new Error(`El usuario ${usuario.getNombre()} ya se encuentra suscripto al tema ${this.titulo}`);
            }
        }catch(error)
        {
            console.log(error.message);
        }
    }

    notificar(alerta)
    {
        this.observers.forEach(obs => obs.update(alerta));
    }

    verificaUsuarioSuscrito(usuario)
    {
        return this.observers.includes(usuario);
    }
}

module.exports = Tema;